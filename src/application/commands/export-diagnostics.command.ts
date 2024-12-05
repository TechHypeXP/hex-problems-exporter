import { ExportOptions } from '../../shared/types';
import { DiagnosticService } from '../services/diagnostic.service';

export class ExportDiagnosticsCommand {
    constructor(private readonly diagnosticService: DiagnosticService) {}

    async execute(options: ExportOptions): Promise<void> {
        const diagnostics = await this.diagnosticService.getDiagnostics();
        await this.diagnosticService.exportDiagnostics(options);
    }
}
