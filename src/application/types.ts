import { DiagnosticExportFormat } from '../domain/types';

export interface ProgressReporter {
  report: (message: string) => void;
}

export interface ExportCommand {
  outputPath: string;
  format: DiagnosticExportFormat;
}

export interface ExportResult {
  success: boolean;
  count: number;
  outputPath: string;
  error?: Error;
}

// Application Service Interfaces
export interface DiagnosticExportService {
  exportDiagnostics(command: ExportCommand): Promise<ExportResult>;
}

// Port Interfaces (moving from ports directory for better organization)
export interface UIPort {
  showError(message: string): Promise<void>;
  showInfo(message: string): Promise<void>;
  withProgress<T>(
    title: string,
    operation: (progress: ProgressReporter) => Promise<T>
  ): Promise<T>;
}

export interface FileSystemPort {
  writeFile(path: string, data: string | Buffer): Promise<void>;
  ensureDir(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  getWorkspaceRoot(): Promise<string>;
}

export interface FormatterPort {
  format(data: unknown): Promise<string | Buffer>;
}
