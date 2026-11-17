import { createContext, useContext, useEffect, useMemo, useRef } from "react";

// A fullscreen canvas above everything for one-off effects:
//   hearts(x, y, n)   flying hearts from a point
//   sparkles(x, y, n) a burst of golden sparkles
//   trail(x, y)       tiny cursor sparkle
//   fireworks(x, y)   a firework burst
//   confetti(n)       heart confetti falling from the top
//   celebrate()       the full proposal celebration
// The animation loop only runs while particles exist.

const FxContext = createContext(null);
export const useFx = () => useContext(FxContext);

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const COLORS = ["#f8d7de", "#f08aa0", "#d6405f", "#cdb8ec", "#f3dca6", "#fff6ec"];
const SPARK = ["#f3dca6", "#f08aa0", "#cdb8ec", "#ffd1dc", "#e8c987"];

function heart(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.5, y - s * 1.1, x, y - s * 0.45);
  c.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s, y - s * 0.4, x, y + s * 0.35);
  c.fill();
}

export function FxProvider({ children }) {
  const cvRef = useRef(null);
  const S = useRef({ parts: [], raf: 0, W: 0, H: 0, last: 0, timers: [], ctx: null, reduce: false, loop: null });

  const api = useMemo(() => {
    const s = S.current;
    const kick = () => {
      if (!s.raf && s.ctx && s.loop) {
        s.last = performance.now();
        s.raf = requestAnimationFrame(s.loop);
      }
    };
    const add = (p) => {
      s.parts.push(p);
      if (s.parts.length > 600) s.parts.shift();
    };
    const out = {
      hearts(x, y, n = 30) {
        for (let i = 0; i < n; i += 1) {
          add({ k: "heart", x, y, vx: rand(-4, 4), vy: rand(-8, -2), g: 0.12, drag: 0.99, r: rand(0, 6), vr: rand(-0.1, 0.1), s: rand(8, 18), c: pick(COLORS), life: 0, max: rand(70, 120) });
        }
        kick();
      },
      sparkles(x, y, n = 24) {
        for (let i = 0; i < n; i += 1) {
          const a = rand(0, 6.283);
          const sp = rand(1, 5);
          add({ k: "spark", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.03, drag: 0.98, s: rand(1.2, 2.6), c: pick(SPARK), life: 0, max: rand(40, 80) });
        }
        kick();
      },
      trail(x, y) {
        if (s.reduce) return;
        add({ k: "spark", x, y, vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4), g: 0.01, drag: 1, s: rand(1, 2), c: "#f3dca6", life: 0, max: 30 });
        kick();
      },
      fireworks(x, y) {
        const c = pick(SPARK);
        const n = s.W < 600 ? 34 : 56;
        for (let i = 0; i < n; i += 1) {
          const a = (6.283 * i) / n + rand(-0.06, 0.06);
          const sp = rand(1.6, 5.4);
          add({ k: "spark", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.05, drag: 0.985, s: rand(1.4, 2.6), c: i % 5 === 0 ? "#fff6ec" : c, life: 0, max: rand(55, 90) });
        }
        kick();
      },
      confetti(n = 40) {
        for (let i = 0; i < n; i += 1) {
          add({ k: "heart", x: rand(0, s.W), y: rand(-s.H * 0.35, -10), vx: rand(-0.6, 0.6), vy: rand(1.4, 3.4), g: 0, drag: 1, sw: rand(0, 6.28), r: rand(0, 6.28), vr: rand(-0.07, 0.07), s: rand(7, 14), c: pick(COLORS), life: 0, max: rand(260, 420) });
        }
        kick();
      },
      celebrate() {
        if (s.reduce) {
          out.confetti(40);
          return;
        }
        let n = 0;
        out.confetti(70);
        out.fireworks(s.W * 0.3, s.H * 0.3);
        out.fireworks(s.W * 0.7, s.H * 0.25);
        const id = window.setInterval(() => {
          out.fireworks(rand(s.W * 0.12, s.W * 0.88), rand(s.H * 0.1, s.H * 0.5));
          if (n % 3 === 0) out.confetti(22);
          n += 1;
          if (n > 16) window.clearInterval(id);
        }, 650);
        s.timers.push(id);
      }
    };
    return out;
  }, []);

  useEffect(() => {
    const s = S.current;
    const cv = cvRef.current;
    const c = cv.getContext("2d");
    s.ctx = c;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      s.W = window.innerWidth;
      s.H = window.innerHeight;
      cv.width = s.W * dpr;
      cv.height = s.H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    s.loop = (t) => {
      const dt = Math.min(40, t - s.last) / 16.7;
      s.last = t;
      c.clearRect(0, 0, s.W, s.H);
      for (let i = s.parts.length - 1; i >= 0; i -= 1) {
        const p = s.parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          s.parts.splice(i, 1);
          continue;
        }
        const a = 1 - p.life / p.max;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.g * dt;
        p.vx *= p.drag;
        if (p.sw !== undefined) p.x += Math.sin(p.sw + p.life * 0.04) * 0.8 * dt;
        if (p.k === "spark") {
          c.globalCompositeOperation = "lighter";
          c.globalAlpha = a;
          c.fillStyle = p.c;
          c.beginPath();
          c.arc(p.x, p.y, p.s * (0.5 + a), 0, 6.283);
          c.fill();
          c.globalCompositeOperation = "source-over";
        } else {
          p.r += p.vr * dt;
          c.globalAlpha = Math.min(1, a * 2);
          c.fillStyle = p.c;
          c.save();
          c.translate(p.x, p.y);
          c.rotate(p.r);
          heart(c, 0, 0, p.s);
          c.restore();
        }
      }
      c.globalAlpha = 1;
      if (s.parts.length) s.raf = requestAnimationFrame(s.loop);
      else s.raf = 0;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.timers.forEach((id) => window.clearInterval(id));
      s.timers = [];
      s.ctx = null;
      s.loop = null;
    };
  }, []);

  return (
    <FxContext.Provider value={api}>
      {children}
      <canvas ref={cvRef} className="fx-canvas" aria-hidden="true" />
    </FxContext.Provider>
  );
}
