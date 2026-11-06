// Gentle reveal on scroll. Content is fully visible if JS or IntersectionObserver is unavailable.
(function () {
  var els = document.querySelectorAll('.section > *, .job, .card, .banner');
  if (!('IntersectionObserver' in window)) return;
  els.forEach(function (e) { e.classList.add('rv'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.08 });
  els.forEach(function (e) { io.observe(e); });
})();
