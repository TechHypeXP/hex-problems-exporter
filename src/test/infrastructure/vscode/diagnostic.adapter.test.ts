import { _DiagnosticSeverity } from 'vscode';
import { VSCodeDiagnosticAdapter } from '../../../infrastructure/vscode/diagnostic.adapter';
import { _createDiagnostic } from '../../fixtures/diagnostic.fixture';
import { TestConfig } from '../../../shared/config/test.config';
import { DiagnosticError } from '../../../shared/errors/diagnostic.error';
import type { ExportOptions } from '../../../shared/types/export.types';

describe('VSCodeDiagnosticAdapter', () => {
    let adapter: VSCodeDiagnosticAdapter;

    beforeEach(() => {
        adapter = new VSCodeDiagnosticAdapter(mockVSCode.diagnostics);
    });

    describe('getAllDiagnostics', () => {
        it('should return all diagnostics', async () => {
            const result = await adapter.getAllDiagnostics();
            expect(result).toHaveLength(1);
        });
    });

    describe('getDiagnosticsForFile', () => {
        it('should return diagnostics for specific file', async () => {
            const filePath = TestConfig.getTestFilePath();
            const result = await adapter.getDiagnosticsForFile(filePath);
            expect(result).toHaveLength(1);
        });
    });

    describe('exportDiagnostics', () => {
        it('should throw error when path is missing', async () => {
            const options: ExportOptions = { format: 'csv' };
            await expect(adapter.exportDiagnostics([], options))
                .rejects
                .toThrow(DiagnosticError);
        });
    });
});
