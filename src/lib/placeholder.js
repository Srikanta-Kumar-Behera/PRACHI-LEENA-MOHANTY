// A soft pink "Add your photo" image generated as an SVG data URL, so the site
// never shows a broken picture while you are still collecting photographs.
const HEART =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.5 6.3 4.5c2.1 0 3.7 1.1 4.7 2.7.3.5 1 .5 1.3 0 1-1.6 2.6-2.7 4.7-2.7 3.7 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z";

export function placeholder(label = "Add your photo", hue = 340) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='hsl(${hue},80%,90%)'/>` +
    `<stop offset='1' stop-color='hsl(${(hue + 50) % 360},60%,80%)'/></linearGradient></defs>` +
    `<rect width='400' height='400' fill='url(#g)'/>` +
    `<path transform='translate(116 86) scale(7)' d='${HEART}' fill='hsl(${hue},70%,62%)' opacity='.85'/>` +
    `<text x='200' y='318' text-anchor='middle' font-family='sans-serif' font-size='20' letter-spacing='3' fill='hsl(${hue},40%,35%)'>${String(label).toUpperCase()}</text>` +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
