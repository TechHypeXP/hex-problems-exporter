import * as vscode from 'vscode';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { ExportOptions } from '../../shared/types';
import { IDiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { VSCodeDiagnosticRepository } from './diagnostic.repository';

export class VSCodeDiagnosticAdapter {
    private repository: IDiagnosticRepository;

    constructor(private collection: vscode.DiagnosticCollection) {
        this.repository = new VSCodeDiagnosticRepository(collection);
    }

    async getDiagnostics(): Promise<Diagnostic[]> {
        const rawDiagnostics = await this.repository.getAll();
        return rawDiagnostics.map(d => ({
            ...d,
            id: `${d.source || 'unknown'}-${Date.now()}`
        }));
    }

    async exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        await this.repository.export(diagnostics, options);
    }
}
