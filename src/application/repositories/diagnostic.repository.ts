import { Diagnostic } from 'vscode';
import { ExportOptions } from '../../shared/types/diagnostic.types';

export interface IDiagnosticRepository {
    getAll(): Promise<Diagnostic[]>;
    export(diagnostics: Diagnostic[], options: ExportOptions): Promise<void>;
}
