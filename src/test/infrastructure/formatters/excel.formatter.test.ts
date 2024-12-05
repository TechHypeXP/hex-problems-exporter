import { ExcelFormatter } from '../../../infrastructure/formatters/excel.formatter';
import { mockDiagnostics } from '../../fixtures/diagnostic.fixture';
import * as ExcelJS from 'exceljs';

describe('ExcelFormatter', () => {
    let formatter: ExcelFormatter;

    beforeEach(() => {
        formatter = new ExcelFormatter();
    });

    it('should format diagnostics to Excel buffer', async () => {
        const buffer = await formatter.format(mockDiagnostics);
        
        expect(buffer).toBeInstanceOf(Buffer);
        
        // Load workbook from buffer to verify contents
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        const worksheet = workbook.getWorksheet('Diagnostics');
        expect(worksheet).toBeDefined();
        
        // Verify headers
        const headerRow = worksheet.getRow(1);
        expect(headerRow.getCell(1).value).toBe('ID');
        expect(headerRow.getCell(2).value).toBe('Severity');
        expect(headerRow.getCell(3).value).toBe('Message');
        
        // Verify data
        mockDiagnostics.forEach((diagnostic, index) => {
            const row = worksheet.getRow(index + 2);
            expect(row.getCell(1).value).toBe(diagnostic.id);
            expect(row.getCell(3).value).toBe(diagnostic.message);
        });
    });

    it('should apply correct styling', async () => {
        const buffer = await formatter.format(mockDiagnostics);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        const worksheet = workbook.getWorksheet('Diagnostics');
        const headerRow = worksheet.getRow(1);
        
        // Verify header styling
        expect(headerRow.font?.bold).toBe(true);
        expect(headerRow.fill?.type).toBe('pattern');
        expect(headerRow.fill?.pattern).toBe('solid');
        
        // Verify auto-filter
        expect(worksheet.autoFilter).toBeDefined();
        
        // Verify frozen panes
        expect(worksheet.views[0].state).toBe('frozen');
        expect(worksheet.views[0].ySplit).toBe(1);
    });

    it('should handle empty diagnostics array', async () => {
        const buffer = await formatter.format([]);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        const worksheet = workbook.getWorksheet('Diagnostics');
        expect(worksheet.rowCount).toBe(1); // Only header row
    });
});
