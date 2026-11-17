import { useMemo, useState } from "react";
import { placeholder } from "../lib/placeholder.js";

// Shows your photograph, or a soft placeholder when `src` is empty or the file
// is missing. Replace photos by editing src/config.js.
export default function Photo({ src, label = "Add your photo", hue = 340, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => placeholder(label, hue), [label, hue]);
  return (
    <img
      className={className}
      src={!src || failed ? fallback : src}
      alt={alt}
      loading="lazy"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}
