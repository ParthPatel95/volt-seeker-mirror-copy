// Centralized logging utility for production and development
const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (isDevelopment || error) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }
};

// Performance monitoring utility
export const performance = {
  mark: (name: string) => {
    if (isDevelopment && 'performance' in window) {
      window.performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (isDevelopment && 'performance' in window) {
      try {
        const measurement = window.performance.measure(name, startMark, endMark);
        logger.debug(`Performance: ${name}`, `${measurement.duration.toFixed(2)}ms`);
        return measurement;
      } catch (error) {
        logger.error('Performance measurement failed', error);
      }
    }
  }
};