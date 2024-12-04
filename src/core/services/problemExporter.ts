import * as vscode from 'vscode';
import { OutputFormat, ProblemRecord, GroupedProblems } from '../types';
import { formatMarkdown } from '../formatters/markdownFormatter';
import { formatJson } from '../formatters/jsonFormatter';
import { formatCsv } from '../formatters/csvFormatter';
import { formatXlsx } from '../formatters/xlsxFormatter';

export class ProblemExporter {
    async exportProblems(
        format: OutputFormat,
        customOutputPath: string,
        progress: vscode.Progress<{ increment?: number; message?: string }>,
        token: vscode.CancellationToken
    ): Promise<void> {
        progress.report({ increment: 0, message: 'Collecting problems...' });
        const problems = await this.collectProblems();

        if (token.isCancellationRequested) {
            return;
        }

        if (problems.length === 0) {
            vscode.window.showInformationMessage('No problems found in workspace');
            return;
        }

        progress.report({ increment: 50, message: 'Formatting output...' });
        const output = await this.formatOutput(problems, format);

        if (token.isCancellationRequested) {
            return;
        }

        progress.report({ increment: 75, message: 'Saving report...' });
        await this.saveReport(output, format, customOutputPath);

        vscode.window.showInformationMessage('Problems report generated successfully');
    }

    private async collectProblems(): Promise<ProblemRecord[]> {
        const problems: ProblemRecord[] = [];
        
        vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
            diagnostics.forEach(diagnostic => {
                problems.push({
                    filename: uri.fsPath,
                    type: this.getSeverityString(diagnostic.severity),
                    code: diagnostic.code,
                    location: {
                        startLine: diagnostic.range.start.line + 1,
                        startColumn: diagnostic.range.start.character + 1,
                        endLine: diagnostic.range.end.line + 1,
                        endColumn: diagnostic.range.end.character + 1
                    },
                    message: diagnostic.message,
                    source: diagnostic.source || '',
                    severity: diagnostic.severity,
                    relatedInfo: diagnostic.relatedInformation?.map(info => ({
                        location: {
                            startLine: info.location.range.start.line + 1,
                            startColumn: info.location.range.start.character + 1,
                            endLine: info.location.range.end.line + 1,
                            endColumn: info.location.range.end.character + 1
                        },
                        message: info.message,
                        filename: info.location.uri.fsPath
                    })) || []
                });
            });
        });

        return problems;
    }

    private async formatOutput(problems: ProblemRecord[], format: OutputFormat): Promise<string> {
        const groupedByType = this.groupBy(problems, p => this.getSeverityString(p.severity));
        const groupedBySource = this.groupBy(problems, p => p.source || 'Unknown');
        const groupedByCode = this.groupBy(problems, p => p.code?.toString() || 'No Code');

        switch (format) {
            case 'markdown':
                return formatMarkdown(problems, groupedByType, groupedBySource, groupedByCode);
            case 'json':
                return formatJson(problems, groupedByType, groupedBySource, groupedByCode);
            case 'csv':
                return formatCsv(problems);
            default:
                throw new Error(`Unsupported output format: ${format}`);
        }
    }

    private async saveReport(content: string, format: OutputFormat, customOutputPath: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const outputPath = customOutputPath || workspaceFolder.uri.fsPath;
        const fileName = `problems-report.${format}`;
        const fullPath = vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(outputPath), fileName).fsPath);

        await vscode.workspace.fs.writeFile(fullPath, Buffer.from(content));
        
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);
    }

    private getSeverityString(severity: vscode.DiagnosticSeverity): string {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'Error';
            case vscode.DiagnosticSeverity.Warning:
                return 'Warning';
            case vscode.DiagnosticSeverity.Information:
                return 'Information';
            case vscode.DiagnosticSeverity.Hint:
                return 'Hint';
            default:
                return 'Unknown';
        }
    }

    private groupBy<T>(array: T[], keyFn: (item: T) => string): GroupedProblems {
        return array.reduce((result, item) => {
            const key = keyFn(item);
            result[key] = result[key] || [];
            result[key].push(item as ProblemRecord);
            return result;
        }, {} as GroupedProblems);
    }
}
