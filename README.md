# ইসলামী বিশ্বকোষ ও আল হাদিস S2 — promo video (1080×1920, 30 fps)

HTML/CSS/JS animation → recorded frame by frame with Playwright → encoded with FFmpeg → `app-video.mp4`.

## Render on GitHub
1. Create a new GitHub repository and upload **all files** in this folder. Keep the workflow at exactly `.github/workflows/render.yml`.
2. Open the **Actions** tab → **Render app video** → **Run workflow**. (Optional: type `10` in *test_seconds* to render only the first 10 seconds.)
3. When the run is green, open it and download the **app-video** artifact (a zip containing `app-video.mp4`).

## Change timing or text
Edit `timestamps.txt` (`start | end | text | emotion`) and run the workflow again. `render.js` regenerates `lines.js` from it.
The video length is the last timestamp or the audio length, whichever is longer, rounded up to a whole second (now 57 s).
Scene beats are keyed to the spoken line (see `at(lineIndex, fraction)` in `scenes.js`); adjust the numbers there if a visual should appear earlier or later.

## Local run (optional)
`npm install && npx playwright install chromium && node render.js --test 8`
Stills: `node render.js --still 2,10,30` writes `still-<t>.png`.

## Files
index.html, style.css, art.js, scenes.js, lines.js, render.js, package.json, timestamps.txt, audio.mp3, logo.png, google-play-badge.png, .github/workflows/render.yml

Note: `audio.mp3` actually contains WAV (PCM) data. FFmpeg detects this by content, so it works unchanged.
