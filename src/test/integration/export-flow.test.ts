import { Diagnostic, ExportOptions } from '../../shared/types/diagnostic.types';
import { IFormatter } from '../../domain/ports/formatter.interface';
import { TestConfig } from '../../shared/config/test.config';
import { VSCodeDiagnosticRepository } from '../../infrastructure/vscode/diagnostic.repository';
import { VSCodeFileSystemAdapter } from '../../infrastructure/vscode/filesystem.adapter';
import { VSCodeUIAdapter } from '../../infrastructure/vscode/ui.adapter';
import { InMemoryEventBus } from '../../infrastructure/events/in-memory.event-bus';
import { DiagnosticService } from '../../application/services/diagnostic.service';
import { DiagnosticPersistence } from '../../infrastructure/persistence/diagnostic.persistence';
import { CSVFormatter, ExcelFormatter } from '../../infrastructure/formatters';
import path from 'path';

interface TestContext {
    formatter: IFormatter;
    options: ExportOptions;
}

describe('Export Flow Integration', () => {
    let service: DiagnosticService;
    let outputPath: string;
    let _mockDiagnostics: Diagnostic[];
    
    beforeEach(async (): Promise<void> => {
        const baseRepository = new VSCodeDiagnosticRepository();
        const fs = new VSCodeFileSystemAdapter();
        const ui = new VSCodeUIAdapter({} as any);
        const eventBus = new InMemoryEventBus();
        const csvFormatter = new CSVFormatter();
        const excelFormatter = new ExcelFormatter();
        
        const repository = new DiagnosticPersistence(
            baseRepository,
            fs,
            csvFormatter,
            excelFormatter
        );

        service = new DiagnosticService(repository, eventBus, ui, fs);
        outputPath = path.join(__dirname, '../fixtures/output');

        const testContext: TestContext = await setupTestContext();
        expect(testContext.formatter).toBeDefined();
        expect(testContext.options).toBeDefined();
    });

    async function setupTestContext(): Promise<TestContext> {
        return {
            formatter: {
                format: async () => Buffer.from('test')
            },
            options: TestConfig.getDefaultExportOptions()
        };
    }

    it('should export diagnostics to CSV', async () => {
        const csvPath = path.join(outputPath, 'diagnostics.csv');
        await service.exportDiagnostics(csvPath, 'csv');
        const fs = service.getFileSystem();
        expect(await fs.exists(csvPath)).toBe(true);
    });

    it('should export diagnostics to Excel', async () => {
        const excelPath = path.join(outputPath, 'diagnostics.xlsx');
        await service.exportDiagnostics(excelPath, 'excel');
        const fs = service.getFileSystem();
        expect(await fs.exists(excelPath)).toBe(true);
    });
});
