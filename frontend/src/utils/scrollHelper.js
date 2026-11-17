/**
 * Safely scrolls window to top with smooth animation, honoring prefers-reduced-motion.
 *
 * @param {boolean} smooth - Whether to animate scrolling smoothly (default: true)
 */
export const scrollToTop = (smooth = true) => {
  if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') {
    return;
  }

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto',
  });
};
