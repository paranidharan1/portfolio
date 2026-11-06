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


// Live Hugging Face stats for each model card (public API). Cards keep dashes if the request fails.
(function () {
  var cards = document.querySelectorAll('[data-hf]'), status = document.getElementById('hub-status');
  if (!cards.length || !window.fetch) return;
  cards.forEach(function (card) {
    fetch('https://huggingface.co/api/' + card.getAttribute('data-hf'))
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var dl = card.querySelector('[data-dl]'), lk = card.querySelector('[data-likes]');
        if (dl && d.downloads != null) dl.textContent = d.downloads.toLocaleString();
        if (lk && d.likes != null) lk.textContent = d.likes.toLocaleString();
        if (status) { status.textContent = 'live from the Hub'; status.className = 'live on'; }
      })
      .catch(function () { /* keep dashes */ });
  });
})();
