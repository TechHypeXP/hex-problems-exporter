import { BaseError } from './base.error';
import { ErrorCode, ErrorMetadata } from '../types';

export class DiagnosticError extends BaseError {
    constructor(metadata: ErrorMetadata) {
        super(metadata.message, metadata.code, metadata.details);
        
        // Maintain proper prototype chain
        Object.setPrototypeOf(this, DiagnosticError.prototype);
    }

    static create(code: ErrorCode, message: string, details?: Record<string, unknown>): DiagnosticError {
        return new DiagnosticError({
            code,
            message,
            details
        });
    }

    static validation(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create('VALIDATION_ERROR', message, details);
    }

    static export(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create('EXPORT_FAILED', message, details);
    }

    static fileSystem(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create('FILE_WRITE_ERROR', message, details);
    }
}
