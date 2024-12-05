import * as vscode from 'vscode';
import { DiagnosticRepository } from '../../domain/repositories';
import { DiagnosticModel, Diagnostic } from '../../domain/models';
import { DiagnosticError } from '../../shared/errors';

export class VSCodeDiagnosticRepository implements DiagnosticRepository {
  private readonly diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('hex-problems');
  }

  async getAllDiagnostics(): Promise<DiagnosticModel[]> {
    const diagnostics: DiagnosticModel[] = [];
    
    this.diagnosticCollection.forEach((uri, vscodeDiagnostics) => {
      vscodeDiagnostics.forEach(diagnostic => {
        diagnostics.push(new Diagnostic(
          diagnostic.message,
          diagnostic.severity,
          {
            start: {
              line: diagnostic.range.start.line,
              character: diagnostic.range.start.character
            },
            end: {
              line: diagnostic.range.end.line,
              character: diagnostic.range.end.character
            }
          },
          diagnostic.source,
          diagnostic.code?.toString()
        ));
      });
    });

    return diagnostics;
  }

  async getDiagnosticsForFile(filePath: string): Promise<DiagnosticModel[]> {
    const uri = vscode.Uri.file(filePath);
    const diagnostics = this.diagnosticCollection.get(uri) || [];
    
    return diagnostics.map(diagnostic => new Diagnostic(
      diagnostic.message,
      diagnostic.severity,
      {
        start: {
          line: diagnostic.range.start.line,
          character: diagnostic.range.start.character
        },
        end: {
          line: diagnostic.range.end.line,
          character: diagnostic.range.end.character
        }
      },
      diagnostic.source,
      diagnostic.code?.toString()
    ));
  }

  async exportDiagnostics(
    diagnostics: DiagnosticModel[],
    outputPath: string,
    format: 'csv' | 'excel'
  ): Promise<void> {
    throw new DiagnosticError(
      'EXPORT_FAILED',
      'Export functionality not implemented in repository',
      { format }
    );
  }
}
