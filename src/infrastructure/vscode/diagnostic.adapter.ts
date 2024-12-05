import * as vscode from 'vscode';
import { Diagnostic, DiagnosticRange } from '../../shared/types/diagnostic.types';
import { DiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { ExportOptions } from '../../shared/types/export.types';
import { DiagnosticError } from '../../domain/errors/diagnostic.error';
import { CSVFormatter, ExcelFormatter } from '../formatters';
import { FileSystemPort } from '../../application/types';
import { ErrorCode } from '../../shared/types/diagnostic.types';

export class VSCodeDiagnosticAdapter implements DiagnosticRepository {
    private readonly csvFormatter: CSVFormatter;
    private readonly excelFormatter: ExcelFormatter;

    constructor(
        private readonly fs: FileSystemPort,
        private readonly diagnosticCollection: vscode.DiagnosticCollection
    ) {
        this.csvFormatter = new CSVFormatter();
        this.excelFormatter = new ExcelFormatter();
    }

    async getAllDiagnostics(): Promise<Diagnostic[]> {
        const diagnostics: Diagnostic[] = [];
        
        this.diagnosticCollection.forEach((uri, vscodeDiagnostics) => {
            diagnostics.push(...this.convertVSCodeDiagnostics(uri.fsPath, vscodeDiagnostics));
        });

        return diagnostics;
    }

    async getDiagnosticsForFile(filePath: string): Promise<Diagnostic[]> {
        const uri = vscode.Uri.file(filePath);
        const diagnostics = this.diagnosticCollection.get(uri);
        
        if (!diagnostics) {
            return [];
        }

        return this.convertVSCodeDiagnostics(filePath, diagnostics);
    }

    async exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        try {
            const { format, outputPath } = options;
            if (!outputPath) {
                throw new DiagnosticError({
                    code: ErrorCode.EXPORT_ERROR,
                    message: 'Export path is required'
                });
            }

            let content: string | Buffer;
            switch (format) {
                case 'csv':
                    content = await this.csvFormatter.format(diagnostics);
                    break;
                case 'excel':
                    content = await this.excelFormatter.format(diagnostics);
                    break;
                default:
                    throw new DiagnosticError({
                        code: ErrorCode.EXPORT_ERROR,
                        message: `Unsupported export format: ${format}`
                    });
            }

            await this.fs.writeFile(outputPath, content);
        } catch (error) {
            throw new DiagnosticError({
                code: ErrorCode.EXPORT_ERROR,
                message: 'Failed to export diagnostics',
                details: {
                    error,
                    format: options.format,
                    count: diagnostics.length
                }
            });
        }
    }

    private convertVSCodeDiagnostics(filePath: string, diagnostics: readonly vscode.Diagnostic[]): Diagnostic[] {
        return diagnostics.map(d => ({
            id: `${filePath}:${d.range.start.line}:${d.range.start.character}`,
            message: d.message,
            severity: d.severity ?? vscode.DiagnosticSeverity.Error,
            range: {
                start: {
                    file: filePath,
                    line: d.range.start.line,
                    column: d.range.start.character
                },
                end: {
                    file: filePath,
                    line: d.range.end.line,
                    column: d.range.end.character
                }
            },
            source: d.source,
            code: d.code?.toString()
        }));
    }

    dispose(): void {
        this.diagnosticCollection.dispose();
    }
}
