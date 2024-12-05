export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    EXPORT_ERROR = 'EXPORT_ERROR',
    FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
    FILE_READ_ERROR = 'FILE_READ_ERROR',
    DIRECTORY_CREATION_ERROR = 'DIRECTORY_CREATION_ERROR',
    NO_WORKSPACE = 'NO_WORKSPACE'
}

export interface ErrorMetadata {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
}
