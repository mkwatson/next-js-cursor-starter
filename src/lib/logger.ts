/**
 * Simple logger that works in both client and server environments
 * to avoid worker-thread issues in Next.js API routes.
 */
const logger = {
  info: (context: Record<string, unknown> | string, message?: string): void => {
    // In server environment
    if (typeof window === 'undefined') {
      const logMessage = typeof context === 'string' 
        ? context 
        : (message || JSON.stringify(context));
      
      const logContext = typeof context === 'string' ? {} : context;
      console.log(JSON.stringify({
        level: 'info',
        time: Date.now(),
        ...logContext,
        msg: logMessage
      }));
    } else {
      // In client environment
      if (typeof context === 'string') {
        console.info(context);
      } else {
        console.info(message || 'Info log', context);
      }
    }
  },
  
  error: (context: Record<string, unknown> | string | Error, message?: string): void => {
    // In server environment
    if (typeof window === 'undefined') {
      let logContext: Record<string, unknown>;
      let logMessage: string;
      
      if (context instanceof Error) {
        logContext = { 
          error: {
            name: context.name,
            message: context.message,
            stack: context.stack
          }
        };
        logMessage = message || context.message;
      } else if (typeof context === 'string') {
        logContext = {};
        logMessage = context;
      } else {
        logContext = context;
        logMessage = message || 'Error occurred';
      }
      
      console.error(JSON.stringify({
        level: 'error',
        time: Date.now(),
        ...logContext,
        msg: logMessage
      }));
    } else {
      // In client environment
      if (context instanceof Error) {
        console.error(message || context.message, context);
      } else if (typeof context === 'string') {
        console.error(context);
      } else {
        console.error(message || 'Error log', context);
      }
    }
  },
  
  debug: (context: Record<string, unknown> | string, message?: string): void => {
    if (process.env.NODE_ENV !== 'production') {
      // In server environment
      if (typeof window === 'undefined') {
        const logMessage = typeof context === 'string' 
          ? context 
          : (message || JSON.stringify(context));
        
        const logContext = typeof context === 'string' ? {} : context;
        console.debug(JSON.stringify({
          level: 'debug',
          time: Date.now(),
          ...logContext,
          msg: logMessage
        }));
      } else {
        // In client environment
        if (typeof context === 'string') {
          console.debug(context);
        } else {
          console.debug(message || 'Debug log', context);
        }
      }
    }
  }
};

export default logger;