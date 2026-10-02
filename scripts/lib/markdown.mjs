/**
 * A deliberately tiny Markdown renderer for blog posts / policy pages.
 * Supports: ## / ### headings, paragraphs, - bullets, 1. numbered lists,
 * > quotes, **bold**, *italic*, [links](url).
 * All text is HTML-escaped first, so content files cannot inject markup.
 */
import { esc, slugify } from './util.mjs';

function inline(text) {
  let s = esc(text);
  // [text](url) — only http(s), site-relative, hash or .html links are allowed
  s = s.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|\/|#|[\w./-]+\.html)[^\s)]*)\)/g,
    (m, label, url) => {
      const external = /^https?:\/\//.test(url);
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    },
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  return s;
}

/**
 * @param {string} src
 * @returns {{ html: string, headings: {id: string, text: string}[] }}
 */
export function markdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').trim().split('\n');
  const out = [];
  const headings = [];
  const seen = new Set();
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.type}>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      flushPara();
      flushList();
      const level = m[1].length;
      let id = slugify(m[2].replace(/^\d+\.\s*/, '')) || 'section';
      while (seen.has(id)) id += '-2';
      seen.add(id);
      if (level === 2) headings.push({ id, text: m[2] });
      out.push(`<h${level} id="${id}">${inline(m[2])}</h${level}>`);
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(m[1]);
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(m[1]);
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      out.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`);
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return { html: out.join('\n'), headings };
}
