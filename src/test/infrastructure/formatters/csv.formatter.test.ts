import { CSVFormatter } from '../../../infrastructure/formatters/csv.formatter';
import { mockDiagnostics } from '../../fixtures/diagnostic.fixture';

describe('CSVFormatter', () => {
    let formatter: CSVFormatter;

    beforeEach(() => {
        formatter = new CSVFormatter();
    });

    it('should format diagnostics to CSV string', async () => {
        const result = await formatter.format(mockDiagnostics);
        
        // Verify header row
        expect(result).toContain('ID,Severity,Message,File,Line,Column,Source,Code');
        
        // Verify data rows
        mockDiagnostics.forEach(diagnostic => {
            expect(result).toContain([
                diagnostic.id,
                diagnostic.severity,
                diagnostic.message,
                diagnostic.location.file,
                diagnostic.location.line + 1,
                diagnostic.location.column + 1
            ].join(','));
        });
    });

    it('should properly escape special characters', async () => {
        const diagnosticWithSpecialChars = {
            ...mockDiagnostics[0],
            message: 'Test, with "quotes" and,commas'
        };

        const result = await formatter.format([diagnosticWithSpecialChars]);
        expect(result).toContain('"Test, with ""quotes"" and,commas"');
    });

    it('should handle empty diagnostics array', async () => {
        const result = await formatter.format([]);
        expect(result).toBe('ID,Severity,Message,File,Line,Column,Source,Code');
    });
});
