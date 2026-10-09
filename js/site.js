/* pace2: theme switch and highlighting the current section in the nav as you scroll. */
(function () {
  var root = document.documentElement;

  /* ---------- Theme switch ---------- */
  var toggle = document.querySelector('.theme-toggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function label() {
    var text = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', text);
    toggle.setAttribute('title', text);
  }
  if (toggle) {
    label();
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('pace2-theme', next); } catch (e) {}
      label();
    });
  }

  /* ---------- Nav: current section and a shadow once you scroll ---------- */
  var nav = document.querySelector('.site-nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav ul a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;

  function update() {
    ticking = false;
    nav.classList.toggle('scrolled', window.scrollY > 8);
    /* A section becomes current once its top passes 30% down the window */
    var offset = Math.max(nav.offsetHeight + 40, window.innerHeight * 0.3);
    var current = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= offset) current = i;
    });
    /* At the very bottom, the last section is current even if it is short */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections.length - 1;
    }
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
