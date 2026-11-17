import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToTop } from './scrollHelper';

describe('scrollToTop helper', () => {
  const originalScrollTo = window.scrollTo;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('scrolls to top smoothly by default when reduced motion is not preferred', () => {
    scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('scrolls with auto behavior when prefers-reduced-motion is active', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    scrollToTop(true);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  });

  it('scrolls with auto behavior when smooth is false', () => {
    scrollToTop(false);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  });
});
