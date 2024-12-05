import { Diagnostic as VSCodeDiagnostic, DiagnosticSeverity, Range, DiagnosticRelatedInformation, DiagnosticTag } from 'vscode';

// Core domain types
export interface Diagnostic extends VSCodeDiagnostic {
    id: string;
    message: string;
    severity: DiagnosticSeverity;
    range: Range;
    source?: string;
    code?: string | number;
    relatedInformation?: DiagnosticRelatedInformation[];
    tags?: DiagnosticTag[];
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
    format: ExportOptions['format'];
    outputPath: string;
}> {
    type: 'DiagnosticExportStarted';
}

export interface ExportCompletedEvent extends DiagnosticEvent<{
    count: number;
    format: ExportOptions['format'];
    outputPath: string;
    duration: number;
}> {
    type: 'DiagnosticExportCompleted';
}

export interface ExportFailedEvent extends DiagnosticEvent<{
    error: Error;
    format: ExportOptions['format'];
    outputPath: string;
}> {
    type: 'DiagnosticExportFailed';
}
