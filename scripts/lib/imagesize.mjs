/**
 * Read the pixel size of a WebP / PNG / JPEG / GIF / SVG file without any dependency.
 * Used so every <img> gets width + height (prevents layout shift = faster, steadier pages).
 */
import fs from 'node:fs';

const cache = new Map();

export function imageSize(file) {
  if (cache.has(file)) return cache.get(file);
  const size = read(file);
  cache.set(file, size);
  return size;
}

function read(file) {
  const buf = fs.readFileSync(file);
  const head = buf.toString('latin1', 0, 16);

  // ---- WebP
  if (head.startsWith('RIFF') && buf.toString('latin1', 8, 12) === 'WEBP') {
    const type = buf.toString('latin1', 12, 16);
    if (type === 'VP8X') {
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
    if (type === 'VP8 ') {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (type === 'VP8L') {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }

  // ---- PNG
  if (buf[0] === 0x89 && head.slice(1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // ---- GIF
  if (head.startsWith('GIF8')) {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }

  // ---- JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  // ---- SVG (viewBox)
  const text = buf.toString('utf8', 0, Math.min(buf.length, 2048));
  const vb = text.match(/viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/);
  if (vb) return { width: Math.round(parseFloat(vb[1])), height: Math.round(parseFloat(vb[2])) };

  throw new Error(`Could not read image size of ${file}`);
}
