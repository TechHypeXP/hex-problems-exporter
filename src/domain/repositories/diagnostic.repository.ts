import { Diagnostic } from '../../shared/types/diagnostic.types';
import { ExportOptions } from '../../shared/types/export.types';

export interface DiagnosticRepository {
  /**
   * Get all diagnostics for the current workspace
   */
  getAllDiagnostics(): Promise<Diagnostic[]>;

  /**
   * Get diagnostics for a specific file
   * @param filePath Absolute path to the file
   */
  getDiagnosticsForFile(filePath: string): Promise<Diagnostic[]>;

  /**
   * Export diagnostics to a file
   * @param diagnostics List of diagnostics to export
   * @param options Export configuration options
   */
  exportDiagnostics(
    diagnostics: Diagnostic[],
    options: ExportOptions
  ): Promise<void>;
}
