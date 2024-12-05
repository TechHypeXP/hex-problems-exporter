import * as vscode from 'vscode';
import { OutputFormat, ProblemRecord, GroupedProblems } from '../types';
import { formatMarkdown } from '../formatters/markdownFormatter';
import { formatJson } from '../formatters/jsonFormatter';
import { formatCsv } from '../formatters/csvFormatter';
import { formatXlsx } from '../formatters/xlsxFormatter';

interface ExtendedDiagnostic extends vscode.Diagnostic {
    uri: vscode.Uri;
}

export class ProblemExporter {
    private formatters = {
        'markdown': formatMarkdown,
        'json': formatJson,
        'csv': formatCsv,
        'xlsx': formatXlsx
    };

    constructor(private format: OutputFormat) {}

    async exportProblems(
        customOutputPath: string,
        progress: vscode.Progress<{ increment?: number; message?: string }>,
        token: vscode.CancellationToken
    ): Promise<void> {
        progress.report({ increment: 25, message: 'Collecting problems...' });

        const problems = await this.collectProblems();
        if (token.isCancellationRequested) {
            return;
        }

        progress.report({ increment: 50, message: 'Formatting output...' });
        const groupedProblems = {
            byType: this.groupBy(problems, 'type'),
            bySource: this.groupBy(problems, 'source'),
            byCode: this.groupBy(problems, 'code')
        };

        const output = await this.formatters[this.format].format(problems, groupedProblems);

        if (token.isCancellationRequested) {
            return;
        }

        progress.report({ increment: 75, message: 'Saving report...' });
        await this.saveReport(output, customOutputPath);

        vscode.window.showInformationMessage('Problems report generated successfully');
    }

    private async collectProblems(): Promise<ProblemRecord[]> {
        const diagnostics = this.getDiagnostics();
        return diagnostics.map(diagnostic => ({
            filename: diagnostic.uri.fsPath,
            type: this.getSeverityString(diagnostic.severity),
            code: diagnostic.code?.toString() || '',
            location: {
                startLine: diagnostic.range.start.line,
                startColumn: diagnostic.range.start.character,
                endLine: diagnostic.range.end.line,
                endColumn: diagnostic.range.end.character
            },
            message: diagnostic.message,
            source: diagnostic.source || 'unknown',
            severity: diagnostic.severity || 0,
            relatedInfo: diagnostic.relatedInformation?.map(info => ({
                location: {
                    startLine: info.location.range.start.line,
                    startColumn: info.location.range.start.character,
                    endLine: info.location.range.end.line,
                    endColumn: info.location.range.end.character
                },
                message: info.message,
                filename: info.location.uri.fsPath
            })) || []
        }));
    }

    private getDiagnostics(): ExtendedDiagnostic[] {
        const diagnostics: ExtendedDiagnostic[] = [];
        for (const [uri, diags] of vscode.languages.getDiagnostics()) {
            diags.forEach(diagnostic => {
                const extendedDiagnostic = diagnostic as ExtendedDiagnostic;
                extendedDiagnostic.uri = uri;
                diagnostics.push(extendedDiagnostic);
            });
        }
        return diagnostics;
    }

    private getSeverityString(severity?: vscode.DiagnosticSeverity): 'error' | 'warning' | 'info' {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            default:
                return 'info';
        }
    }

    private groupBy(problems: ProblemRecord[], key: keyof ProblemRecord): GroupedProblems {
        return problems.reduce((acc, problem) => {
            const value = problem[key]?.toString() || 'unknown';
            acc[value] = acc[value] || [];
            acc[value].push(problem);
            return acc;
        }, {} as GroupedProblems);
    }

    private async saveReport(content: string | Buffer, customOutputPath: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const outputPath = customOutputPath || workspaceFolder.uri.fsPath;
        const fileName = `problems-report.${this.format}`;
        const fullPath = vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(outputPath), fileName).fsPath);

        await vscode.workspace.fs.writeFile(fullPath, Buffer.from(content.toString()));
        
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);
    }
}
