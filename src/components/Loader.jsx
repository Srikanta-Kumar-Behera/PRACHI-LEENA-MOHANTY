import { useEffect } from "react";
import { motion } from "framer-motion";
import { RoseShape, PALETTES } from "./Roses.jsx";

// Opening screen: three roses bloom while fonts finish loading.
export default function Loader({ onDone }) {
  useEffect(() => {
    let alive = true;
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const minimum = new Promise((r) => window.setTimeout(r, 2500));
    const cap = new Promise((r) => window.setTimeout(r, 4500));
    Promise.all([minimum, Promise.race([fonts, cap])]).then(() => {
      if (alive) onDone();
    });
    return () => {
      alive = false;
    };
  }, [onDone]);

  return (
    <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <div className="loader-roses">
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            viewBox="0 0 100 100"
            width="84"
            height="84"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -60, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.45, duration: 0.9, ease: "easeOut" }}
          >
            <RoseShape x={50} y={50} size={100} pal={PALETTES[i]} />
          </motion.svg>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
        Preparing something special…
      </motion.p>
      <div className="loader-bar">
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.4, ease: "easeInOut" }} />
      </div>
    </motion.div>
  );
}
