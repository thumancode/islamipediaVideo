// Capture frames with headless Chromium (Playwright) and encode with FFmpeg.
//   node render.js                 full video
//   node render.js --test 10       only the first 10 seconds
//   node render.js --still 2,10,30 PNG stills at those times (seconds)
//   node render.js --workers 4     parallel browsers
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const OUT = 'app-video.mp4';
const AUDIO = 'audio.mp3';
const W = 1080, H = 1920, FPS = 30;

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : null; };
const testSec = arg('test') ? parseFloat(arg('test')) : null;
const stills = arg('still') ? arg('still').split(',').map(Number) : null;
const workers = Math.max(1, parseInt(arg('workers') || Math.min(4, os.cpus().length), 10));

// ---- 1. timestamps.txt -> lines.js (single source of truth) ----
function parseLines() {
  const raw = fs.readFileSync('timestamps.txt', 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  const out = [];
  for (const l of raw) {
    if (!l.trim()) continue;
    const p = l.split('|').map((x) => x.trim());
    if (p.length < 3) continue;
    out.push({ s: parseFloat(p[0]), e: parseFloat(p[1]), text: p[2], tag: (p[3] || 'calm').toLowerCase() });
  }
  return out;
}
function audioDuration() {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', AUDIO], { encoding: 'utf8' });
  const d = parseFloat((r.stdout || '').trim());
  return isNaN(d) ? 0 : d;
}
const LINES = parseLines();
if (!LINES.length) { console.error('timestamps.txt has no valid lines'); process.exit(1); }
const lastEnd = Math.max(...LINES.map((l) => l.e));
// whole seconds; never cut the voice if the audio is slightly longer than the last timestamp
const DURATION = Math.ceil(Math.max(lastEnd, audioDuration()) - 0.001);
fs.writeFileSync('lines.js', 'const LINES=' + JSON.stringify(LINES) + ';\nconst DURATION=' + DURATION + ';\nwindow.LINES=LINES;window.DURATION=DURATION;\n');
console.log(`lines: ${LINES.length}, duration: ${DURATION}s, fps: ${FPS}`);

async function openPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  return page;
}
const launchArgs = ['--no-sandbox', '--font-render-hinting=none', '--disable-lcd-text'];

async function main() {
  if (stills) {
    const browser = await chromium.launch({ args: launchArgs });
    const page = await openPage(browser);
    for (const t of stills) {
      await page.evaluate((x) => window.renderAt(x), t);
      const f = `still-${String(t).replace('.', '_')}.png`;
      await page.screenshot({ path: f, type: 'png' });
      console.log('wrote', f);
    }
    await browser.close();
    return;
  }

  const total = testSec ? Math.min(testSec, DURATION) : DURATION;
  const frames = Math.round(total * FPS);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'frames-'));
  const per = Math.ceil(frames / workers);
  let done = 0;
  const t0 = Date.now();

  async function work(w) {
    const a = w * per, b = Math.min(frames, a + per);
    if (a >= b) return;
    const browser = await chromium.launch({ args: launchArgs });
    const page = await openPage(browser);
    for (let f = a; f < b; f++) {
      await page.evaluate((t) => window.renderAt(t), f / FPS);
      await page.screenshot({ path: path.join(tmp, 'f' + String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 });
      done++;
      if (done % 60 === 0 || done === frames) {
        const el = (Date.now() - t0) / 1000;
        console.log(`frame ${done}/${frames} (${Math.round((done / frames) * 100)}%) ${el.toFixed(0)}s elapsed`);
      }
    }
    await browser.close();
  }
  await Promise.all(Array.from({ length: workers }, (_, i) => work(i)));

  const ff = spawnSync('ffmpeg', [
    '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'), '-i', AUDIO,
    '-filter_complex', `[1:a]apad,atrim=0:${total}[a]`,
    '-map', '0:v', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT,
  ], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  if (ff.status !== 0) { console.error('FFmpeg failed'); process.exit(1); }
  console.log('done ->', OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
