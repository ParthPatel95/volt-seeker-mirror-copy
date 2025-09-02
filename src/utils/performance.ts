/**
 * Performance utilities for optimizing React components
 */

// Throttle function for scroll events
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function for search inputs
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Optimize scroll event handlers
export const optimizeScrollHandler = (handler: () => void) => {
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
};

// Generate stable keys for lists
export const generateStableKey = (item: any, index: number, prefix: string = 'item') => {
  if (item.id) return `${prefix}-${item.id}`;
  if (item.key) return `${prefix}-${item.key}`;
  if (item.title) return `${prefix}-${item.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
  return `${prefix}-${index}`;
};

// Accessibility helpers
export const createAriaLabel = (text: string) => {
  return text.replace(/[^\w\s]/gi, '').trim();
};

// Environment flag for development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// Production-safe logging
export const devLog = (message: string, ...args: any[]) => {
  if (isDevelopment) {
    console.log(message, ...args);
  }
};

export const devWarn = (message: string, ...args: any[]) => {
  if (isDevelopment) {
    console.warn(message, ...args);
  }
};

export const devError = (message: string, ...args: any[]) => {
  if (isDevelopment) {
    console.error(message, ...args);
  }
};