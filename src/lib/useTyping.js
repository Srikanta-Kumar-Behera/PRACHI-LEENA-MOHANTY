import { useEffect, useState } from "react";

// Types out `total` characters one by one. Pauses slightly on punctuation.
// `charAt(i)` returns the character at index i so the hook can pace itself.
export function useTyping({ total, charAt, active, speed = 30 }) {
  const [n, setN] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    if (skipped) {
      setN(total);
      return undefined;
    }
    let i = 0;
    let id = 0;
    const step = () => {
      i += 1;
      setN(i);
      if (i < total) id = window.setTimeout(step, /[.,!?]/.test(charAt(i - 1)) ? 240 : speed);
    };
    id = window.setTimeout(step, 400);
    return () => window.clearTimeout(id);
  }, [active, skipped, total, speed, charAt]);

  return { n, done: n >= total, skip: () => setSkipped(true) };
}
