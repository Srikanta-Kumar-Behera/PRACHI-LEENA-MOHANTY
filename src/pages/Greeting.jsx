import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import FlowerRow from "../components/Flowers.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

// PAGE 2 · A little message for you
// GSAP splits her name into letters and reveals them one by one.
export default function Greeting({ next }) {
  const root = useRef(null);
  const g = config.greeting;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".g-char", { yPercent: 120, opacity: 0, rotateX: -80, filter: "blur(10px)", stagger: 0.14, duration: 1.2, ease: "back.out(1.6)", delay: 0.5 });
      gsap.from(".g-fade", { opacity: 0, y: 22, duration: 1.2, delay: 2, stagger: 0.6, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="page greeting" ref={root}>
      <FlowerRow />
      <div className="inner">
        <p className="eyebrow g-fade">{g.eyebrow}</p>
        <h1 className="display g-name glow-text" aria-label={config.herName}>
          {[...config.herName].map((ch, i) => (
            <span className="g-char" key={i} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>
        <div className="glass g-card g-fade">
          <p>{g.line}</p>
        </div>
        {/* wrapper keeps GSAP's reveal and Framer's hover on separate elements */}
        <div className="g-fade">
          <motion.button
            type="button"
            className="btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audio.sfx.tap();
              next();
            }}
          >
            {g.button} <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
