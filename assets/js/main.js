/* ==========================================================================
   ACHIEVE ABOARD — site behaviour (no dependencies)
   1. Header + mobile menu      4. Inquiry form → WhatsApp / email
   2. Scroll reveal             5. Optional click tracking (Meta Pixel / GA4)
   3. University search + filter
   ========================================================================== */
(function () {
  'use strict';

  window.aaReady = true; // tells the page's fail-safe timer that this script loaded
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* 1. Header + mobile menu                                             */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    var desktop = window.matchMedia('(min-width: 1180px)');

    var setNav = function (open, returnFocus) {
      nav.classList.toggle('is-open', open);
      root.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true', true);
    });

    // Close after choosing a link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false, false);
    });

    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        setNav(false, true);
        return;
      }
      if (e.key === 'Tab') {
        // keep keyboard focus inside the open menu
        var items = [toggle].concat([].slice.call(nav.querySelectorAll('a[href]')));
        var firstEl = items[0];
        var lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    var onBreakpoint = function (e) {
      if (e.matches) setNav(false, false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ------------------------------------------------------------------ */
  /* 2. Scroll reveal (subtle fade/slide). Falls back to "visible".      */
  /* ------------------------------------------------------------------ */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  var finish = function (el) {
    // remove the helper classes afterwards so hover effects on cards keep working
    window.setTimeout(function () {
      el.classList.remove('reveal', 'is-in');
    }, 1200);
  };
  if (!revealEls.length) {
    // nothing to do
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.remove('reveal');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
          finish(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. University search + filter                                       */
  /* ------------------------------------------------------------------ */
  var filterRoot = document.querySelector('[data-uni-filter]');
  if (filterRoot) {
    (function () {
      var q = filterRoot.querySelector('[data-q]');
      var program = filterRoot.querySelector('[data-program]');
      var chips = [].slice.call(filterRoot.querySelectorAll('[data-country-btn]'));
      var cards = [].slice.call(filterRoot.querySelectorAll('.uni'));
      var count = filterRoot.querySelector('[data-count]');
      var empty = filterRoot.querySelector('[data-empty]');
      var moreWrap = filterRoot.querySelector('[data-more-wrap]');
      var moreBtn = filterRoot.querySelector('[data-more]');
      var resetBtn = filterRoot.querySelector('[data-reset]');
      var pageSize = parseInt(filterRoot.getAttribute('data-page-size'), 10) || 6;
      var country = '';
      var shown = pageSize;

      var norm = function (s) {
        return String(s || '')
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
      };

      var matches = function (card) {
        if (country && card.getAttribute('data-country') !== country) return false;
        if (program.value && card.getAttribute('data-programs').split('|').indexOf(program.value) === -1) return false;
        var term = norm(q.value);
        if (!term) return true;
        var hay = norm(card.getAttribute('data-search'));
        return term.split(/\s+/).every(function (t) {
          return hay.indexOf(t) !== -1;
        });
      };

      var syncUrl = function () {
        if (!window.history || !history.replaceState) return;
        var params = new URLSearchParams();
        if (country) params.set('country', country);
        if (program.value) params.set('program', program.value);
        if (q.value.trim()) params.set('q', q.value.trim());
        var qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      };

      var render = function () {
        var filtered = cards.filter(matches);
        var active = Boolean(q.value.trim() || country || program.value);
        var visible = filtered.slice(0, shown);

        cards.forEach(function (card) {
          card.hidden = visible.indexOf(card) === -1;
          if (!card.hidden) card.classList.remove('reveal', 'is-in'); // filtering should feel instant
        });

        var n = filtered.length;
        if (!n) count.textContent = 'No universities found';
        else if (!active) count.textContent = 'Showing ' + visible.length + ' of ' + cards.length + ' universities';
        else
          count.textContent =
            n + (n === 1 ? ' university found' : ' universities found') + (visible.length < n ? ' — showing ' + visible.length : '');

        empty.hidden = n > 0;
        moreWrap.hidden = n <= shown;
        if (!moreWrap.hidden) moreBtn.textContent = 'Show more universities (' + (n - shown) + ' more)';
        resetBtn.hidden = !active;

        chips.forEach(function (btn) {
          var on = btn.getAttribute('data-country-btn') === country;
          btn.classList.toggle('is-active', on);
          btn.setAttribute('aria-pressed', String(on));
        });
      };

      var timer;
      q.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          shown = pageSize;
          render();
          syncUrl();
        }, 120);
      });
      program.addEventListener('change', function () {
        shown = pageSize;
        render();
        syncUrl();
      });
      chips.forEach(function (btn) {
        btn.addEventListener('click', function () {
          country = btn.getAttribute('data-country-btn');
          shown = pageSize;
          render();
          syncUrl();
        });
      });
      resetBtn.addEventListener('click', function () {
        q.value = '';
        program.value = '';
        country = '';
        shown = pageSize;
        render();
        syncUrl();
        q.focus({ preventScroll: true });
      });
      moreBtn.addEventListener('click', function () {
        var before = shown;
        shown += pageSize;
        render();
        var firstNew = cards.filter(matches)[before];
        if (moreWrap.hidden && firstNew) {
          var link = firstNew.querySelector('a');
          if (link) link.focus();
        }
      });

      // Deep links:  universities.html?country=Malaysia&program=Business&q=tech
      var params = new URLSearchParams(location.search);
      var c = params.get('country');
      if (c && chips.some(function (b) { return b.getAttribute('data-country-btn') === c; })) country = c;
      var p = params.get('program');
      if (p && [].some.call(program.options, function (o) { return o.value === p; })) program.value = p;
      if (params.get('q')) q.value = params.get('q').slice(0, 80);
      render();
    })();
  }

  /* ------------------------------------------------------------------ */
  /* 4. Inquiry form → WhatsApp / email                                  */
  /* ------------------------------------------------------------------ */
  var form = document.getElementById('inquiry-form');
  if (form) {
    (function () {
      var waBtn = document.getElementById('f-send-wa');
      var mailBtn = document.getElementById('f-send-mail');
      var status = document.getElementById('form-status');
      var intro = form.getAttribute('data-wa-intro') || '';
      var number = form.getAttribute('data-wa-number') || '';
      var email = form.getAttribute('data-email') || '';
      var field = function (name) {
        return form.elements.namedItem(name);
      };
      var val = function (name) {
        return (field(name).value || '').trim();
      };

      var setError = function (name, errorId, bad) {
        var input = field(name);
        var wrap = input.closest('.field');
        var msg = document.getElementById(errorId);
        wrap.classList.toggle('has-error', bad);
        msg.hidden = !bad;
        input.setAttribute('aria-invalid', bad ? 'true' : 'false');
        return bad ? input : null;
      };

      var validate = function () {
        var bad = [
          setError('name', 'e-name', !val('name')),
          setError('phone', 'e-phone', val('phone').replace(/\D/g, '').length < 7),
          setError('email', 'e-email', val('email') !== '' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('email'))),
        ].filter(Boolean);
        if (bad.length) bad[0].focus();
        return !bad.length;
      };

      var rows = function () {
        return [
          ['Name', val('name')],
          ['Phone/WhatsApp', val('phone')],
          ['Email', val('email')],
          ['Country of interest', val('country')],
          ['Study level', val('level')],
          ['Preferred course', val('course')],
          ['Message', val('message')],
        ].filter(function (r) {
          return r[1];
        });
      };

      var say = function (text, linkText, href) {
        status.textContent = '';
        status.appendChild(document.createTextNode(text));
        if (linkText) {
          status.appendChild(document.createTextNode(' '));
          var a = document.createElement('a');
          a.textContent = linkText;
          a.href = href;
          if (/^https?:/.test(href)) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }
          status.appendChild(a);
        }
        status.hidden = false;
      };

      // Clear a field's error as soon as the visitor starts fixing it
      ['name', 'phone', 'email'].forEach(function (name) {
        field(name).addEventListener('input', function () {
          var wrap = field(name).closest('.field');
          wrap.classList.remove('has-error');
          field(name).setAttribute('aria-invalid', 'false');
          var msg = wrap.querySelector('.field__error');
          if (msg) msg.hidden = true;
        });
      });

      // The button is a real link (works in every in-app browser). We only validate and
      // fill in the message at the moment it is pressed, then let the browser follow it.
      waBtn.addEventListener('click', function (e) {
        if (!validate()) {
          e.preventDefault();
          return;
        }
        var text =
          intro +
          '\n\n' +
          rows()
            .map(function (r) {
              return '*' + r[0] + ':* ' + r[1];
            })
            .join('\n');
        var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
        waBtn.href = url;
        say('WhatsApp should now open with your details ready to send. If nothing happened,', 'tap here to open WhatsApp', url);
      });

      mailBtn.addEventListener('click', function (e) {
        if (!validate()) {
          e.preventDefault();
          return;
        }
        var body =
          intro +
          '\n\n' +
          rows()
            .map(function (r) {
              return r[0] + ': ' + r[1];
            })
            .join('\n');
        var url =
          'mailto:' +
          email +
          '?subject=' +
          encodeURIComponent('Study abroad inquiry — ' + val('name')) +
          '&body=' +
          encodeURIComponent(body);
        mailBtn.href = url;
        say('Your email app should open with your message ready. If it doesn’t, write to us at', email, 'mailto:' + email);
      });

      // Enter key sends via WhatsApp (except in the suggestions field, where Enter picks a suggestion)
      form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.target.hasAttribute('list')) {
          e.preventDefault();
          waBtn.click();
        }
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    })();
  }

  /* ------------------------------------------------------------------ */
  /* 5. Optional click tracking (only does something if a Pixel/GA tag   */
  /*    was added in content/site.js)                                    */
  /* ------------------------------------------------------------------ */
  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest ? e.target.closest('[data-wa]') : null;
      if (!a || !/wa\.me/.test(a.href)) return;
      var where = a.getAttribute('data-wa');
      var isForm = where === 'form';
      if (typeof window.fbq === 'function') window.fbq('track', isForm ? 'Lead' : 'Contact', { content_name: where });
      if (typeof window.gtag === 'function')
        window.gtag('event', isForm ? 'generate_lead' : 'click_whatsapp', { event_label: where });
    },
    true
  );

  // Footer year
  [].forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
