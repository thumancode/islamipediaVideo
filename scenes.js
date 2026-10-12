// Deterministic animation: everything is a pure function of t (seconds).
(async function () {
  const FPS = 30, DUR = window.DURATION || 57, LN = window.LINES;
  const clamp = (x, a, b) => Math.min(b == null ? 1 : b, Math.max(a == null ? 0 : a, x));
  const EASE = {
    out: (x) => 1 - Math.pow(1 - x, 3),
    back: (x) => { const c = 2.70158; return 1 + c * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); },
  };
  const PRE = { rise: [0, 60, 1], drop: [0, -60, 1], pop: [0, 0, 0.6], zoom: [0, 0, 1.35], left: [-150, 0, 1], right: [150, 0, 1], fade: [0, 0, 1] };
  let seed = 7;
  const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const tracks = [], ticks = [];
  const root = document.getElementById('root');
  const el = (p, c, css, h) => { const d = document.createElement('div'); if (c) d.className = c; if (css) d.style.cssText = css; if (h != null) d.innerHTML = h; p.appendChild(d); return d; };
  const tick = (f) => ticks.push(f);

  // track(element, start, end, {a: preset, i: inDur, o: outDur, fn})
  function track(e, s, en, o) {
    o = Object.assign({ a: 'rise', i: 0.5, o: 0.4 }, o || {});
    e.style.visibility = 'hidden';
    tracks.push({ e, s, en, o });
    return e;
  }
  window.renderAt = function (t) {
    for (const k of ticks) k(t);
    for (const T of tracks) {
      const e = T.e, o = T.o;
      if (t < T.s || t > T.en) { e.style.visibility = 'hidden'; continue; }
      e.style.visibility = 'inherit';
      const pin = o.i > 0.02 ? clamp((t - T.s) / o.i) : 1, pout = o.o > 0 ? clamp((T.en - t) / o.o) : 1;
      e.style.opacity = Math.min(pin, pout);
      const P = PRE[o.a] || PRE.fade;
      const kin = 1 - (o.a === 'pop' ? EASE.back(pin) : EASE.out(pin)), kout = 1 - EASE.out(pout);
      e.style.translate = `${P[0] * (kin + 0.4 * kout)}px ${P[1] * (kin + 0.4 * kout)}px`;
      e.style.scale = String(1 - (1 - P[2]) * (kin + 0.5 * kout));
      if (o.fn) o.fn(e, t, pin, pout);
    }
  };

  // words(parent,text,cls,css,start,endOfReveal,hold,{rtl,hl,gold,o}) : per-word reveal, weighted by characters
  function words(par, text, cls, css, s, e, hold, opt) {
    opt = opt || {};
    const c = el(par, (cls || '') + ' wrd' + (opt.rtl ? ' rtl' : ''), css);
    const ws = text.split(/\s+/).filter(Boolean), sp = [];
    const tot = ws.reduce((a, w) => a + w.length, 0); let cum = 0, q = false;
    ws.forEach((w) => {
      const x = document.createElement('span'); x.className = 'w'; x.textContent = w;
      let hl = !!opt.gold;
      if (opt.hl) { if (w.indexOf('❝') >= 0) q = true; hl = q || opt.hl(w); if (w.indexOf('❞') >= 0) q = false; }
      if (hl) x.classList.add('hl');
      c.appendChild(x); sp.push({ x, t: s + ((e - s) * cum) / tot }); cum += w.length;
    });
    track(c, s, hold, {
      a: 'fade', i: 0.01, o: opt.o == null ? 0.25 : opt.o,
      fn: (_, t) => { for (const k of sp) { const p = clamp((t - k.t) / 0.28); k.x.style.opacity = p; k.x.style.transform = `translateY(${(1 - EASE.out(p)) * 26}px)`; } },
    });
    return c;
  }
  const at = (i, f) => LN[i].s + f * (LN[i].e - LN[i].s);
  const bnDigits = (s) => String(s).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
  const bnGroup = (n) => { const s = String(n); if (s.length <= 3) return bnDigits(s); const r = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ','); return bnDigits(r + ',' + s.slice(-3)); };

  // ---------- background ----------
  const bg = el(root, 'layer', 'left:0;top:0;width:1080px;height:1920px');
  const tile = el(bg, 'layer', `left:0;top:0;width:1080px;height:1920px;opacity:.1;background-image:${A.tile()};background-size:120px 120px`);
  const med = el(bg, 'layer', 'left:-160px;top:250px;width:1400px;height:1400px;opacity:.1', A.medallion(1400));
  const glow = el(bg, 'layer', 'left:-160px;top:120px;width:1400px;height:1400px;border-radius:50%');
  const dust = [];
  for (let i = 0; i < 38; i++) { const s = 3 + rnd() * 5; dust.push({ d: el(bg, 'layer', `width:${s}px;height:${s}px;border-radius:50%;background:#f8e7ae`), x: rnd() * 1080, y: rnd() * 1920, v: 14 + rnd() * 26, ph: rnd() * 6.28 }); }
  const vig = el(bg, 'layer', 'left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)');
  el(bg, 'layer', 'left:0;top:0;width:1080px;height:8px;background:#e3c26b;opacity:.8');
  el(bg, 'layer', 'left:0;top:1912px;width:1080px;height:8px;background:#e3c26b;opacity:.8');
  el(bg, 'layer', 'left:0;top:1780px;width:1080px;height:140px', A.skyline());
  const lan = [el(bg, 'layer', 'left:24px;top:0;width:72px;height:170px;transform-origin:50% 0', A.lantern(72)), el(bg, 'layer', 'left:984px;top:0;width:72px;height:170px;transform-origin:50% 0', A.lantern(72))];
  el(bg, 'layer', 'left:60px;top:1850px;width:960px;height:8px;border-radius:4px;background:rgba(255,255,255,.14)');
  const prog = el(bg, 'layer', 'left:60px;top:1850px;width:0;height:8px;border-radius:4px;background:linear-gradient(90deg,#a67c28,#f8e7ae)');
  const TAGC = { respectful: [227, 194, 107], happy: [255, 211, 107], informative: [95, 214, 180], excited: [255, 157, 92], calm: [127, 200, 255], enthusiastic: [255, 122, 168] };
  const colOf = (i) => TAGC[LN[clamp(i, 0, LN.length - 1)].tag] || [227, 194, 107];
  tick((t) => {
    med.style.transform = `rotate(${t * 3}deg)`;
    tile.style.backgroundPosition = `${t * 6}px ${t * 4}px`;
    let idx = LN.length - 1; for (let i = 0; i < LN.length; i++) if (t >= LN[i].s && t < LN[i].e) { idx = i; break; }
    const a = colOf(idx - 1), b = colOf(idx), m = clamp((t - LN[idx].s) / 0.6), c = [0, 1, 2].map((k) => Math.round(a[k] + (b[k] - a[k]) * m));
    glow.style.background = `radial-gradient(circle,rgba(${c},.34) 0,rgba(${c},0) 62%)`;
    dust.forEach((p) => { const y = (((p.y - t * p.v) % 1920) + 1920) % 1920; p.d.style.left = (p.x + Math.sin(t * 0.6 + p.ph) * 18) + 'px'; p.d.style.top = y + 'px'; p.d.style.opacity = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2.4 + p.ph)); });
    lan.forEach((l, i) => { l.style.transform = `rotate(${Math.sin(t * 1.3 + i * 1.7) * 5}deg)`; });
    prog.style.width = (960 * clamp(t / DUR)) + 'px';
  });

  // ---------- helpers ----------
  const stage = el(root, 'stage');
  const scene = (s, e, i, o) => track(el(stage, 'scene'), s, e, { a: 'fade', i: i == null ? 0.4 : i, o: o == null ? 0.4 : o });
  const card = (par, x, y, w, h, s, e, a, cls) => track(el(par, 'card ' + (cls || ''), `left:${x}px;top:${y}px;width:${w}px;height:${h}px`), s, e, { a: a || 'pop', i: 0.5, o: 0.4 });
  const ico = (par, svg, css) => el(par, 'ico', css, svg);
  const put = (par, s, e, a, node, i) => track(node, s, e, { a: a || 'rise', i: i == null ? 0.5 : i, o: 0.4 });
  const logoBox = (par, x, y, w, extra) => { const h = (w * 1080) / 1333; return el(par, 'abs', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w * 0.16}px;overflow:hidden;box-shadow:0 0 0 5px #e3c26b,0 0 60px rgba(227,194,107,.55);${extra || ''}`, '<img src="logo.png" style="width:100%;height:100%;display:block;transform:scale(1.04)">'); };
  const badgeBox = (par, x, y, w) => { const k = w / 562, h = 164 * k; const d = el(par, 'abs', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${28 * k}px;overflow:hidden;box-shadow:0 0 0 4px #e3c26b,0 0 40px rgba(227,194,107,.5)`); d.innerHTML = `<img src="google-play-badge.png" style="position:absolute;width:${646 * k}px;left:${-42 * k}px;top:${-42 * k}px;display:block">`; return d; };
  const rings = (par, cx, cy, size, s, e, n) => { const r = []; for (let k = 0; k < n; k++) r.push(el(par, 'abs ring', `left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px`)); const h = el(par, 'abs', 'left:0;top:0'); track(h, s, e, { a: 'fade', i: 0.2, o: 0.3, fn: (_, t) => r.forEach((d, k) => { const p = (((t * 0.9 + k / n) % 1) + 1) % 1; d.style.scale = String(0.8 + p * 0.9); d.style.opacity = String((1 - p) * 0.6); }) }); return r; };
  const counter = (node, s, e, to, fmt) => track(node, s, 1e9, { a: 'pop', i: 0.4, o: 0, fn: (x, t) => { x.textContent = fmt(Math.round(to * EASE.out(clamp((t - s) / (e - s))))); } });
  const hlSub = (w) => /কুরআন|তাফসী|হাদিস|ইনস্টল|অ্যাপ|পড়ুন|স্টোর|কিতাব|পিডিএফ/.test(w);

  // ---------- brand bar (hidden in first and final scenes) ----------
  const bar = el(root, 'layer', 'left:0;top:58px;width:1080px;height:112px;display:flex;align-items:center;justify-content:center;gap:24px');
  const bi = el(bar, '', 'position:relative;width:118px;height:96px;border-radius:24px;overflow:hidden;box-shadow:0 0 0 3px #e3c26b', '<img src="logo.png" style="width:100%;height:100%;display:block;transform:scale(1.04)">');
  el(bar, 'col', 'align-items:flex-start', '<div class="bn gold" style="font-size:40px;font-weight:700">ইসলামী বিশ্বকোষ ও আল হাদিস S2</div><div class="bn" style="font-size:26px;color:#cfe9df">ইলমে দ্বিন অর্জনের এক অনন্য মাধ্যম</div>');
  track(bar, 1.0, 47.0, { a: 'fade', i: 0.4, o: 0.4 });

  // ---------- subtitles ----------
  const panel = el(root, '', ''); panel.id = 'panel';
  LN.forEach((L) => {
    const long = L.text.length > 62;
    words(panel, L.text, 'bn sub', `left:0;top:0;width:960px;height:330px;box-sizing:border-box;padding:0 44px;font-size:${long ? 52 : 60}px`, L.s, L.s + (L.e - L.s) * 0.86, L.e, { hl: hlSub, o: 0.2 });
  });

  // ================= S1 : greeting 0–1 =================
  let S = scene(0, 1, 0.01, 0.3);
  rings(S, 540, 420, 520, 0, 1, 3);
  put(S, 0, 1, 'pop', logoBox(S, 260, 190, 560), 0.01);
  words(S, 'السَّلَامُ عَلَيْكُمْ', 'ar gold', 'left:0;top:760px;width:1080px;font-size:130px', 0.05, 0.6, 1, { rtl: true, gold: true });
  put(S, 0, 1, 'fade', el(S, 'ico', 'left:340px;top:960px', A.divider(400)), 0.2);

  // ================= S2 : title 1–6 =================
  S = scene(1, 6);
  const m2 = el(S, 'abs', 'left:170px;top:-50px;width:740px;height:740px;opacity:.55', A.medallion(740));
  tick((t) => { m2.style.transform = `rotate(${t * 6}deg)`; });
  put(S, 1.0, 6, 'fade', m2, 0.6);
  const g2 = el(S, 'abs', 'left:190px;top:-30px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(248,231,174,.55),rgba(248,231,174,0) 65%)');
  track(g2, 1.0, 6, { a: 'fade', i: 0.6, o: 0.4, fn: (x, t) => { x.style.scale = String(1 + 0.06 * Math.sin(t * 3)); } });
  put(S, 1.2, 6, 'pop', el(S, 'ico', 'left:270px;top:130px', A.book(540)), 0.7);
  words(S, 'ইলমে দ্বিন অর্জনের এক অনন্য মাধ্যম', 'bn', 'left:40px;top:640px;width:1000px;font-size:62px;color:#fff6dc', 1.3, 3.5, 6, {});
  put(S, 3.4, 6, 'fade', el(S, 'ico', 'left:340px;top:790px', A.divider(400)), 0.4);
  words(S, 'ইসলামী বিশ্বকোষ ও আল হাদিস S2', 'bn', 'left:30px;top:830px;width:1020px;font-size:86px;font-weight:700', 3.6, 5.4, 6, { gold: true });

  // ================= S3 : Quran 6–12 =================
  S = scene(6, 12);
  put(S, 6.1, 12, 'pop', el(S, 'ico', 'left:370px;top:10px', A.quran(340)), 0.6);
  words(S, 'الْقُرْآنُ الْكَرِيمُ', 'ar gold', 'left:0;top:395px;width:1080px;font-size:104px', 6.6, 7.6, 12, { rtl: true, gold: true });
  put(S, 7.6, 12, 'rise', el(S, 'row', 'top:560px', '<span class="chip bn">দুটি বিশুদ্ধ অনুবাদ</span>'), 0.5);
  [[40, 'কানযুল ঈমান', '১', at(2, 0.55), 'left'], [570, 'ইরফানুল কুরআন', '২', at(2, 0.74), 'right']].forEach(([x, name, num, ts, a]) => {
    const c = card(S, x, 700, 470, 430, ts, 12, a);
    el(c, 'ico', 'position:relative', A.starNum(190, num));
    el(c, 'bn t g', 'font-size:50px;font-weight:700', name);
  });

  // ================= S4 : Tafsir 12–19 =================
  S = scene(12, 19);
  [[40, 'তাফসীরে মাযহারী', 'সম্পূর্ণ', 12.0, 'left'], [400, 'তাফসীরে খাযাইনুল ইরফান', '', 15.0, 'right']].forEach(([y, name, sub, ts, a]) => {
    const c = card(S, 50, y, 980, 300, ts, 19, a, 'h');
    el(c, 'ico', 'position:relative', A.stack(190));
    const col = el(c, 'col', 'flex:1;gap:8px');
    el(col, 'ar gold', 'font-size:60px', 'تَفْسِيرٌ');
    el(col, 'bn t', 'font-size:52px;font-weight:700;color:#fff6dc', name);
    if (sub) el(col, 'chip bn', 'font-size:36px;padding:8px 32px', sub);
  });
  const rg = el(S, 'abs', 'left:340px;top:760px;width:400px;height:400px');
  rg.innerHTML = `<svg width="400" height="400" viewBox="0 0 400 400" style="position:absolute;left:0;top:0;overflow:visible"><circle cx="200" cy="200" r="186" fill="rgba(4,32,27,.8)" stroke="rgba(227,194,107,.25)" stroke-width="12"/><circle class="arc" cx="200" cy="200" r="186" fill="none" stroke="#e3c26b" stroke-width="12" stroke-linecap="round" transform="rotate(-90 200 200)" stroke-dasharray="1169" stroke-dashoffset="1169"/></svg>`;
  const dots = []; for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 - Math.PI / 2; dots.push(el(rg, 'abs', `left:${200 + 186 * Math.cos(a) - 14}px;top:${200 + 186 * Math.sin(a) - 14}px;width:28px;height:28px;border-radius:50%;background:#f8e7ae;box-shadow:0 0 18px #e3c26b`)); }
  el(rg, 'bn gold', 'position:absolute;left:0;top:30px;width:400px;text-align:center;font-size:190px;font-weight:700;line-height:1.1', '৮');
  el(rg, 'bn', 'position:absolute;left:30px;top:268px;width:340px;text-align:center;font-size:36px;color:#fff6dc', 'তাফসিরের কাজ চলমান');
  const arc = rg.querySelector('.arc'), t4 = at(4, 0.55);
  track(rg, t4, 19, { a: 'pop', i: 0.6, o: 0.4, fn: (x, t) => { const p = clamp((t - t4 - 0.3) / 1.3); arc.setAttribute('stroke-dashoffset', String(1169 * (1 - EASE.out(p)))); dots.forEach((d, k) => { d.style.opacity = clamp((t - t4 - 0.3 - k * 0.15) / 0.2); }); } });

  // ================= S5 : Hadith 19–26 =================
  S = scene(19, 26);
  const gridw = el(S, 'abs', 'left:90px;top:10px;width:900px;height:520px');
  const bks = []; for (let i = 0; i < 45; i++) bks.push(el(gridw, 'ico', `left:${(i % 9) * 100 + 10}px;top:${Math.floor(i / 9) * 104}px`, A.miniBook(80, i % 2 ? '#145c4b' : '#1d7a63')));
  track(gridw, 19.2, 26, { a: 'fade', i: 0.4, o: 0.4, fn: (_, t) => bks.forEach((b, i) => { const p = clamp((t - 19.3 - i * (2.4 / 45)) / 0.25); b.style.opacity = p; b.style.scale = String(0.5 + 0.5 * EASE.back(p)); }) });
  put(S, 20.4, 26, 'rise', el(S, 'row bn', 'top:560px;font-size:64px;font-weight:700;color:#fff6dc', '<span class="gold">৪৫</span>টি হাদিস গ্রন্থ'), 0.5);
  const cc = card(S, 90, 690, 900, 350, 21.6, 26, 'pop');
  el(cc, 'ar gold', 'font-size:56px', 'الْحَدِيثُ');
  const num = el(cc, 'bn n', 'font-size:140px', '০');
  counter(num, 21.8, 24.8, 270335, bnGroup);
  num.style.position = 'relative'; // counter() tracks the number itself (visible from its start)
  put(S, 24.4, 26, 'pop', el(S, 'row', 'top:1065px', '<span class="chip bn">এখন এক অ্যাপেই</span>'), 0.5);

  // ================= S6 : Library 26–34 =================
  S = scene(26, 34);
  const lib = (y, ts, art, big, sub, to, ce) => {
    const c = card(S, 50, y, 980, 340, ts, 34, 'left', 'h');
    el(c, 'ico', 'position:relative', art);
    const col = el(c, 'col', 'flex:1');
    const n = el(col, 'bn n', 'font-size:112px', big);
    if (to) counter(n, ts + 0.3, ce, to, (v) => bnDigits(v) + '+');
    el(col, 'bn t', 'font-size:52px;font-weight:700', sub);
  };
  lib(10, 26.0, A.offline(200), '৮০০+', 'অফলাইন কিতাব', 800, 27.6);
  lib(380, 28.0, A.pdf(200), '১০০০+', 'অনলাইন পিডিএফ বই', 1000, 30.2);
  const c3 = card(S, 50, 750, 980, 340, 31.0, 34, 'right', 'h');
  el(c3, 'ico', 'position:relative', A.shelf(230));
  const col3 = el(c3, 'col', 'flex:1;gap:14px');
  el(col3, 'bn t', 'font-size:50px;font-weight:700', 'লেখক ও বিষয়ভিত্তিক');
  el(col3, 'chip bn', 'font-size:42px', 'সুন্দরভাবে সাজানো');

  // ================= S7 : Tools 34–41 =================
  S = scene(34, 41);
  let toolEnd = 41;
  const tool = (x, y, ts, art, name, w) => { const c = card(S, x, y, w || 470, 310, ts, toolEnd, 'pop'); const a = el(c, 'ico', 'position:relative', art); el(c, 'bn t', 'font-size:48px;font-weight:700', name); return c; };
  const cl = tool(40, 20, 34.0, A.clock(150), 'নামাজের সময়');
  tool(570, 20, 35.0, A.moon(150), 'সেহরি ইফতার');
  const cp = tool(40, 360, 36.0, A.compass(150), 'কিবলা কম্পাস');
  tool(570, 360, 37.0, A.pin(150), 'মসজিদ খুঁজি');
  const tb = tool(280, 700, 38.0, A.tasbih(150), 'ডিজিটাল তাসবিহ', 520);
  const hh = cl.querySelector('.hh'), mh = cl.querySelector('.mh'), nd = cp.querySelector('.nd'), bd = tb.querySelectorAll('.bd');
  tick((t) => { mh.setAttribute('transform', `rotate(${(t * 90) % 360} 100 100)`); hh.setAttribute('transform', `rotate(${(t * 7.5) % 360 + 40} 100 100)`); nd.setAttribute('transform', `rotate(${Math.sin(t * 1.4) * 28} 100 100)`); const k = Math.floor(t * 3) % 14; bd.forEach((b, i) => b.setAttribute('fill', i === k ? '#f8e7ae' : '#145c4b')); });
  put(S, 39.6, 41, 'pop', el(S, 'row', 'top:1060px', '<span class="chip bn">সব কিছু এক অ্যাপেই</span>'), 0.5);

  // ================= S8 : More 41–47 =================
  S = scene(41, 47); toolEnd = 47;
  tool(40, 20, 41.0, A.mic(150), 'বয়ান');
  tool(570, 20, 42.0, A.note(150), 'নাত');
  tool(40, 350, 43.0, A.dua(150), 'মাসনুন দোয়া');
  tool(570, 350, 44.0, A.nametag(150), 'ইসলামিক নাম');
  const lv = card(S, 40, 690, 1000, 420, 45.0, 47, 'zoom');
  el(lv, 'ico', 'position:relative', A.kaaba(400));
  const lt = el(lv, 'col', 'gap:16px');
  const live = el(lt, 'bn', 'display:inline-flex;align-items:center;gap:14px;padding:8px 30px;border-radius:50px;background:#b32a2a;color:#fff;font-size:44px;font-weight:700', '<span class="dot" style="display:inline-block;width:22px;height:22px;border-radius:50%;background:#fff"></span>লাইভ');
  const dot = live.querySelector('.dot'); tick((t) => { dot.style.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 6)); });
  el(lt, 'bn t', 'font-size:50px;font-weight:700', 'হারামাইন সম্প্রচার');
  lv.style.flexDirection = 'row'; lv.style.gap = '24px';

  // ================= S9 : Final CTA 47–end =================
  S = scene(47, DUR + 1, 0.5, 0.01);
  put(S, 47.2, DUR + 1, 'drop', el(S, 'row', 'top:10px', '<span class="chip bn" style="font-size:50px">আজই প্লে স্টোর থেকে ইনষ্টল করুন</span>'), 0.5);
  rings(S, 540, 380, 440, 47, DUR + 1, 3);
  const bigIcon = logoBox(S, 320, 170, 440);
  track(bigIcon, 47.4, DUR + 1, { a: 'pop', i: 0.7, o: 0 });
  words(S, 'ইসলামী বিশ্বকোষ ও আল হাদিস S2', 'bn', 'left:30px;top:600px;width:1020px;font-size:78px;font-weight:700', 50.0, 52.4, DUR + 1, { gold: true, o: 0 });
  const bgd = badgeBox(S, 280, 820, 520);
  const bw = el(S, 'abs', 'left:0;top:0'); bw.appendChild(bgd);
  track(bw, 48.6, DUR + 1, { a: 'pop', i: 0.6, o: 0, fn: (x, t) => { x.style.scale = String(1 + 0.03 * Math.sin(t * 4)); x.style.transformOrigin = '540px 900px'; } });
  const sh = el(S, 'abs', 'left:0;top:1010px;width:1080px;height:160px');
  el(sh, 'ico', 'left:350px;top:10px', A.share(130)); el(sh, 'ico', 'left:600px;top:10px', A.heart(130));
  track(sh, 53.2, DUR + 1, { a: 'pop', i: 0.6, o: 0, fn: (x, t) => { x.style.scale = String(1 + 0.06 * Math.sin(t * 5)); } });

  // ---------- ready ----------
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  try { await Promise.all(Array.from(document.images).map((i) => (i.decode ? i.decode().catch(() => {}) : 0))); } catch (e) {}
  window.renderAt(0);
  window.__ready = true;
})();
