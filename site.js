/* ============================================================
   Small interactive touches: theme toggle, scroll progress,
   scroll-in reveals and a cursor spotlight on landing cards.
   ============================================================ */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

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

  document.addEventListener('DOMContentLoaded', function () {
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

    /* ---------- Reveal on scroll ---------- */
    var targets = document.querySelectorAll(
      '.section, .entry, .post-figure, .post-wide, .gallery, .site-foot'
    );
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (items) {
        items.forEach(function (item) {
          if (item.isIntersecting) {
            item.target.classList.add('in-view');
            io.unobserve(item.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach(function (el) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('scroll-reveal');
        io.observe(el);
      });
    }

    /* ---------- Cursor spotlight on landing cards ---------- */
    document.querySelectorAll('.section').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  });
})();
