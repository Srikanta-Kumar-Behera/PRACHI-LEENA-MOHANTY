import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Heart, RotateCw } from "lucide-react";
import Photo from "../components/Photo.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

const HUES = [340, 280, 25, 200, 320];
const slide = {
  enter: (d) => ({ x: d > 0 ? 260 : -260, opacity: 0, rotate: d > 0 ? 10 : -10, scale: 0.9 }),
  center: { x: 0, opacity: 1, rotate: 0, scale: 1 },
  exit: (d) => ({ x: d > 0 ? -260 : 260, opacity: 0, rotate: d > 0 ? -10 : 10, scale: 0.9 })
};

// PAGE 5 · A world of memories
// A polaroid carousel. Tap a polaroid to flip it, swipe or use the arrows to
// move on, and press the button to reveal a hidden message.
export default function Memories({ next }) {
  const M = config.memories;
  const total = M.items.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [flipped, setFlipped] = useState(false);
  const [found, setFound] = useState({});
  const item = M.items[i];
  const foundCount = Object.keys(found).length;

  const go = (d) => { 
    audio.sfx.tap();
    setDir(d);
    setFlipped(false);
    setI((v) => (v + d + total) % total);
  };
  const flip = () => {
    audio.sfx.tap();
    setFlipped((f) => !f);
  };
  const reveal = () => {
    audio.sfx.ring();
    setFound((f) => ({ ...f, [i]: true }));
  };

  return (
    <div className="page memories">
      <div className="inner">
        <p className="eyebrow">Memory {i + 1} of {total}</p>
        <h1 className="display page-title">{M.title}</h1>

        <div className="car">
          <button type="button" className="arrow" aria-label="Previous photo" onClick={() => go(-1)}>
            <ChevronLeft />
          </button>
          <div className="car-stage">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={i}
                className="pol-wrap"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                onTap={flip}
              >
                <motion.div className="pol clickable" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}>
                  <div className="pol-face pol-front">
                    <Photo src={item.photo} label={item.caption} hue={HUES[i % HUES.length]} alt={item.caption} className="pol-img" />
                    <p className="pol-cap">{item.caption}</p>
                  </div>
                  <div className="pol-face pol-back">
                    <p className="pol-note">{item.note}</p>
                    <Heart size={26} fill="currentColor" />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button type="button" className="arrow" aria-label="Next photo" onClick={() => go(1)}>
            <ChevronRight />
          </button>
        </div>

        <div className="dots" role="tablist" aria-label="Choose a memory">
          {M.items.map((m, k) => (
            <button
              key={m.caption}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Memory ${k + 1}: ${m.caption}`}
              className={k === i ? "on" : found[k] ? "found" : ""}
              onClick={() => {
                setDir(k > i ? 1 : -1);
                setFlipped(false);
                setI(k);
              }}
            />
          ))}
        </div>

        <div className="mem-actions">
          <button type="button" className="btn btn-ghost" onClick={flip}>
            <RotateCw size={16} /> Turn it over
          </button>
          <button type="button" className="btn" onClick={reveal} disabled={!!found[i]}>
            <Eye size={16} /> {M.revealLabel}
          </button>
        </div>

        <div className="hidden-msg" aria-live="polite">
          <AnimatePresence mode="wait">
            {found[i] && (
              <motion.p key={i} className="glass" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                {item.hidden}
              </motion.p>
            )}
          </AnimatePresence>
          <small>
            {foundCount} of {total} hidden messages found
          </small>
        </div>

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
          {M.button} <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
