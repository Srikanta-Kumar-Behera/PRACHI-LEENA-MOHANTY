// Splits text into user-perceived characters, so an emoji such as "❤️" stays
// in one piece when letters are animated one at a time.
export function graphemes(str) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(str), (s) => s.segment);
  }
  return Array.from(str);
}
