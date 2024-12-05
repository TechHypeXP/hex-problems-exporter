import { DiagnosticService } from '../services';
import { appConfig } from '../../shared/config';

export interface ExportDiagnosticsCommand {
  outputPath: string;
  format?: 'csv' | 'excel';
}

export class ExportDiagnosticsHandler {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  async execute(command: ExportDiagnosticsCommand): Promise<void> {
    const format = command.format ?? appConfig.diagnostics.defaultFormat;
    await this.diagnosticService.exportDiagnostics(command.outputPath, format);
  }
}
