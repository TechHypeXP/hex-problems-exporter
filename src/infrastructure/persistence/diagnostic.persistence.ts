import { Diagnostic } from '../../shared/types/diagnostic.types';
import { DiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { ExportOptions } from '../../shared/types/export.types';
import { CSVFormatter } from '../formatters/csv.formatter';
import { ExcelFormatter } from '../formatters/excel.formatter';
import { FileSystemPort } from '../../application/types';

export class DiagnosticPersistence implements DiagnosticRepository {
    private readonly csvFormatter: CSVFormatter;
    private readonly excelFormatter: ExcelFormatter;

    constructor(private readonly fs: FileSystemPort) {
        this.csvFormatter = new CSVFormatter();
        this.excelFormatter = new ExcelFormatter();
    }

    async getAllDiagnostics(): Promise<Diagnostic[]> {
        return [];
    }

    async getDiagnosticsForFile(filePath: string): Promise<Diagnostic[]> {
        return [];
    }

    async exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        const { format, outputPath } = options;
        let content: string | Buffer;

        switch (format) {
            case 'csv':
                content = await this.csvFormatter.format(diagnostics);
                break;
            case 'excel':
                content = await this.excelFormatter.format(diagnostics);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        await this.fs.writeFile(outputPath, content);
    }
}
