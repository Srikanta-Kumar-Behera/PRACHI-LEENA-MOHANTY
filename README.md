# A Journey to Shreya's Heart ❤️

An eight-page interactive love story that ends in a proposal, plus a QR code page.
Built with React, Vite, Framer Motion, GSAP, Lucide icons and `qrcode`.

All wording and photographs are example placeholders. **Replace them with your own before sending it.**

## The pages

| # | Page | What happens |
|---|------|--------------|
| 1 | The Envelope | A glowing envelope opens with flying hearts. The first click also starts the music. |
| 2 | A Little Message | Her name is revealed letter by letter among flowers, butterflies and golden dust. |
| 3 | The Story Behind Us | A horizontal timeline. Each card flips open to show a photo and a memory. |
| 4 | Words From My Heart | A wax-sealed envelope. Break the seal and the letter types itself out. |
| 5 | A World Of Memories | A polaroid carousel. Swipe, flip, and reveal hidden messages. |
| 6 | A Little Surprise | A gift box shakes, opens in light, and a rose bouquet blooms. |
| 7 | The Grand Proposal | Moonlit rose garden, a ring box that opens, then the question and two answers. |
| 8 | The Final Surprise | A thank-you with a drawing heart, and a button to replay everything. |
| QR | `/#/qr` | Makes a printable, downloadable QR code for the live link. |

"I NEED A MOMENT" shows a kind message and a button back to the question. Nothing is forced.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). On the same Wi-Fi it also prints a "Network" address you can open on your phone to test.

To see the finished build:

```bash
npm run build
npm run preview
```

## Make it yours (everything is in `src/config.js`)

- **Text:** every message, title, caption and button label.
- **Photos:** copy images into `public/photos/`, then set for example `photo: "/photos/first-meeting.jpg"`. An empty path shows a pink "Add your photo" placeholder. Keep each photo under about 400 KB.
- **Your name:** `yourName`, and the letter signature.
- **Music:** by default a soft melody is generated in the browser. To use a song, put an mp3 in `public/music/` and set `musicSrc: "/music/our-song.mp3"`. Only use music you have the right to share.

If you change her name, also check the places in `config.js` that say "Shreya" in the messages.

## Put it online (free)

### Netlify (easiest, no account tools needed)

1. Run `npm run build`. This creates a `dist` folder.
2. Go to https://app.netlify.com/drop and drag the `dist` folder onto the page.
3. Netlify gives you a public address. Rename it in Site settings if you like.

### Vercel

1. Put this folder in a GitHub repository.
2. At https://vercel.com choose **Add New → Project**, import the repository and press **Deploy**. Vercel detects Vite by itself.

### GitHub Pages

Works too. The project already uses relative paths, so it runs under a sub-path.

## Make the QR code

1. Open your live site and add `/#/qr` to the end, for example `https://your-site.netlify.app/#/qr`.
2. The page fills in the live address automatically and draws the QR code. If it says the link only works on your computer, paste the public link into the box and press **Update**.
3. Press **Download QR Code** for a 2000 px PNG, **Copy Website Link**, or **Print**.
4. **Test it:** scan the code with a phone camera and confirm the surprise opens, before you print or share it.

The small heart in the centre is covered by the code's highest error-correction level, so scanning is not affected. If a particular camera struggles, download the code again after shortening your web address (a shorter link makes a simpler code).

Keep the QR page private. Do not send it to her before the surprise.

## Tips for the day

- The first tap on page 1 starts the music, because phones block sound until a tap. She can turn it off with the speaker button.
- Her progress is remembered on her device. If you test it yourself on the same phone, press **Replay the Experience** on the last page to reset it.
- Test the whole thing on an actual phone, with the sound on, a day before.

## Project layout

```
index.html            page shell and fonts
netlify.toml          Netlify build settings
vercel.json           Vercel build settings
vite.config.js
public/
  favicon.svg
  photos/             put your photographs here
src/
  config.js           ALL your text, captions and photo paths
  main.jsx            entry
  App.jsx             page order, transitions, progress
  pages/              Welcome, Greeting, Story, Letter, Memories, Gift, Proposal, Final, QrPage
  components/         Sky, Fx, Envelope, Roses, Flowers, Loader, MusicPlayer, ProgressNav, CustomCursor, Photo
  lib/                audio (music and sounds), storage, placeholder, typing, text helpers
  styles/global.css   all styling
```
