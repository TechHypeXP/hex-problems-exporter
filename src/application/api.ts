import { Diagnostic, ExportOptions } from '../shared/types/diagnostic.types';
import { EventBus } from '../infrastructure/vscode/event-bus.adapter';

/**
 * Application API facade that coordinates all use cases
 */
export class DiagnosticAPI {
  private diagnosticService: IDiagnosticService;
  private eventBus: EventBus;

  constructor(
    diagnosticService: IDiagnosticService,
    eventBus: EventBus
  ) {
    this.diagnosticService = diagnosticService;
    this.eventBus = eventBus;
  }

  /**
   * Export diagnostics use case
   */
  async exportDiagnostics(outputPath: string, format: 'csv' | 'excel'): Promise<void> {
    const diagnostics = await this.diagnosticService.getDiagnostics();
    
    await this.eventBus.publish({
      type: 'DiagnosticExportStarted',
      timestamp: Date.now(),
      payload: {
        count: diagnostics.length,
        format,
        outputPath
      }
    });

    try {
      await this.diagnosticService.exportDiagnostics(diagnostics, { format, outputPath });
      
      await this.eventBus.publish({
        type: 'DiagnosticExportCompleted',
        timestamp: Date.now(),
        payload: {
          count: diagnostics.length,
          format,
          outputPath,
          duration: 0 // TODO: Add duration tracking
        }
      });
    } catch (error) {
      await this.eventBus.publish({
        type: 'DiagnosticExportFailed',
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error : new Error(String(error)),
          format,
          outputPath
        }
      });
      throw error;
    }
  }
}

export interface IDiagnosticService {
  getDiagnostics(): Promise<Diagnostic[]>;
  exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void>;
}
