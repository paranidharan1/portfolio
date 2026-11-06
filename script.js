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


// Copy BibTeX
(function () {
  var b = document.getElementById('copy-bib'), pre = document.getElementById('bibtex');
  if (!b || !pre) return;
  b.addEventListener('click', function () {
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy BibTeX'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pre.textContent).then(done, done);
    else { var r = document.createRange(); r.selectNode(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand('copy'); } catch (e) {} done(); }
  });
})();

// Live Hugging Face stats (public API). Falls back to the static rows if the request fails.
(function () {
  var tbody = document.getElementById('hub-rows'), status = document.getElementById('hub-status');
  if (!tbody || !window.fetch) return;
  var base = 'https://huggingface.co/api/';
  var get = function (kind) { return fetch(base + kind + '?author=parani01').then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  Promise.all([get('datasets'), get('models')]).then(function (res) {
    var rows = [];
    res[0].forEach(function (d) { rows.push({ id: d.id, type: 'Dataset', url: 'https://huggingface.co/datasets/' + d.id, dl: d.downloads, likes: d.likes }); });
    res[1].forEach(function (m) { rows.push({ id: m.id, type: 'Model', url: 'https://huggingface.co/' + m.id, dl: m.downloads, likes: m.likes }); });
    if (!rows.length) return;
    rows.sort(function (a, b) { return (b.dl || 0) - (a.dl || 0); });
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    tbody.innerHTML = rows.map(function (r) {
      return '<tr><td><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.id) + '</a></td><td>' + r.type +
        '</td><td class="num">' + (r.dl == null ? '–' : r.dl.toLocaleString()) + '</td><td class="num">' + (r.likes == null ? '–' : r.likes) + '</td></tr>';
    }).join('');
    status.textContent = 'live'; status.className = 'live on';
  }).catch(function () { /* keep the static snapshot */ });
})();
