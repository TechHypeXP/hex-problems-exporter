import { DiagnosticExportService, ExportCommand, ExportResult } from './types';
import { DiagnosticService } from './services/diagnostic.service';
import { UIPort, FileSystemPort } from './types';
import { DiagnosticRepository } from '../domain/repositories';
import { EventBus } from '../domain/events';

/**
 * Application API facade that coordinates all use cases
 */
export class DiagnosticAPI implements DiagnosticExportService {
  private diagnosticService: DiagnosticService;

  constructor(
    repository: DiagnosticRepository,
    eventBus: EventBus,
    ui: UIPort,
    fs: FileSystemPort
  ) {
    this.diagnosticService = new DiagnosticService(repository, eventBus, ui, fs);
  }

  /**
   * Export diagnostics use case
   */
  async exportDiagnostics(command: ExportCommand): Promise<ExportResult> {
    try {
      await this.diagnosticService.exportDiagnostics(command.outputPath, command.format);
      return {
        success: true,
        count: 0, // TODO: Get actual count from service
        outputPath: command.outputPath
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        outputPath: command.outputPath,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
}
