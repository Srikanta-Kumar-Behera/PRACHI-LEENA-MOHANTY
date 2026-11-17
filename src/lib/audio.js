// Sound for the whole site, built with the Web Audio API so there are no
// audio files to host. Nothing plays until the visitor has clicked something
// (browsers require that), and the music volume is kept low.
//
// To use your own song instead, set `musicSrc` in src/config.js.
import { config } from "../config.js";
import { store } from "./storage.js";

let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let delay = null;
let timer = 0;
let nextT = 0;
let beat = 0;
let fileEl = null;
let on = false;
const listeners = new Set();

// C - G - Am - F, as MIDI notes
const CHORDS = [
  [48, 55, 60, 64],
  [43, 55, 59, 62],
  [45, 52, 60, 64],
  [41, 48, 57, 60]
];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const emit = () => listeners.forEach((fn) => fn(on));

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.8;
  sfxBus.connect(master);
  // a soft echo that both the music and the effects can feed
  delay = ctx.createDelay(1);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2200;
  delay.connect(lp);
  lp.connect(feedback);
  feedback.connect(delay);
  lp.connect(master);
  return ctx;
}

function bell(freq, t, vol = 0.06, bus = sfxBus) {
  [
    [1, 1],
    [2.01, 0.25]
  ].forEach(([mul, g]) => {
    const o = ctx.createOscillator();
    const e = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = freq * mul;
    e.gain.setValueAtTime(0.0001, t);
    e.gain.linearRampToValueAtTime(vol * g, t + 0.012);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(e);
    e.connect(bus);
    e.connect(delay);
    o.start(t);
    o.stop(t + 1.7);
  });
}

function noise(t, dur, vol, freq) {
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(f);
  f.connect(g);
  g.connect(sfxBus);
  src.start(t);
}

function pad(m, t, len) {
  [
    ["sine", 0.032],
    ["triangle", 0.012]
  ].forEach(([type, level]) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o.frequency.value = hz(m);
    f.type = "lowpass";
    f.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(level, t + 2);
    g.gain.setValueAtTime(level, t + len - 0.5);
    g.gain.linearRampToValueAtTime(0.0001, t + len + 1.5);
    o.connect(f);
    f.connect(g);
    g.connect(musicBus);
    o.start(t);
    o.stop(t + len + 1.6);
  });
}

function tick() {
  while (nextT < ctx.currentTime + 0.5) {
    const chord = CHORDS[Math.floor(beat / 8) % CHORDS.length];
    if (beat % 8 === 0) chord.forEach((m) => pad(m, nextT, 6.4));
    if (Math.random() < 0.75) bell(hz(pick(chord) + pick([12, 12, 24])), nextT, 0.04, musicBus);
    nextT += 0.8;
    beat += 1;
  }
}

// Plays a sound effect. Silent failure is fine: sound is a bonus, not a need.
function run(fn) {
  try {
    if (!ensure()) return;
    if (ctx.state === "suspended") ctx.resume();
    fn(ctx.currentTime);
  } catch {
    /* ignore */
  }
}

export const audio = {
  /** Call inside a click so the browser allows sound. */
  unlock() {
    const c = ensure();
    if (c && c.state === "suspended") c.resume();
  },
  get musicOn() {
    return on;
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  /** Starts music only if the visitor has not turned it off before. */
  autoStart() {
    if (store.get("music", true)) this.playMusic();
  },
  playMusic() {
    if (config.musicSrc) {
      if (!fileEl) {
        fileEl = new Audio(config.musicSrc);
        fileEl.loop = true;
        fileEl.volume = 0.35;
      }
      fileEl
        .play()
        .then(() => {
          on = true;
          store.set("music", true);
          emit();
        })
        .catch(() => {});
      return;
    }
    if (!ensure()) return;
    ctx.resume();
    nextT = ctx.currentTime + 0.1;
    window.clearInterval(timer);
    timer = window.setInterval(tick, 120);
    tick();
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.9, ctx.currentTime, 0.8);
    on = true;
    store.set("music", true);
    emit();
  },
  pauseMusic() {
    if (fileEl) fileEl.pause();
    if (ctx) {
      musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      window.clearInterval(timer);
    }
    on = false;
    store.set("music", false);
    emit();
  },
  toggleMusic() {
    this.unlock();
    if (on) this.pauseMusic();
    else this.playMusic();
  },
  sfx: {
    open: () =>
      run((t) => {
        noise(t, 0.5, 0.18, 2500);
        [72, 76, 79, 84].forEach((m, i) => bell(hz(m), t + 0.25 + i * 0.14, 0.05));
      }),
    seal: () =>
      run((t) => {
        noise(t, 0.12, 0.3, 900);
        bell(hz(60), t, 0.05);
      }),
    gift: () =>
      run((t) => {
        noise(t, 0.6, 0.14, 1800);
        [72, 76, 79, 83, 84, 88, 91, 96].forEach((m, i) => bell(hz(m), t + 0.3 + i * 0.09, 0.045));
      }),
    ring: () =>
      run((t) => {
        bell(hz(88), t, 0.06);
        bell(hz(95), t + 0.18, 0.05);
        bell(hz(100), t + 0.36, 0.04);
      }),
    tap: () => run((t) => bell(hz(84), t, 0.03)),
    yes: () =>
      run((t) => {
        [60, 64, 67, 72, 76, 79, 84, 88].forEach((m, i) => bell(hz(m), t + i * 0.1, 0.06));
        [72, 79, 84].forEach((m) => bell(hz(m), t + 1, 0.05));
      })
  }
};
