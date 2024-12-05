import { ErrorCode, ErrorMetadata } from '../../shared/types';

export class DiagnosticError extends Error {
    public readonly code: ErrorCode;
    public readonly details?: Record<string, unknown>;

    constructor(metadata: ErrorMetadata) {
        super(metadata.message);
        this.name = 'DiagnosticError';
        this.code = metadata.code;
        this.details = metadata.details;
        
        // Maintain proper stack trace
        Error.captureStackTrace(this, DiagnosticError);
    }
}
