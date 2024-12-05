import { ErrorCode } from '../types/error.types';

export class BaseError extends Error {
    constructor(
        public readonly code: ErrorCode,
        message: string,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'BaseError';
        
        // Maintain proper prototype chain
        Object.setPrototypeOf(this, BaseError.prototype);
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details
        };
    }
}
