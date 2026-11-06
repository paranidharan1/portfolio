#!/usr/bin/env python3
"""Assemble each theme page from the shared body (src/body.html) + base.css + theme.css."""
import pathlib
root = pathlib.Path(__file__).parent
body = (root / "src/body.html").read_text(encoding="utf-8")
G = "https://fonts.googleapis.com/css2?"
THEMES = {
  "atlas":   ("Atlas",   "#ffffff", G+"family=Archivo:wght@400;500;600;700;800&display=swap"),
  "ink":     ("Ink",     "#ffffff", G+"family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..600&family=Source+Sans+3:wght@400;500;600&display=swap"),
  "workshop":("Workshop","#ffd93d", G+"family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Work+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"),
  "nocturne":("Nocturne","#0d0d0e", G+"family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap"),
  "pastel":  ("Pastel",  "#f6f1fb", G+"family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"),
}
HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Paranidharan · AI Research Engineer</title>
<meta name="description" content="Paranidharan, AI research engineer in Bengaluru (ZenteiQ, IISc). Pretraining, distributed training and fast inference. Co-author of Dhīr, models pretrained from scratch on TPUs.">
<meta name="theme-color" content="{tc}">
<meta property="og:title" content="Paranidharan · AI Research Engineer">
<meta property="og:description" content="Pretraining, distributed training and fast inference. Dhīr 2B and 5B MoE, pretrained from random weights on TPUs.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{fonts}" rel="stylesheet">
<link rel="stylesheet" href="../base.css">
<link rel="stylesheet" href="theme.css">
</head>
<body>

"""
TAIL = '\n<script src="../script.js"></script>\n</body>\n</html>\n'
for key,(name,tc,fonts) in THEMES.items():
    (root/key/"index.html").write_text(HEAD.format(tc=tc,fonts=fonts)+body+TAIL, encoding="utf-8")
    print("built", key)
