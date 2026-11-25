// The stain on load: a solid copy of the name wipes in and out once.
import { stain } from './stain';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stains = Array.from(document.querySelectorAll<HTMLElement>('[data-stain-load]'));
if (!reduce && stains.length) {
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => stains.forEach((el) => stain(el, 200)));
}
