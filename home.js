// Scroll-driven scenes for the cinematic home page (the 3D laptop lives in laptop3d.js).
(function () {
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var bar = document.getElementById('progress');

  // manifesto words light up as you scroll
  var man = document.getElementById('manifesto');
  var words = man ? man.querySelectorAll('.text span') : [];

  // services moving sideways
  var hs = document.getElementById('services');
  var track = hs && hs.querySelector('.track2');
  var hsbar = document.getElementById('hsbar');

  function sectionProgress(el) {
    var r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  }

  function frame() {
    var doc = document.documentElement;
    bar.style.width = (100 * scrollY / (doc.scrollHeight - innerHeight)) + '%';

    if (words.length) {
      var r = man.getBoundingClientRect();
      var p = clamp((innerHeight * 0.95 - r.top) / (r.height * 0.8), 0, 1);
      var lit = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < lit); });
    }

    if (track) {
      var hp = sectionProgress(hs);
      var dist = Math.max(0, track.scrollWidth - innerWidth);
      track.style.transform = 'translateX(' + (hp * dist).toFixed(1) + 'px)';
      hsbar.style.width = (hp * 100) + '%';
    }
  }

  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { frame(); ticking = false; }); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  // video phones: play only while on screen; one sound button at a time
  var vids = document.querySelectorAll('.vphone video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: .5 });
    vids.forEach(function (v) { vio.observe(v); });
  }
  document.querySelectorAll('.vphone .snd').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.parentNode.querySelector('video'), turnOn = v.muted;
      vids.forEach(function (o) { o.muted = true; o.parentNode.querySelector('.snd').classList.remove('live'); });
      if (turnOn) { v.muted = false; v.currentTime = 0; v.play(); b.classList.add('live'); }
    });
  });

  // "why" lines appear together when the slide is reached
  var why = document.getElementById('why');
  if (why && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) why.classList.add('in'); }); }, { threshold: .35 }).observe(why);
  } else if (why) { why.classList.add('in'); }
})();
