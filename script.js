/* ---------- TPU pod background (64 x 32 = 2,048 cells) ---------- */
(function () {
  var c = document.getElementById('pod');
  if (!c) return;
  var ctx = c.getContext('2d'), COLS = 64, ROWS = 32, cells = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (var i = 0; i < COLS * ROWS; i++) cells.push(Math.random() < 0.06 ? Math.random() : 0);

  function size() {
    var r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    draw();
  }
  function draw() {
    var w = c.width, h = c.height, cw = w / COLS, ch = h / ROWS, s = Math.min(cw, ch) * 0.42;
    ctx.clearRect(0, 0, w, h);
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var v = cells[y * COLS + x], cx = x * cw + cw / 2, cy = y * ch + ch / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, s * (0.55 + v * 0.7), 0, 6.283);
      ctx.fillStyle = v > 0.05 ? 'rgba(212,255,58,' + (0.25 + v * 0.75) + ')' : 'rgba(140,150,170,0.16)';
      ctx.fill();
    }
  }
  function tick() {
    for (var i = 0; i < cells.length; i++) {
      if (cells[i] > 0) { cells[i] -= 0.05; if (cells[i] < 0) cells[i] = 0; }
      else if (Math.random() < 0.004) cells[i] = 1;
    }
    draw();
  }
  window.addEventListener('resize', size);
  size();
  if (!reduce) setInterval(tick, 90);
})();

/* ---------- Terminal ---------- */
(function () {
  var out = document.getElementById('out'), form = document.getElementById('form'),
      input = document.getElementById('cmd'), chips = document.getElementById('chips');
  if (!out) return;
  var hist = [], hi = 0;

  var L = function (href, text) { return '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>'; };

  var commands = {
    help: function () {
      return 'commands:\n' +
        '  <b>whoami</b>     the short version\n' +
        '  <b>dhir</b>       the main quest\n' +
        '  <b>quests</b>     side projects\n' +
        '  <b>learn</b>      things I write down\n' +
        '  <b>path</b>       where I\'ve worked\n' +
        '  <b>contact</b>    reach me\n' +
        '  <b>clear</b>      tidy up';
    },
    whoami: function () {
      return '<b>Paranidharan</b>, ML engineer, Bengaluru.\n' +
        'Model training at ZenteiQ. Before that: IISc (radar ML for DRDO, Granite work with IBM).\n' +
        'Likes: sharding layouts, TensorRT, a clean Dockerfile.';
    },
    dhir: function () {
      return 'Dhīr 2B dense + Dhīr 5B MoE. Pretrained from random weights.\n' +
        '6T+ tokens · TPU v6e · 131k tokenizer · 11 languages.\n' +
        '-> ' + L('#dhir', 'jump to the section') + ' · ' + L('https://zenteiq.ai/research/publications/', 'tech report');
    },
    quests: function () {
      return 'YOLOv5 on TensorRT: 495 fps, 5.2x over ONNX Runtime\n' +
        'AffectSense, multimodal RAG, Document Prep Kit, physics VLM...\n' +
        '-> ' + L('#quests', 'see them all');
    },
    learn: function () {
      return 'Parallelism: how LLMs train across thousands of GPUs.\n' +
        '-> ' + L('https://parani-zenteiq-ai.github.io/parallelism/', 'parani-zenteiq-ai.github.io/parallelism');
    },
    path: function () {
      return 'ZenteiQ (2025-) · AiREX Lab, IISc (2024-) · DRDO · IBM Granite\n-> ' + L('#path', 'the timeline');
    },
    contact: function () {
      return 'mail      ' + L('mailto:paranidharan270@gmail.com', 'paranidharan270@gmail.com') + '\n' +
        'linkedin  ' + L('https://www.linkedin.com/in/paranidharanm/', 'paranidharanm') + '\n' +
        'github    ' + L('https://github.com/paranidharan1', 'paranidharan1') + '\n' +
        'hf        ' + L('https://huggingface.co/parani01', 'parani01');
    },
    'sudo hire-me': function () {
      return '[sudo] password for recruiter: ********\n' +
        '<span class="k">permission granted.</span> Opening mail client...\n' +
        'or just write: ' + L('mailto:paranidharan270@gmail.com?subject=Let%27s%20talk', 'paranidharan270@gmail.com');
    },
    ls: function () { return 'dhir/  quests/  learn/  path/  contact/'; },
    clear: function () { out.innerHTML = ''; return null; }
  };
  commands['hire-me'] = commands['sudo hire-me'];
  commands['sudo'] = function () { return 'try: sudo hire-me'; };

  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function run(raw) {
    var cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    var row = document.createElement('div'); row.className = 'cmd'; row.textContent = raw.trim(); out.appendChild(row);
    var fn = commands[cmd], res = fn ? fn() : null;
    if (fn && res === null) return;
    var r = document.createElement('div'); r.className = 'res';
    r.innerHTML = fn ? res : 'command not found: ' + esc(cmd) + '. try <b>help</b>';
    out.appendChild(r);
    out.scrollTop = out.scrollHeight;
  }

  function typeIn(text, done) {
    var i = 0, t = setInterval(function () {
      input.value = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(t); setTimeout(function () { input.value = ''; run(text); if (done) done(); }, 180); }
    }, 55);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value; if (v.trim()) { hist.push(v); hi = hist.length; }
    run(v); input.value = '';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); input.value = hist[hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown' && hist.length) { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
  });
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    run(b.getAttribute('data-cmd'));
    if (b.getAttribute('data-cmd') === 'sudo hire-me') setTimeout(function () { location.hash = '#contact'; }, 900);
  });

  // Greeting: type "whoami" on load (static fallback if reduced motion)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) run('whoami');
  else setTimeout(function () { typeIn('whoami'); }, 600);
})();

/* ---------- Reveal on scroll + bench bars ---------- */
(function () {
  var els = document.querySelectorAll('.section > *, .stages li, .qcard, .box, .path li');
  els.forEach(function (e) { e.classList.add('rv'); });
  var bars = document.querySelector('.bars');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); }); if (bars) bars.classList.add('go'); return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.classList.contains('bench') || en.target.contains(bars)) bars && bars.classList.add('go');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
  if (bars) io.observe(bars), new IntersectionObserver(function (en, o) {
    if (en[0].isIntersecting) { bars.classList.add('go'); o.disconnect(); }
  }, { threshold: 0.3 }).observe(bars);
})();
