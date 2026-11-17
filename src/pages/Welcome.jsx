import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Envelope from "../components/Envelope.jsx";
import { useFx } from "../components/Fx.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

// PAGE 1 · The mysterious welcome
export default function Welcome({ next }) {
  const [open, setOpen] = useState(false);
  const envRef = useRef(null);
  const fx = useFx();
  const w = config.welcome;

  const start = () => {
    if (open) return;
    // This click is the first interaction, so sound is allowed from here.
    audio.unlock();
    audio.autoStart();
    audio.sfx.open();
    setOpen(true);
    const r = envRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    fx.hearts(cx, r.top + r.height / 2, 46);
    window.setTimeout(() => fx.hearts(cx, r.top + r.height * 0.25, 34), 700);
    window.setTimeout(next, 2400);
  };

  return (
    <div className="page welcome">
      <div className="inner">
        <motion.h1 className="display glow-text w-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
          {w.line1}
        </motion.h1>
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1 }}>
          {w.line2}
        </motion.p>
        <motion.div ref={envRef} className="env-holder" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 1.4 }}>
          <Envelope open={open} glow tone="rose" onClick={start} label="Open the envelope">
            <div className="card-note">
              <span className="display">{w.cardText}</span>
              <span aria-hidden="true">❤️</span>
            </div>
          </Envelope>
        </motion.div>
        <motion.button type="button" className="btn" onClick={start} disabled={open} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.1 }}>
          {w.button}
        </motion.button>
      </div>
    </div>
  );
}
