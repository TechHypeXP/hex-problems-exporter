import { DiagnosticSeverity, Range } from 'vscode';

// Core domain types
export interface CodeLocation {
    file: string;
    line: number;
    column: number;
}

export interface DiagnosticRange {
    start: CodeLocation;
    end: CodeLocation;
}

export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    EXPORT_FAILED = 'EXPORT_FAILED',
    FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
    NO_WORKSPACE = 'NO_WORKSPACE',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface Diagnostic {
    id: string;
    message: string;
    severity: DiagnosticSeverity;
    range: Range;
    source?: string;
    code?: string | number;
}

// Export types
export type ExportFormat = 'csv' | 'excel';

export interface ExportOptions {
    format: ExportFormat;
    outputPath: string;
    includeMetadata?: boolean;
}

// Event types
export interface DiagnosticEvent<T = unknown> {
    type: string;
    timestamp: number;
    payload: T;
}

export interface ExportStartedEvent extends DiagnosticEvent<{
    count: number;
    format: ExportFormat;
    outputPath: string;
}> {
    type: 'DiagnosticExportStarted';
}

export interface ExportCompletedEvent extends DiagnosticEvent<{
    count: number;
    format: ExportFormat;
    outputPath: string;
    duration: number;
}> {
    type: 'DiagnosticExportCompleted';
}

export interface ExportFailedEvent extends DiagnosticEvent<{
    error: Error;
    format: ExportFormat;
    outputPath: string;
}> {
    type: 'DiagnosticExportFailed';
}

// Error types
export interface ErrorMetadata {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
}
