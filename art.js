// Inline SVG vector art (no external files). Shared gradients live in index.html.
(function () {
  const A = {};
  const pts = (cx, cy, R, r, n, rot) => {
    rot = rot || 0; const p = [];
    for (let i = 0; i < n * 2; i++) {
      const a = rot + (Math.PI * i) / n - Math.PI / 2, rr = i % 2 ? r : R;
      p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  };
  const svg = (vb, body, w, h, st) => {
    const p = vb.split(' ');
    h = h || (w * p[3]) / p[2];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" style="overflow:visible;display:block;${st || ''}">${body}</svg>`;
  };
  const G = 'url(#gG)';
  A.pts = pts;

  A.star8 = (w, fill) => svg('0 0 200 200', `<polygon points="${pts(100, 100, 96, 66, 8)}" fill="${fill || G}"/>`, w);
  A.starNum = (w, num) => svg('0 0 200 200',
    `<polygon points="${pts(100, 100, 96, 66, 8)}" fill="${G}"/><polygon points="${pts(100, 100, 80, 55, 8)}" fill="#0b3d33"/>` +
    `<text x="100" y="128" text-anchor="middle" font-size="86" font-weight="700" fill="#f8e7ae" style="font-family:'Noto Serif Bengali','Noto Sans Bengali','FreeSerif',serif">${num}</text>`, w);
  A.medallion = (w) => svg('0 0 400 400',
    `<g fill="none" stroke="#e3c26b" stroke-width="2.4"><polygon points="${pts(200, 200, 192, 134, 8)}"/><polygon points="${pts(200, 200, 192, 134, 8, Math.PI / 8)}"/>` +
    `<circle cx="200" cy="200" r="152"/><polygon points="${pts(200, 200, 124, 86, 8)}"/><polygon points="${pts(200, 200, 124, 86, 8, Math.PI / 8)}"/><circle cx="200" cy="200" r="64"/><circle cx="200" cy="200" r="20"/></g>`, w);
  A.tile = () => {
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="#e3c26b" stroke-width="1.3"><polygon points="${pts(60, 60, 50, 35, 8)}"/><polygon points="${pts(0, 0, 14, 10, 8)}"/><polygon points="${pts(120, 0, 14, 10, 8)}"/><polygon points="${pts(0, 120, 14, 10, 8)}"/><polygon points="${pts(120, 120, 14, 10, 8)}"/><circle cx="60" cy="60" r="12"/></g></svg>`;
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';
  };
  A.lantern = (w) => svg('0 0 100 230',
    `<line x1="50" y1="-300" x2="50" y2="34" stroke="#a67c28" stroke-width="3"/><circle cx="50" cy="30" r="9" fill="none" stroke="#e3c26b" stroke-width="4"/>` +
    `<path d="M30 54Q50 36 70 54Z" fill="${G}"/><rect x="26" y="54" width="48" height="8" fill="${G}"/>` +
    `<path d="M26 62H74L82 118L74 164H26L18 118Z" fill="#f8c95a" fill-opacity=".85" stroke="#e3c26b" stroke-width="4"/>` +
    `<ellipse cx="50" cy="114" rx="20" ry="36" fill="url(#rGlow)"/><path d="M50 62V164M34 62L28 164M66 62L72 164" stroke="#a67c28" stroke-width="3"/>` +
    `<rect x="22" y="164" width="56" height="9" fill="${G}"/><path d="M34 173L50 205L66 173Z" fill="${G}"/><line x1="50" y1="205" x2="50" y2="226" stroke="#e3c26b" stroke-width="4"/>`, w);
  A.skyline = () => {
    let b = `<rect x="0" y="108" width="1080" height="32" fill="#031812"/>`;
    const items = [[40, 90, 56], [150, 80, 40], [250, 130, 74], [420, 70, 44], [520, 150, 84], [700, 80, 52], [800, 120, 66], [940, 90, 48]];
    items.forEach(([x, w, h]) => {
      b += `<rect x="${x}" y="${140 - h}" width="${w}" height="${h}" fill="#031812"/>`;
      b += `<ellipse cx="${x + w / 2}" cy="${140 - h}" rx="${w * 0.36}" ry="${w * 0.34}" fill="#031812"/>`;
      b += `<rect x="${x + w / 2 - 1.5}" y="${140 - h - w * 0.34 - 16}" width="3" height="16" fill="#031812"/>`;
    });
    [[20, 118], [230, 126], [400, 110], [500, 130], [690, 112], [790, 124], [930, 114], [1040, 118]].forEach(([x, h]) => {
      b += `<rect x="${x}" y="${140 - h}" width="10" height="${h}" fill="#031812"/><polygon points="${x - 3},${140 - h} ${x + 13},${140 - h} ${x + 5},${140 - h - 22}" fill="#031812"/>`;
      b += `<circle cx="${x + 5}" cy="${140 - h - 28}" r="3.5" fill="#a67c28"/>`;
    });
    b += `<rect x="0" y="107" width="1080" height="2" fill="#a67c28" opacity=".7"/>`;
    return svg('0 0 1080 140', b, 1080, 140);
  };
  A.divider = (w) => svg('0 0 400 30', `<rect x="0" y="14" width="160" height="2" fill="#e3c26b"/><rect x="240" y="14" width="160" height="2" fill="#e3c26b"/><polygon points="${pts(200, 15, 14, 9, 8)}" fill="${G}"/>`, w);

  A.book = (w) => svg('0 0 240 170',
    `<path d="M120 36C92 14 44 14 12 26V138C44 126 92 126 120 148Z" fill="#fff6dc" stroke="#a67c28" stroke-width="4"/>` +
    `<path d="M120 36C148 14 196 14 228 26V138C196 126 148 126 120 148Z" fill="#fff6dc" stroke="#a67c28" stroke-width="4"/>` +
    `<path d="M30 52C56 44 86 46 108 58M30 74C56 66 86 68 108 80M30 96C56 88 86 90 108 102M132 58C154 46 184 44 210 52M132 80C154 68 184 66 210 74M132 102C154 90 184 88 210 96" stroke="#c9a85a" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M4 34V146C44 132 92 132 120 156C148 132 196 132 236 146V34" fill="none" stroke="${G}" stroke-width="9" stroke-linejoin="round"/>`, w);
  A.quran = (w) => svg('0 0 200 240',
    `<rect x="14" y="8" width="172" height="224" rx="16" fill="url(#gEm)" stroke="${G}" stroke-width="8"/><rect x="30" y="24" width="140" height="192" rx="8" fill="none" stroke="#e3c26b" stroke-width="2.5"/>` +
    `<polygon points="${pts(100, 96, 54, 38, 8)}" fill="${G}"/><polygon points="${pts(100, 96, 34, 24, 8)}" fill="#0b3d33"/>` +
    `<text x="100" y="188" text-anchor="middle" font-size="40" fill="#f8e7ae" style="font-family:'Amiri','Noto Naskh Arabic','DejaVu Sans',serif">القرآن</text>`, w);
  A.stack = (w) => svg('0 0 200 200',
    `<g stroke="${G}" stroke-width="5"><rect x="20" y="132" width="164" height="46" rx="7" fill="url(#gEm)"/><rect x="34" y="82" width="146" height="46" rx="7" fill="#145c4b"/><rect x="26" y="32" width="150" height="46" rx="7" fill="url(#gEm)"/></g>` +
    `<g fill="${G}"><rect x="34" y="144" width="10" height="22"/><rect x="48" y="94" width="10" height="22"/><rect x="40" y="44" width="10" height="22"/><polygon points="${pts(130, 55, 14, 9, 8)}"/><polygon points="${pts(140, 105, 14, 9, 8)}"/><polygon points="${pts(130, 155, 14, 9, 8)}"/></g>`, w);
  A.clock = (w) => {
    let t = ''; for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; t += `<line x1="${100 + 66 * Math.sin(a)}" y1="${100 - 66 * Math.cos(a)}" x2="${100 + 76 * Math.sin(a)}" y2="${100 - 76 * Math.cos(a)}" stroke="#e3c26b" stroke-width="5"/>`; }
    return svg('0 0 200 200', `<circle cx="100" cy="100" r="90" fill="url(#gEm)" stroke="${G}" stroke-width="9"/>${t}<line class="hh" x1="100" y1="100" x2="100" y2="58" stroke="#fff6dc" stroke-width="8" stroke-linecap="round"/><line class="mh" x1="100" y1="100" x2="100" y2="38" stroke="#f8e7ae" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="${G}"/>`, w);
  };
  A.moon = (w) => svg('0 0 200 200',
    `<mask id="mm"><rect width="200" height="200" fill="#fff"/><circle cx="126" cy="84" r="58" fill="#000"/></mask><circle cx="96" cy="104" r="72" mask="url(#mm)" fill="${G}"/>` +
    `<polygon points="${pts(148, 62, 16, 7, 5)}" fill="#f8e7ae"/><polygon points="${pts(170, 118, 10, 4.5, 5)}" fill="#f8e7ae"/>`, w);
  A.compass = (w) => svg('0 0 200 200',
    `<circle cx="100" cy="100" r="90" fill="url(#gEm)" stroke="${G}" stroke-width="9"/><circle cx="100" cy="100" r="72" fill="none" stroke="#e3c26b" stroke-width="2" stroke-dasharray="3 7"/>` +
    `<g fill="#e3c26b"><polygon points="100,12 108,30 92,30"/><rect x="95" y="168" width="10" height="14"/><rect x="18" y="95" width="14" height="10"/><rect x="168" y="95" width="14" height="10"/></g>` +
    `<g class="nd"><polygon points="100,34 114,100 86,100" fill="#f8e7ae"/><polygon points="100,166 114,100 86,100" fill="#a67c28"/><rect x="88" y="14" width="24" height="22" fill="#0a0a0a" stroke="#e3c26b" stroke-width="2" transform="translate(0 0)"/></g><circle cx="100" cy="100" r="9" fill="${G}"/>`, w);
  A.pin = (w) => svg('0 0 200 200',
    `<path d="M100 14C62 14 38 42 38 78C38 124 100 188 100 188S162 124 162 78C162 42 138 14 100 14Z" fill="${G}"/><circle cx="100" cy="80" r="46" fill="#0b3d33"/>` +
    `<path d="M70 96a30 30 0 0 1 60 0Z" fill="url(#gGr)"/><rect x="66" y="96" width="68" height="10" fill="#f8e7ae"/><rect x="99" y="52" width="3" height="14" fill="#e3c26b"/>`, w);
  A.tasbih = (w) => {
    let b = ''; for (let i = 0; i < 14; i++) { const a = (i * 2 * Math.PI) / 14; b += `<circle class="bd" cx="${100 + 64 * Math.cos(a)}" cy="${92 + 64 * Math.sin(a)}" r="11" fill="#145c4b" stroke="#e3c26b" stroke-width="4"/>`; }
    return svg('0 0 200 200', b + `<rect x="92" y="166" width="16" height="12" fill="${G}"/><path d="M100 178L88 200M100 178L112 200M100 178V204" stroke="#e3c26b" stroke-width="4"/><circle cx="100" cy="92" r="30" fill="url(#gEm)" stroke="${G}" stroke-width="5"/><polygon points="${pts(100, 92, 20, 13, 8)}" fill="${G}"/>`, w);
  };
  A.mic = (w) => svg('0 0 200 200',
    `<rect x="72" y="14" width="56" height="100" rx="28" fill="${G}"/><path d="M50 92a50 50 0 0 0 100 0" fill="none" stroke="#e3c26b" stroke-width="9" stroke-linecap="round"/><line x1="100" y1="142" x2="100" y2="176" stroke="#e3c26b" stroke-width="9"/><rect x="66" y="172" width="68" height="12" rx="6" fill="${G}"/><path d="M84 42H116M84 62H116M84 82H116" stroke="#a67c28" stroke-width="4"/>`, w);
  A.note = (w) => svg('0 0 200 200',
    `<g fill="${G}"><ellipse cx="62" cy="152" rx="26" ry="19"/><ellipse cx="148" cy="134" rx="26" ry="19"/><rect x="80" y="40" width="9" height="112"/><rect x="166" y="22" width="9" height="112"/><polygon points="80,40 175,22 175,56 80,74"/></g>`, w);
  A.dua = (w) => {
    let r = ''; for (let i = -3; i <= 3; i++) { const a = (i * 0.32); r += `<line x1="${100 + 50 * Math.sin(a)}" y1="${70 - 50 * Math.cos(a)}" x2="${100 + 84 * Math.sin(a)}" y2="${70 - 84 * Math.cos(a)}" stroke="#e3c26b" stroke-width="5" stroke-linecap="round"/>`; }
    return svg('0 0 200 200', r + `<path d="M20 98C20 150 62 184 100 184S180 150 180 98C158 122 130 130 100 130S42 122 20 98Z" fill="${G}"/><path d="M44 112C60 126 80 132 100 132M156 112C140 126 120 132 100 132" stroke="#a67c28" stroke-width="4" fill="none"/>`, w);
  };
  A.nametag = (w) => svg('0 0 200 200',
    `<rect x="36" y="22" width="128" height="164" rx="18" fill="url(#gEm)" stroke="${G}" stroke-width="7"/><rect x="82" y="34" width="36" height="12" rx="6" fill="#04201b" stroke="#e3c26b" stroke-width="3"/>` +
    `<polygon points="${pts(100, 98, 36, 25, 8)}" fill="${G}"/><polygon points="${pts(100, 98, 22, 15, 8)}" fill="#0b3d33"/><path d="M62 150H138M74 166H126" stroke="#e3c26b" stroke-width="6" stroke-linecap="round"/>`, w);
  A.kaaba = (w) => svg('0 0 320 200',
    `<ellipse cx="170" cy="100" rx="150" ry="90" fill="url(#rGlow)" opacity=".45"/>` +
    `<rect x="14" y="62" width="136" height="122" fill="url(#gBk)" stroke="#e3c26b" stroke-width="2"/><rect x="14" y="86" width="136" height="16" fill="${G}"/><rect x="30" y="118" width="26" height="66" fill="${G}"/>` +
    `<rect x="170" y="46" width="14" height="138" fill="#fff6dc"/><polygon points="168,46 186,46 177,18" fill="#e3c26b"/>` +
    `<path d="M160 184a60 60 0 0 1 120 0Z" fill="url(#gGr)" stroke="#e3c26b" stroke-width="3"/><rect x="219" y="104" width="3" height="20" fill="#e3c26b"/><circle cx="220" cy="100" r="5" fill="#e3c26b"/>` +
    `<rect x="292" y="60" width="14" height="124" fill="#fff6dc"/><polygon points="290,60 308,60 299,30" fill="#e3c26b"/>`, w);
  A.pdf = (w) => svg('0 0 200 200',
    `<path d="M44 14H122L162 54V186H44Z" fill="#fff6dc" stroke="${G}" stroke-width="7" stroke-linejoin="round"/><path d="M122 14V54H162" fill="#e3c26b"/><rect x="44" y="106" width="118" height="48" fill="#b32a2a"/>` +
    `<text x="103" y="142" text-anchor="middle" font-size="36" font-weight="700" fill="#fff" style="font-family:'DejaVu Sans',sans-serif">PDF</text><path d="M62 72H112M62 88H140" stroke="#a67c28" stroke-width="5" stroke-linecap="round"/>`, w);
  A.offline = (w) => svg('0 0 200 200',
    `<circle cx="100" cy="100" r="90" fill="url(#gEm)" stroke="${G}" stroke-width="7"/><path d="M100 36V112M66 84L100 118L134 84" stroke="#f8e7ae" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 132V158H148V132" stroke="#e3c26b" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, w);
  A.shelf = (w) => {
    const cols = ['#145c4b', '#e3c26b', '#fff6dc', '#1d7a63', '#a67c28', '#f8e7ae'];
    let b = '';[[70, 0], [140, 1]].forEach(([y, k]) => {
      let x = 20; for (let i = 0; i < 9; i++) { const bw = 14 + ((i * 5 + k * 3) % 3) * 6, bh = 44 + ((i * 7 + k * 5) % 4) * 8; b += `<rect x="${x}" y="${y - bh}" width="${bw}" height="${bh}" rx="2" fill="${cols[(i + k) % 6]}" stroke="#04201b" stroke-width="2"/>`; x += bw + 3; }
      b += `<rect x="8" y="${y}" width="184" height="9" rx="3" fill="${G}"/>`;
    });
    return svg('0 0 200 200', b, w);
  };
  A.share = (w) => svg('0 0 200 200',
    `<g fill="${G}"><circle cx="150" cy="44" r="28"/><circle cx="50" cy="100" r="28"/><circle cx="150" cy="156" r="28"/></g><path d="M50 100L150 44M50 100L150 156" stroke="#e3c26b" stroke-width="10"/>`, w);
  A.heart = (w) => svg('0 0 200 200', `<path d="M100 176C30 124 12 84 12 58C12 32 32 16 54 16C76 16 92 28 100 46C108 28 124 16 146 16C168 16 188 32 188 58C188 84 170 124 100 176Z" fill="#e0475b" stroke="#ffd2d8" stroke-width="5"/>`, w);
  A.miniBook = (w, c) => svg('0 0 60 80', `<rect x="4" y="4" width="52" height="72" rx="6" fill="${c}" stroke="#e3c26b" stroke-width="4"/><rect x="10" y="4" width="6" height="72" fill="#a67c28"/><polygon points="${pts(36, 40, 12, 8, 8)}" fill="#e3c26b"/>`, w);

  window.A = A;
})();
