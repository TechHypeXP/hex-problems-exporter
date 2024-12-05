import { BaseError } from './base.error';
import { ErrorCode } from '../types/error.types';

export class DiagnosticError extends BaseError {
    constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
        super(code, message, details);
        this.name = 'DiagnosticError';
    }

    static create(code: ErrorCode, message: string, details?: Record<string, unknown>): DiagnosticError {
        return new DiagnosticError(code, message, details);
    }

    static validation(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create(ErrorCode.VALIDATION_ERROR, message, details);
    }

    static export(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create(ErrorCode.EXPORT_ERROR, message, details);
    }

    static fileSystem(message: string, details?: Record<string, unknown>): DiagnosticError {
        return this.create(ErrorCode.FILE_WRITE_ERROR, message, details);
    }
}
