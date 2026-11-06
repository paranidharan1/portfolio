// Reveal on scroll, and animate the benchmark bars when they come into view.
(function () {
  var els = document.querySelectorAll('.section > *, .stages li, .card, .box, .path li, .roles div');
  var bars = document.querySelector('.bars');
  els.forEach(function (e) { e.classList.add('rv'); });

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    if (bars) bars.classList.add('go');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });

  if (bars) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { bars.classList.add('go'); obs.disconnect(); }
    }, { threshold: 0.3 }).observe(bars);
  }
})();
