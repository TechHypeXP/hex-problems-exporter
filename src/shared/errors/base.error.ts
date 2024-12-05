import { ErrorCode } from '../types';

export abstract class BaseError extends Error {
    constructor(
        message: string,
        public readonly code: ErrorCode,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        
        // Maintain proper prototype chain
        Object.setPrototypeOf(this, BaseError.prototype);
        
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): Record<string, unknown> {
        return {
            name: this.constructor.name,
            message: this.message,
            code: this.code,
            details: this.details,
            stack: this.stack
        };
    }
}
