import { DiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { Diagnostic, ExportOptions } from '../../shared/types/diagnostic.types';
import { UIPort } from '../ports/ui.port';

export class DiagnosticService {
    constructor(
        private readonly repository: DiagnosticRepository,
        private readonly ui: UIPort
    ) {}

    async exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        await this.ui.withProgress('Exporting diagnostics...', async (progress) => {
            progress('Preparing export...');
            await this.repository.exportDiagnostics(diagnostics, options);
            progress('Export complete');
        });
        await this.ui.showInfo(`Successfully exported ${diagnostics.length} diagnostics to ${options.outputPath}`);
    }

    async getAllDiagnostics(): Promise<Diagnostic[]> {
        try {
            return await this.repository.getAllDiagnostics();
        } catch (error) {
            await this.ui.showError('Failed to retrieve diagnostics');
            throw error;
        }
    }

    async getDiagnosticsForFile(filePath: string): Promise<Diagnostic[]> {
        return this.repository.getDiagnosticsForFile(filePath);
    }
}
