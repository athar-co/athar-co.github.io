// Scroll-driven 3D laptop: it turns toward you and opens on the «أثر» screen,
// then slides aside and its screen walks through the projects while their details appear beside it.
(function () {
  var sec = document.getElementById('l3');
  if (!sec) return;
  var rig = sec.querySelector('.rig'), lid = sec.querySelector('.lid'), stage = sec.querySelector('.stage3');
  var caps = sec.querySelectorAll('.cap3'), os = sec.querySelector('.os'), shots = sec.querySelectorAll('.shot');
  var side = sec.querySelector('.side'), texts = sec.querySelectorAll('.side .t'), dots = sec.querySelectorAll('.pdots i');
  var sn = document.getElementById('sn');
  var N = shots.length, lastStep = -2;
  var mobile = matchMedia('(max-width: 860px)');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var target = 0, cur = 0, running = false;

  // timeline (fractions of the section's scroll)
  var T = { turn: [0, .13], open: [.02, .15], aside: [.17, .25], works: [.26, .98] };

  function measure() {
    var r = sec.getBoundingClientRect();
    target = clamp(-r.top / (r.height - innerHeight), 0, 1);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function setStep(i) {            // -1 = the «أثر» screen, 0..N-1 = projects
    if (i === lastStep) return;
    lastStep = i;
    os.style.opacity = i < 0 ? 1 : 0;
    for (var k = 0; k < N; k++) {
      shots[k].classList.toggle('on', k === i);
      texts[k].classList.toggle('on', k === i);
      dots[k].classList.toggle('on', k === i);
    }
    if (i >= 0) sn.textContent = ('0' + (i + 1)).slice(-2);
  }

  function render(p) {
    var turn = ease(seg(p, T.turn[0], T.turn[1]));
    var open = ease(seg(p, T.open[0], T.open[1]));
    var aside = ease(seg(p, T.aside[0], T.aside[1]));
    var yaw = lerp(-38, 0, turn), tilt = lerp(-58, -16, turn), x = 0, y = lerp(2, 14, turn), s = lerp(.78, 1, turn);
    if (mobile.matches) { y -= aside * 34; s *= lerp(1, .92, aside); }
    else { x = -aside * 26; y -= aside * 12; yaw += aside * 12; s *= lerp(1, .74, aside); }
    rig.style.transform = 'translate(' + x.toFixed(2) + '%,' + y.toFixed(2) + '%) scale(' + s.toFixed(4) + ') rotateX(' + tilt.toFixed(2) + 'deg) rotateY(' + yaw.toFixed(2) + 'deg)';
    lid.style.transform = 'rotateX(' + lerp(-90, 8, open).toFixed(2) + 'deg)';
    stage.style.setProperty('--screen', open.toFixed(3));
    stage.classList.toggle('boot', open > .75);
    var step = p < .1 ? 0 : 1;
    caps.forEach(function (c, i) { c.classList.toggle('on', i === step && aside < .2); });
    side.style.setProperty('--aside', seg(aside, .55, 1).toFixed(3));
    side.classList.toggle('live', aside > .9);
    setStep(aside < .9 ? -1 : clamp(Math.floor(seg(p, T.works[0], T.works[1]) * N), 0, N - 1));
  }

  function tick() {
    cur += (target - cur) * 0.07;
    if (Math.abs(target - cur) < 0.0004) { cur = target; running = false; }
    render(cur);
    if (running) requestAnimationFrame(tick);
  }

  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);
  measure(); cur = target; render(cur);
  // lets the page be previewed at any point of the animation (also stops the glide from overriding it)
  window.athar3d = function (p) { removeEventListener('scroll', measure); target = cur = p; render(p); };
})();
