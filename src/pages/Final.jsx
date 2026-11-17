import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useFx } from "../components/Fx.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

const HEART =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.5 6.3 4.5c2.1 0 3.7 1.1 4.7 2.7.3.5 1 .5 1.3 0 1-1.6 2.6-2.7 4.7-2.7 3.7 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z";

// PAGE 8 · The final surprise
export default function Final({ replay }) {
  const F = config.final;
  const fx = useFx();

  useEffect(() => {
    const id = window.setTimeout(() => fx.hearts(window.innerWidth / 2, window.innerHeight * 0.55, 36), 2400);
    return () => window.clearTimeout(id);
  }, [fx]);

  return (
    <div className="page final">
      <div className="inner">
        <motion.svg className="final-heart" viewBox="0 0 24 24" aria-hidden="true">
          <motion.path d={HEART} fill="none" stroke="#f3dca6" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: "easeInOut" }} />
          <motion.path
            d={HEART}
            fill="#e8608a"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1] }}
            transition={{ opacity: { delay: 2, duration: 1 }, scale: { delay: 2.4, duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
          />
        </motion.svg>
        <motion.h1 className="display glow-text f-msg" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1.4 }}>
          {F.message}
        </motion.h1>
        <motion.button
          type="button"
          className="btn btn-ghost"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            audio.sfx.tap();
            replay();
          }}
        >
          <RotateCcw size={16} /> {F.replay}
        </motion.button>
      </div>
    </div>
  );
}
