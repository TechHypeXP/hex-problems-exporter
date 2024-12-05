import { Diagnostic } from '../models/diagnostic.model';
import { ExportOptions } from '../../shared/types/export.types';

export interface IDiagnosticRepository {
  /**
   * Get all diagnostics for the current workspace
   */
  getAll(): Promise<Diagnostic[]>;

  /**
   * Export diagnostics to a file
   * @param diagnostics List of diagnostics to export
   * @param options Export configuration options
   */
  export(diagnostics: Diagnostic[], options: ExportOptions): Promise<void>;
}
