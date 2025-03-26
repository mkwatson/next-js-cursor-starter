import pino from 'pino';

/**
 * Structured logger using Pino for consistent, explicit logging throughout the application.
 * 
 * @example
 * ```typescript
 * import logger from '@/lib/logger';
 * 
 * // Log informational message
 * logger.info('User logged in successfully');
 * 
 * // Log with context object
 * logger.info({ userId: '123', action: 'login' }, 'User action completed');
 * 
 * // Log error with error object
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   logger.error({ error }, 'Operation failed');
 *   throw new Error('Clear, explicit error message', { cause: error });
 * }
 * ```
 */
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(process.env.NODE_ENV === 'development'
    ? { transport: { target: 'pino-pretty' } }
    : {}),
  base: null,
});

export default logger;