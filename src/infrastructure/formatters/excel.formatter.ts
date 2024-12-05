import * as ExcelJS from 'exceljs';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { DiagnosticSeverity } from 'vscode';

export class ExcelFormatter {
    async format(diagnostics: Diagnostic[], outputPath: string): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Problems');

        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 15 },
            { header: 'Message', key: 'message', width: 50 },
            { header: 'Severity', key: 'severity', width: 15 },
            { header: 'Line', key: 'line', width: 10 },
            { header: 'Character', key: 'character', width: 10 },
            { header: 'Source', key: 'source', width: 20 },
            { header: 'Code', key: 'code', width: 15 }
        ];

        // Add data
        diagnostics.forEach(diagnostic => {
            worksheet.addRow({
                id: diagnostic.id,
                message: diagnostic.message,
                severity: this.getSeverityText(diagnostic.severity),
                line: diagnostic.range.start.line + 1,
                character: diagnostic.range.start.character + 1,
                source: diagnostic.source,
                code: diagnostic.code?.toString() || ''
            });
        });

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4B9CD3' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Freeze header row
        worksheet.views = [{
            state: 'frozen',
            xSplit: 0,
            ySplit: 1,
            topLeftCell: 'A2',
            activeCell: 'A2'
        }];

        // Auto-filter
        worksheet.autoFilter = {
            from: 'A1',
            to: `G${diagnostics.length + 1}`
        };

        // Save workbook
        await workbook.xlsx.writeFile(outputPath);
    }

    private getSeverityText(severity: DiagnosticSeverity): string {
        switch (severity) {
            case DiagnosticSeverity.Error:
                return 'Error';
            case DiagnosticSeverity.Warning:
                return 'Warning';
            case DiagnosticSeverity.Information:
                return 'Information';
            case DiagnosticSeverity.Hint:
                return 'Hint';
            default:
                return 'Unknown';
        }
    }
}
