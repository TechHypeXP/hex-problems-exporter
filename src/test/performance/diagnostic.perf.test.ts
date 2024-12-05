import { DiagnosticSeverity } from 'vscode';
import { VSCodeDiagnosticAdapter } from '../../infrastructure/vscode/diagnostic.adapter';
import { CSVFormatter } from '../../infrastructure/formatters/csv.formatter';
import { ExcelFormatter } from '../../infrastructure/formatters/excel.formatter';
import { createDiagnostic } from '../fixtures/diagnostic.fixture';
import { MockFileSystem, MockUI } from '../fixtures/mock.adapter';
import { DiagnosticService } from '../../application/services/diagnostic.service';
import { MockDiagnosticRepository } from '../fixtures/mock.adapter';
import { measureExecutionTime, type PerformanceMetrics } from '../utils/performance.utils';
import { Diagnostic } from '../../shared/types/diagnostic.types';

describe('Diagnostic Performance Tests', () => {
    let adapter: VSCodeDiagnosticAdapter;
    let csvFormatter: CSVFormatter;
    let excelFormatter: ExcelFormatter;
    let mockFs: MockFileSystem;
    let mockUI: MockUI;
    let service: DiagnosticService;
    let repository: MockDiagnosticRepository;

    beforeEach(() => {
        mockFs = new MockFileSystem();
        mockUI = new MockUI();
        adapter = new VSCodeDiagnosticAdapter(mockFs, mockUI);
        csvFormatter = new CSVFormatter();
        excelFormatter = new ExcelFormatter();
        repository = new MockDiagnosticRepository();
        service = new DiagnosticService(repository);
    });

    const generateLargeDiagnosticSet = (count: number): Diagnostic[] => {
        return Array.from({ length: count }, (_, index) => 
            createDiagnostic({
                id: `PERF-${index}`,
                message: `Performance test diagnostic ${index}`,
                severity: index % 4 as DiagnosticSeverity,
                location: {
                    file: `/src/test${Math.floor(index / 100)}.ts`,
                    line: index % 1000,
                    column: index % 80
                }
            })
        );
    };

    describe('Large Dataset Processing', () => {
        const SMALL_SET = 100;
        const MEDIUM_SET = 1000;
        const LARGE_SET = 10000;

        it('should process small diagnostic sets (<100) in under 50ms', async () => {
            const diagnostics = generateLargeDiagnosticSet(SMALL_SET);
            const time = await measureExecutionTime(async () => {
                await adapter.getAllDiagnostics();
                await adapter.exportDiagnostics(diagnostics, {
                    format: 'csv',
                    path: '/test/perf-small.csv'
                });
            });
            
            expect(time).toBeLessThan(50);
        });

        it('should process medium diagnostic sets (<1000) in under 200ms', async () => {
            const diagnostics = generateLargeDiagnosticSet(MEDIUM_SET);
            const time = await measureExecutionTime(async () => {
                await adapter.getAllDiagnostics();
                await adapter.exportDiagnostics(diagnostics, {
                    format: 'csv',
                    path: '/test/perf-medium.csv'
                });
            });
            
            expect(time).toBeLessThan(200);
        });

        it('should process large diagnostic sets (<10000) in under 1000ms', async () => {
            const diagnostics = generateLargeDiagnosticSet(LARGE_SET);
            const time = await measureExecutionTime(async () => {
                await adapter.getAllDiagnostics();
                await adapter.exportDiagnostics(diagnostics, {
                    format: 'csv',
                    path: '/test/perf-large.csv'
                });
            });
            
            expect(time).toBeLessThan(1000);
        });
    });

    describe('Format Performance', () => {
        it('should format 1000 diagnostics to CSV in under 100ms', async () => {
            const diagnostics = generateLargeDiagnosticSet(1000);
            const time = await measureExecutionTime(async () => {
                await csvFormatter.format(diagnostics);
            });
            
            expect(time).toBeLessThan(100);
        });

        it('should format 1000 diagnostics to Excel in under 500ms', async () => {
            const diagnostics = generateLargeDiagnosticSet(1000);
            const time = await measureExecutionTime(async () => {
                await excelFormatter.format(diagnostics);
            });
            
            expect(time).toBeLessThan(500);
        });
    });

    describe('Memory Usage', () => {
        it('should maintain reasonable memory usage with large datasets', async () => {
            const initialMemory = process.memoryUsage().heapUsed;
            const diagnostics = generateLargeDiagnosticSet(LARGE_SET);
            
            await adapter.exportDiagnostics(diagnostics, {
                format: 'csv',
                path: '/test/memory-test.csv'
            });

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncreaseMB = (finalMemory - initialMemory) / 1024 / 1024;
            
            // Should not increase heap usage by more than 100MB for 10k diagnostics
            expect(memoryIncreaseMB).toBeLessThan(100);
        });
    });

    describe('Concurrent Operations', () => {
        it('should handle multiple concurrent export operations', async () => {
            const diagnostics = generateLargeDiagnosticSet(MEDIUM_SET);
            const operations = Array.from({ length: 5 }, (_, i) => 
                adapter.exportDiagnostics(diagnostics, {
                    format: 'csv',
                    path: `/test/concurrent-${i}.csv`
                })
            );

            const time = await measureExecutionTime(async () => {
                await Promise.all(operations);
            });

            // 5 concurrent operations should complete in under 1 second
            expect(time).toBeLessThan(1000);
        });
    });

    describe('Diagnostic Service Performance', () => {
        it('should handle large number of diagnostics efficiently', async () => {
            const metrics = await measureExecutionTime(async () => {
                const diagnostics = generateLargeDiagnosticSet(1000);
                repository.setDiagnostics(diagnostics);
                await service.getAllDiagnostics();
            });

            expect(metrics.executionTimeMs).toBeLessThan(1000);
            expect(metrics.heapUsedMB).toBeLessThan(100);
        });
    });
});
