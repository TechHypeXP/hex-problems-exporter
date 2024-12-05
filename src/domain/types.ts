import { DiagnosticSeverity } from 'vscode';

export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}

export interface DiagnosticData {
  message: string;
  severity: DiagnosticSeverity;
  range: Range;
  source?: string;
  code?: string;
}

export type DiagnosticExportFormat = 'csv' | 'excel';

export interface ExportOptions {
  format: DiagnosticExportFormat;
  outputPath: string;
}

// Domain Events
export interface DiagnosticEvent {
  type: string;
  payload: unknown;
}

export interface DiagnosticExportStartedEvent extends DiagnosticEvent {
  type: 'DiagnosticExportStarted';
  payload: {
    count: number;
    format: DiagnosticExportFormat;
    outputPath: string;
  };
}

export interface DiagnosticExportCompletedEvent extends DiagnosticEvent {
  type: 'DiagnosticExportCompleted';
  payload: {
    count: number;
    format: DiagnosticExportFormat;
    outputPath: string;
    duration: number;
  };
}

export interface DiagnosticExportFailedEvent extends DiagnosticEvent {
  type: 'DiagnosticExportFailed';
  payload: {
    error: Error;
    format: DiagnosticExportFormat;
    outputPath: string;
  };
}
