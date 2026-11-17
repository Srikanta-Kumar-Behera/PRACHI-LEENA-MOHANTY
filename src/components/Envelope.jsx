import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// A 3D envelope. `open` swings the flap up; `children` is the card that slides
// out. With `seal`, a wax seal sits on the flap and shatters when `sealBroken`.
export default function Envelope({ open = false, seal = false, sealBroken = false, glow = false, tone = "rose", onClick, label, children }) {
  const interactive = typeof onClick === "function";
  return (
    <div
      className={`env env-${tone} ${glow ? "env-glow" : ""} ${interactive ? "clickable" : ""}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={label}
    >
      <div className="env-back" />
      <motion.div
        className="env-card"
        animate={{ y: open ? -120 : 0 }}
        transition={{ delay: open ? 0.55 : 0, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {children}
      </motion.div>
      <div className="env-front" />
      <motion.div
        className="env-flap"
        animate={{ rotateX: open ? 180 : 0, zIndex: open ? 1 : 4 }}
        transition={{ rotateX: { duration: 0.7, ease: "easeInOut" }, zIndex: { delay: 0.35, duration: 0.01 } }}
      >
        <div className="env-flap-front" />
        <div className="env-flap-back" />
      </motion.div>
      {seal && (
        <motion.div
          className="env-seal"
          animate={sealBroken ? { scale: [1, 1.3, 0], rotate: [0, 15, -40], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Heart size={20} fill="currentColor" />
        </motion.div>
      )}
    </div>
  );
}
