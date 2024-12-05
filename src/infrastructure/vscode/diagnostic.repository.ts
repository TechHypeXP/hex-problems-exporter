import * as vscode from 'vscode';
import { IDiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { ExportOptions } from '../../shared/types';
import { DiagnosticError } from '../../shared/errors/diagnostic.error';
import { ErrorCode } from '../../shared/types/error.types';

export class VSCodeDiagnosticRepository implements IDiagnosticRepository {
    constructor(private collection: vscode.DiagnosticCollection) {}

    async getAll(): Promise<Diagnostic[]> {
        try {
            const diagnostics: Diagnostic[] = [];
            this.collection.forEach((uri, diags) => {
                diagnostics.push(...diags.map(d => ({
                    ...d,
                    id: `${uri.toString()}-${d.range.start.line}-${d.range.start.character}`,
                    code: typeof d.code === 'object' ? d.code.value : d.code
                })));
            });
            return diagnostics;
        } catch (error) {
            throw new DiagnosticError(
                ErrorCode.EXPORT_ERROR,
                'Failed to get diagnostics',
                { error }
            );
        }
    }

    async export(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        try {
            const { format, outputPath } = options;

            if (!outputPath) {
                throw new DiagnosticError(
                    ErrorCode.VALIDATION_ERROR,
                    'Output path is required',
                    { options }
                );
            }

            // Implementation will be handled by formatters
            switch (format) {
                case 'csv':
                case 'excel':
                    // Will be implemented with formatters
                    break;
                default:
                    throw new DiagnosticError(
                        ErrorCode.EXPORT_ERROR,
                        `Unsupported export format: ${format}`,
                        { format }
                    );
            }
        } catch (error) {
            if (error instanceof DiagnosticError) {
                throw error;
            }
            throw new DiagnosticError(
                ErrorCode.EXPORT_ERROR,
                'Failed to export diagnostics',
                { error }
            );
        }
    }
}
