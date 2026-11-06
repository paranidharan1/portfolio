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


// Live Hugging Face all-time download counts (public API). Cards keep their last known numbers if the request fails.
(function () {
  var cards = document.querySelectorAll('[data-hf]'), status = document.getElementById('hub-status');
  if (!cards.length || !window.fetch) return;
  var totals = {};
  cards.forEach(function (card) {
    var path = card.getAttribute('data-hf');
    fetch('https://huggingface.co/api/' + path + '?expand%5B%5D=downloadsAllTime')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (d.downloadsAllTime == null) return;
        var el = card.querySelector('[data-dl]');
        if (el) el.textContent = d.downloadsAllTime.toLocaleString();
        totals[path] = d.downloadsAllTime;
        if (status) {
          var sum = Object.keys(totals).reduce(function (a, k) { return a + totals[k]; }, 0);
          status.textContent = 'live from the Hub · ' + sum.toLocaleString() + ' downloads';
          status.className = 'live on';
        }
        var tot = document.getElementById('hf-total');
        if (tot) tot.textContent = Object.keys(totals).reduce(function (a, k) { return a + totals[k]; }, 0).toLocaleString();
      })
      .catch(function () { /* keep last known numbers */ });
  });
})();
