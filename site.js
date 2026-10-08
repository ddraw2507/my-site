/* ============================================================
   Playful interactions: theme toggle, scroll progress, split-
   letter headings, typing rotator, count-up stats, tilt cards,
   magnetic buttons, cursor dot, emoji confetti, scroll reveals
   and soft page transitions.
   ============================================================ */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Theme (light / dark), remembered per visitor ---------- */
  var STORAGE_KEY = 'theme';
  function storedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }
  var saved = storedTheme();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function currentTheme() {
    var forced = root.getAttribute('data-theme');
    if (forced) return forced;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* ---------- Helpers ---------- */
  function graphemes(text) {
    if (window.Intl && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), function (s) { return s.segment; });
    }
    return Array.from(text);
  }

  // Wrap every letter in a span (grouped per word so words never break apart).
  function splitLetters(el, start) {
    var text = el.textContent.replace(/\s+/g, ' ').trim().normalize('NFC');
    var i = start || 0;
    el.textContent = '';
    text.split(' ').forEach(function (word, w) {
      if (w > 0) el.appendChild(document.createTextNode(' '));
      var wordEl = document.createElement('span');
      wordEl.className = 'word';
      wordEl.setAttribute('aria-hidden', 'true');
      graphemes(word).forEach(function (g) {
        var c = document.createElement('span');
        c.className = 'char';
        c.style.setProperty('--i', i++);
        c.textContent = g;
        wordEl.appendChild(c);
      });
      el.appendChild(wordEl);
    });
    return i;
  }

  var EMOJI = ['🎉', '✨', '🌉', '🏔️', '🎤', '💜', '⭐', '🍜', '✈️', '🧡'];
  function confetti(x, y) {
    if (reduceMotion) return;
    for (var n = 0; n < 16; n++) {
      var s = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var dist = 90 + Math.random() * 140;
      s.className = 'confetti';
      s.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
      s.style.left = (x - 14) + 'px';
      s.style.top = (y - 14) + 'px';
      s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--dy', (Math.sin(angle) * dist - 60) + 'px');
      s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(s);
      setTimeout(function (el) { el.remove(); }, 1200, s);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* ---------- Theme toggle ---------- */
    var toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    function paint() {
      var dark = currentTheme() === 'dark';
      toggle.textContent = dark ? '☀' : '☾';
      toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      saveTheme(next);
      paint();
    });
    paint();
    document.body.appendChild(toggle);

    /* ---------- Scroll progress bar ---------- */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function updateProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();

    /* ---------- Split-letter headings ---------- */
    document.querySelectorAll('.display[data-split]').forEach(function (h) {
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      var i = 0;
      h.querySelectorAll('.line').forEach(function (line) { i = splitLetters(line, i); });
    });
    document.querySelectorAll('.sub-head .section-title').forEach(function (h) {
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      splitLetters(h, 0);
    });

    /* ---------- Typing word rotator ---------- */
    document.querySelectorAll('.rotator[data-words]').forEach(function (el) {
      var words = el.getAttribute('data-words').split('|');
      var idx = Math.max(0, words.indexOf(el.textContent.trim()));
      el.setAttribute('aria-live', 'off');
      if (reduceMotion) {
        setInterval(function () { idx = (idx + 1) % words.length; el.textContent = words[idx]; }, 2600);
        return;
      }
      function erase() {
        var t = el.textContent;
        if (t.length) { el.textContent = t.slice(0, -1); setTimeout(erase, 35); }
        else { idx = (idx + 1) % words.length; setTimeout(type, 200, 0); }
      }
      function type(n) {
        var word = words[idx];
        el.textContent = word.slice(0, n);
        if (n < word.length) setTimeout(type, 65, n + 1);
        else setTimeout(erase, 1900);
      }
      setTimeout(erase, 2200);
    });

    /* ---------- Reveal on scroll (+ count-up) ---------- */
    function countUp(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1200);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = '0';
      requestAnimationFrame(step);
    }

    var targets = document.querySelectorAll(
      '.bento-head, .stat, .section, .entry, .post-figure, .post-wide, .gallery, .site-foot'
    );
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (items) {
        items.forEach(function (item) {
          if (!item.isIntersecting) return;
          item.target.classList.add('in-view');
          item.target.querySelectorAll('[data-count]').forEach(countUp);
          io.unobserve(item.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      targets.forEach(function (el) {
        if (el.classList.contains('reveal')) return;
        var siblings = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--delay', (siblings % 3) * 90 + 'ms');
        el.classList.add('scroll-reveal');
        io.observe(el);
      });
    }

    /* ---------- Emoji confetti ---------- */
    document.querySelectorAll('.eyebrow, .display').forEach(function (el) {
      el.addEventListener('click', function (e) { confetti(e.clientX, e.clientY); });
    });

    /* ---------- Desktop-only pointer effects ---------- */
    if (finePointer && !reduceMotion) {
      // 3D tilt on landing cards
      document.querySelectorAll('.section').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
          card.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });

      // Magnetic buttons
      document.querySelectorAll('.magnetic').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + dx * 0.25 + 'px,' + dy * 0.35 + 'px) rotate(' + dx * 0.04 + 'deg)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      });

      // Cursor dot that trails the pointer
      var dot = document.createElement('div');
      dot.className = 'cursor-dot is-hidden';
      dot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(dot);
      var mx = 0, my = 0, cx = 0, cy = 0, running = false;
      function follow() {
        cx += (mx - cx) * 0.2;
        cy += (my - cy) * 0.2;
        dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) requestAnimationFrame(follow);
        else running = false;
      }
      document.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        mx = e.clientX; my = e.clientY;
        dot.classList.remove('is-hidden');
        dot.classList.toggle('is-big', !!e.target.closest('a, button, .section, .char'));
        if (!running) { running = true; requestAnimationFrame(follow); }
      });
      document.documentElement.addEventListener('mouseleave', function () { dot.classList.add('is-hidden'); });
    }

    /* ---------- Soft page transitions between pages ---------- */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.protocol !== location.protocol || a.host !== location.host) return;
      if (a.pathname === location.pathname && a.hash) return;
      if (reduceMotion) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function () { location.href = a.href; }, 240);
    });
    window.addEventListener('pageshow', function () { document.body.classList.remove('is-leaving'); });
  });
})();
