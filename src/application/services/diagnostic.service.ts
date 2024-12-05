import { Diagnostic } from '../../shared/types/diagnostic.types';
import { ExportOptions } from '../../shared/types';
import { IDiagnosticRepository } from '../../domain/repositories/diagnostic.repository';

export class DiagnosticService {
    constructor(private repository: IDiagnosticRepository) {}

    async exportDiagnostics(options: ExportOptions): Promise<void> {
        const diagnostics = await this.getDiagnostics();
        await this.repository.export(diagnostics, options);
    }

    async getDiagnostics(): Promise<Diagnostic[]> {
        return this.repository.getAll();
    }
}
