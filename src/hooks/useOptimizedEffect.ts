import { useEffect, useRef, useCallback } from 'react';
import { throttle, debounce } from '@/utils/performance';

/**
 * Optimized useEffect hook with built-in throttling for performance-critical operations
 */
export const useThrottledEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number = 100
) => {
  const throttledEffect = useRef(throttle(effect, delay));
  
  useEffect(() => {
    return throttledEffect.current();
  }, deps);
};

/**
 * Optimized useEffect hook with built-in debouncing for search/input operations
 */
export const useDebouncedEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number = 300
) => {
  const debouncedEffect = useRef(debounce(effect, delay));
  
  useEffect(() => {
    return debouncedEffect.current();
  }, deps);
};

/**
 * Optimized scroll event handler hook
 */
export const useOptimizedScroll = (
  handler: () => void,
  deps: React.DependencyList = []
) => {
  const optimizedHandler = useCallback(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handler();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, deps);

  useEffect(() => {
    const scrollHandler = optimizedHandler();
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [optimizedHandler]);
};

/**
 * Optimized intersection observer hook for scroll animations
 */
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const observe = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
      ...options
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, options]);

  return { observe, unobserve };
};