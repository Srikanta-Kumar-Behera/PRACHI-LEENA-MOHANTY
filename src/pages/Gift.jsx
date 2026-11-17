import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Bouquet } from "../components/Roses.jsx";
import { useFx } from "../components/Fx.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

// PAGE 6 · A little surprise
// A GSAP timeline shakes the gift, lifts the lid, releases a beam of light,
// then a bouquet blooms and the message appears.
export default function Gift({ next }) {
  const G = config.gift;
  const [phase, setPhase] = useState("idle"); // idle | opening | revealed
  const root = useRef(null);
  const box = useRef(null);
  const ctxRef = useRef(null);
  const fx = useFx();

  useEffect(
    () => () => {
      if (ctxRef.current) ctxRef.current.revert();
    },
    []
  );

  useEffect(() => {
    if (phase !== "revealed") return undefined;
    const id = window.setTimeout(() => fx.sparkles(window.innerWidth / 2, window.innerHeight * 0.4, 50), 500);
    return () => window.clearTimeout(id);
  }, [phase, fx]);

  const open = () => {
    if (phase !== "idle") return;
    audio.unlock();
    audio.sfx.gift();
    setPhase("opening");
    const r = box.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setPhase("revealed") });
      tl.to(".gb", { x: 10, duration: 0.06, repeat: 7, yoyo: true, ease: "none" })
        .to(".gb-lid", { y: -110, rotate: -22, x: -36, duration: 0.7, ease: "back.out(2)" })
        .fromTo(".gb-beam", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, "<")
        .add(() => fx.sparkles(cx, cy, 70), "<0.2")
        .to(".gb", { scale: 1.08, opacity: 0, duration: 0.6, delay: 0.5, ease: "power2.in" });
    }, root);
  };

  return (
    <div className="page gift" ref={root}>
      <div className="inner">
        <AnimatePresence mode="wait">
          {phase !== "revealed" ? (
            <motion.div key="box" className="gift-stage" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="eyebrow">A little surprise</p>
              <div
                className="gb clickable"
                ref={box}
                role="button"
                tabIndex={0}
                aria-label="Open the gift"
                onClick={open}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
              >
                <div className="gb-beam" aria-hidden="true" />
                <div className="gb-lid">
                  <svg className="gb-bow" viewBox="0 0 120 60" aria-hidden="true">
                    <path d="M60 50C34 50 8 36 14 18 20 2 50 14 60 40 70 14 100 2 106 18 112 36 86 50 60 50Z" fill="#f3dca6" />
                    <circle cx="60" cy="42" r="9" fill="#c9a24f" />
                  </svg>
                </div>
                <div className="gb-body">
                  <i className="gb-ribbon" />
                </div>
                <span className="gb-star s1" />
                <span className="gb-star s2" />
                <span className="gb-star s3" />
              </div>
              <p className="hint">{G.hint}</p>
            </motion.div>
          ) : (
            <motion.div key="reveal" className="gift-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <Bouquet />
              <motion.p className="gift-msg glass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1.2 }}>
                {G.message}
              </motion.p>
              <motion.button
                type="button"
                className="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6, duration: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  audio.sfx.tap();
                  next();
                }}
              >
                {G.button} <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
