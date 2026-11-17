import { useEffect, useRef } from "react";

// A full-screen canvas behind every page: twinkling stars, floating hearts,
// rose petals, butterflies and golden dust. Each page passes a `scene` object
// with multipliers (0 = none, 1 = default amount) so every page feels different.
//
// Counts are reduced on phones and everything pauses when the tab is hidden.

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const BASE = { stars: 120, hearts: 10, petals: 32, flies: 6, dust: 44 };
const PETAL = ["#f8d7de", "#f4a9ba", "#ec6f8a", "#d6405f"];
const FLY = ["#f4a9ba", "#cdb8ec", "#f3dca6", "#ffffff"];

function heart(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.5, y - s * 1.1, x, y - s * 0.45);
  c.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s, y - s * 0.4, x, y + s * 0.35);
  c.fill();
}

function butterfly(c, x, y, s, flap, color, angle) {
  const w = 0.25 + 0.75 * Math.abs(Math.cos(flap));
  c.save();
  c.translate(x, y);
  c.rotate(angle + Math.PI / 2);
  c.fillStyle = color;
  [1, -1].forEach((d) => {
    c.save();
    c.scale(d * w, 1);
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(s * 0.9, -s * 1.1, s * 1.6, -s * 0.2, s * 0.5, s * 0.1);
    c.bezierCurveTo(s * 1.3, s * 0.7, s * 0.7, s * 1.2, 0, s * 0.3);
    c.fill();
    c.restore();
  });
  c.fillStyle = "#2a1030";
  c.fillRect(-0.8, -s * 0.4, 1.6, s * 0.95);
  c.restore();
}

export default function Sky({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const c = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let last = 0;
    let it = {};

    const count = (k) => Math.round(BASE[k] * (scene[k] || 0) * (W < 600 ? 0.6 : 1));

    function seed() {
      it.stars = Array.from({ length: count("stars") }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(0.3, 1.5), p: rand(0, 6.28), s: rand(0.4, 1.4) }));
      it.hearts = Array.from({ length: count("hearts") }, () => ({ x: rand(0, W), y: rand(0, H), s: rand(6, 13), v: rand(0.12, 0.32), p: rand(0, 6.28) }));
      it.petals = Array.from({ length: count("petals") }, () => ({ x: rand(0, W), y: rand(-H, H), s: rand(6, 12), vy: rand(0.6, 1.5), sw: rand(0, 6.28), sa: rand(0.4, 1.1), r: rand(0, 6.28), vr: rand(-0.03, 0.03), f: rand(0, 6.28), vf: rand(0.02, 0.05), c: pick(PETAL) }));
      it.flies = Array.from({ length: count("flies") }, () => ({ x: rand(0, W), y: rand(0, H), a: rand(0, 6.28), v: rand(0.4, 0.9), f: rand(0, 6.28), s: rand(7, 12), c: pick(FLY) }));
      it.dust = Array.from({ length: count("dust") }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(0.8, 2.2), v: rand(0.1, 0.35), p: rand(0, 6.28) }));
    }

    function draw(t, dt) {
      c.clearRect(0, 0, W, H);
      c.fillStyle = "#fff";
      it.stars.forEach((s) => {
        c.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(s.p + t * 0.001 * s.s));
        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, 6.283);
        c.fill();
      });

      c.fillStyle = "#ff9fb6";
      c.globalAlpha = 0.3;
      it.hearts.forEach((h) => {
        heart(c, h.x + Math.sin(h.p + t * 0.0007) * 16, h.y, h.s);
        if (dt) {
          h.y -= h.v * dt;
          if (h.y < -30) {
            h.y = H + 20;
            h.x = rand(0, W);
          }
        }
      });

      c.globalAlpha = 0.85;
      it.petals.forEach((p) => {
        c.fillStyle = p.c;
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.r);
        c.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.f)));
        c.beginPath();
        c.moveTo(0, -p.s);
        c.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.8, p.s * 0.6, 0, p.s);
        c.bezierCurveTo(-p.s * 0.8, p.s * 0.6, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
        c.fill();
        c.restore();
        if (dt) {
          p.y += p.vy * dt;
          p.x += Math.sin(p.sw + t * 0.001) * p.sa * dt;
          p.r += p.vr * dt;
          p.f += p.vf * dt;
          if (p.y > H + 20) {
            p.y = -20;
            p.x = rand(0, W);
          }
        }
      });

      c.globalAlpha = 0.9;
      it.flies.forEach((b) => {
        butterfly(c, b.x, b.y, b.s, b.f, b.c, b.a);
        if (dt) {
          b.a += rand(-0.12, 0.12) * dt * 0.4;
          b.x += Math.cos(b.a) * b.v * dt * 1.4;
          b.y += Math.sin(b.a) * b.v * dt * 0.8 - 0.12 * dt;
          b.f += 0.3 * dt;
          if (b.x < -30) b.x = W + 20;
          if (b.x > W + 30) b.x = -20;
          if (b.y < -30) b.y = H + 20;
          if (b.y > H + 30) b.y = -20;
        }
      });

      c.globalCompositeOperation = "lighter";
      c.fillStyle = "#f3dca6";
      it.dust.forEach((d) => {
        c.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(d.p + t * 0.0012));
        c.beginPath();
        c.arc(d.x, d.y, d.r, 0, 6.283);
        c.fill();
        if (dt) {
          d.y -= d.v * dt;
          if (d.y < -10) {
            d.y = H + 10;
            d.x = rand(0, W);
          }
        }
      });
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
    }

    function resize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      if (W && nw === W && Math.abs(nh - H) < 160) return; // ignore mobile address-bar jitter
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = nw;
      H = nh;
      cv.width = W * dpr;
      cv.height = H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw(0, 0);
    }

    function loop(t) {
      const dt = Math.min(40, t - last) / 16.7;
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scene]);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}
