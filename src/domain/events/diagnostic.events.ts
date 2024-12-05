import { DiagnosticModel } from '../models';

export interface DiagnosticExportStartedEvent {
  readonly type: 'DiagnosticExportStarted';
  readonly payload: {
    readonly count: number;
    readonly format: 'csv' | 'excel';
    readonly outputPath: string;
  };
}

export interface DiagnosticExportCompletedEvent {
  readonly type: 'DiagnosticExportCompleted';
  readonly payload: {
    readonly count: number;
    readonly format: 'csv' | 'excel';
    readonly outputPath: string;
    readonly duration: number;
  };
}

export interface DiagnosticExportFailedEvent {
  readonly type: 'DiagnosticExportFailed';
  readonly payload: {
    readonly error: Error;
    readonly diagnostics?: DiagnosticModel[];
    readonly format?: 'csv' | 'excel';
    readonly outputPath?: string;
  };
}

export type DiagnosticEvent =
  | DiagnosticExportStartedEvent
  | DiagnosticExportCompletedEvent
  | DiagnosticExportFailedEvent;
