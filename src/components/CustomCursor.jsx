import { useEffect, useRef, useState } from "react";
import { useFx } from "./Fx.jsx";

// A glowing dot with a softly trailing ring, desktop only. Phones and tablets
// (anything without a fine pointer) keep their normal touch behaviour.
export default function CustomCursor() {
  const fx = useFx();
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let lastTrail = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
      const now = performance.now();
      if (now - lastTrail > 70) {
        lastTrail = now;
        fx.trail(x, y);
      }
    };
    const over = (e) => {
      const hot = !!(e.target.closest && e.target.closest("button,a,input,[role='button'],.clickable"));
      if (ring.current) ring.current.classList.toggle("big", hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, [enabled, fx]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <i />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true">
        <i />
      </div>
    </>
  );
}
