// Motion for the «أثر» site: staggered reveals, side slides, count-up numbers, page fades, mobile menu.
(function () {
  // 1. stagger items that sit together in a grid
  ['.svc-grid', '.cards3', '.pkgs', '.home-work', '.logos', '.steps', '.faq', '.start3', '.stats', '.tools'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (grid) {
      var kids = grid.querySelectorAll(':scope > .rv');
      var gap = grid.classList.contains('steps') ? 0.6 : 0.22;   // process steps light up one by one
      kids.forEach(function (el, i) { el.style.setProperty('--d', (i * gap) + 's'); });
      if (grid.classList.contains('logos')) grid.querySelectorAll(':scope > div').forEach(function (el, i) {
        el.classList.add('rv', 'zoom'); el.style.setProperty('--d', (i * 0.1) + 's');
      });
    });
  });
  // 2. project cards slide in from alternating sides
  document.querySelectorAll('.proj').forEach(function (el, i) { el.classList.add(i % 2 ? 'from-l' : 'from-r'); });

  // 3. reveal when scrolled into view
  var items = document.querySelectorAll('.rv');
  function countUp(el) {
    var m = el.textContent.match(/(\D*)(\d+)(\D*)/);
    if (!m) return;
    var end = +m[2], t0 = null;
    function step(t) {
      t0 = t0 || t;
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = m[1] + Math.round(end * (1 - Math.pow(1 - p, 3))) + m[3];
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function show(el) {
    el.classList.add('in');
    el.querySelectorAll('.stats .v, .v').forEach(function (v) { if (!v.dataset.done) { v.dataset.done = 1; countUp(v); } });
  }
  if (!('IntersectionObserver' in window)) {
    items.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // 4. fade out before moving to another page of the site
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (ev.ctrlKey || ev.metaKey || a.target === '_blank') return;
      ev.preventDefault();
      document.getElementById('top').classList.remove('open');
      document.body.classList.add('leaving');
      setTimeout(function () { location.href = a.href; }, 280);
    });
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });
})();
