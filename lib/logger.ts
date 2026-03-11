/**
 * Conditional logger for the WTI platform.
 *
 * - Development: all levels log normally
 * - Production: only errors are logged; log/warn/debug are suppressed
 *
 * Usage: import { logger } from '@/lib/logger';
 *        logger.log('[TAG] message');
 */

const isDev = process.env.NODE_ENV !== 'production';

/* eslint-disable no-console */
export const logger = {
  /** Debug-level log, suppressed in production */
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  /** Warning-level log, suppressed in production */
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
  /** Error-level log, always visible */
  error: (...args: unknown[]) => console.error(...args),
  /** Alias for log, suppressed in production */
  debug: (...args: unknown[]) => { if (isDev) console.log(...args); },
};
/* eslint-enable no-console */
