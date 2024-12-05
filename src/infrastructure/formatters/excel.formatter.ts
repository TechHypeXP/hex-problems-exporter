import { Diagnostic } from '../../shared/types/diagnostic.types';
import { FormatterPort } from '../../domain/ports/formatter.port';
import { DiagnosticSeverity } from 'vscode';
import { Workbook, Worksheet } from 'exceljs';

export class ExcelFormatter implements FormatterPort {
    private readonly headers = ['File', 'Line', 'Column', 'Severity', 'Message', 'Source', 'Code'];

    async format(diagnostics: Diagnostic[]): Promise<Buffer> {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Diagnostics');

        // Set up headers
        worksheet.columns = this.headers.map(header => ({
            header,
            key: header.toLowerCase(),
            width: 15
        }));

        // Add data rows
        const rows = diagnostics.map(d => ({
            file: d.range.start.file,
            line: d.range.start.line,
            column: d.range.start.column,
            severity: DiagnosticSeverity[d.severity],
            message: d.message,
            source: d.source || '',
            code: d.code || ''
        }));

        worksheet.addRows(rows);

        // Style the worksheet
        this.styleWorksheet(worksheet);

        // Return as buffer
        return workbook.xlsx.writeBuffer() as Promise<Buffer>;
    }

    private styleWorksheet(worksheet: Worksheet): void {
        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Auto-filter
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: this.headers.length }
        };

        // Freeze top row
        worksheet.views = [{
            state: 'frozen',
            xSplit: 0,
            ySplit: 1,
            topLeftCell: 'A2',
            activeCell: 'A2'
        }];

        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });
    }
}
