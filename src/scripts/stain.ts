// The stain: a solid copy of the text wipes in and out once.
export function stain(el: Element, delay = 0) {
  if (!('animate' in el)) return;
  (el as HTMLElement).animate(
    [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', offset: 0.5 }, { clipPath: 'inset(0 0 0 100%)' }],
    { duration: 1500, easing: 'cubic-bezier(.65,0,.35,1)', delay },
  );
}
