import { Diagnostic, ExportOptions } from '../../shared/types/diagnostic.types';
import { CSVFormatter } from '../formatters/csv.formatter';
import { ExcelFormatter } from '../formatters/excel.formatter';
import { DiagnosticError } from '../../shared/errors/diagnostic.error';
import { ErrorCode } from '../../shared/types/error.types';
import { IDiagnosticRepository } from '../../application/repositories/diagnostic.repository';
import * as vscode from 'vscode';

export class DiagnosticPersistence implements IDiagnosticRepository {
    private readonly csvFormatter: CSVFormatter;
    private readonly excelFormatter: ExcelFormatter;

    constructor() {
        this.csvFormatter = new CSVFormatter();
        this.excelFormatter = new ExcelFormatter();
    }

    async getAll(): Promise<Diagnostic[]> {
        const allDiagnostics: Diagnostic[] = [];
        let id = 1;

        try {
            console.log('Finding files in workspace...');
            const docs = await vscode.workspace.findFiles('*.*');
            console.log(`Found ${docs.length} files`);
            
            for (const doc of docs) {
                try {
                    const diagnostics = await this.getDiagnosticsForFile(doc);
                    diagnostics.forEach(diagnostic => {
                        allDiagnostics.push(diagnostic);
                    });
                } catch (error) {
                    console.warn(`Skipping file ${doc.toString()} due to error:`, error);
                    // Continue with other files even if one fails
                }
            }

            console.log(`Total diagnostics found: ${allDiagnostics.length}`);
            return allDiagnostics;
        } catch (error) {
            console.error('Failed to get all diagnostics:', error);
            throw new DiagnosticError(
                ErrorCode.EXPORT_ERROR,
                'Failed to get diagnostics',
                { error }
            );
        }
    }

    async getDiagnosticsForFile(uri: vscode.Uri): Promise<Diagnostic[]> {
        try {
            // Ensure the document is loaded
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
            await new Promise(resolve => setTimeout(resolve, 100)); // Give VS Code time to compute diagnostics
            
            const diagnostics = vscode.languages.getDiagnostics(doc.uri);
            console.log(`Found ${diagnostics.length} diagnostics for ${uri.toString()}`);
            
            return diagnostics.map((d, index) => ({
                ...d,
                id: `${uri.toString()}-${index}`,
                code: typeof d.code === 'object' ? d.code.value : d.code
            }));
        } catch (error) {
            console.error(`Error getting diagnostics for ${uri.toString()}:`, error);
            throw new DiagnosticError(
                ErrorCode.FILE_READ_ERROR,
                `Failed to get diagnostics for file: ${uri.toString()}`,
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

            switch (format) {
                case 'csv':
                    await this.csvFormatter.format(diagnostics, outputPath);
                    break;
                case 'excel':
                    await this.excelFormatter.format(diagnostics, outputPath);
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
