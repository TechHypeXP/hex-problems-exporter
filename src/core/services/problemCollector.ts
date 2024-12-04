import * as vscode from 'vscode';
import { ProblemRecord, GroupedProblems } from '../types';

export class ProblemCollector {
    async collectProblems(): Promise<ProblemRecord[]> {
        const problems: ProblemRecord[] = [];
        
        vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
            diagnostics.forEach(diagnostic => {
                problems.push(this.convertDiagnosticToProblem(uri, diagnostic));
            });
        });

        return problems;
    }

    private convertDiagnosticToProblem(uri: vscode.Uri, diagnostic: vscode.Diagnostic): ProblemRecord {
        return {
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
        };
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

    groupProblems(problems: ProblemRecord[]): {
        byType: GroupedProblems;
        bySource: GroupedProblems;
        byCode: GroupedProblems;
    } {
        return {
            byType: this.groupBy(problems, p => this.getSeverityString(p.severity)),
            bySource: this.groupBy(problems, p => p.source || 'Unknown'),
            byCode: this.groupBy(problems, p => p.code?.toString() || 'No Code')
        };
    }

    private groupBy(array: ProblemRecord[], keyFn: (item: ProblemRecord) => string): GroupedProblems {
        return array.reduce((result, item) => {
            const key = keyFn(item);
            result[key] = result[key] || [];
            result[key].push(item);
            return result;
        }, {} as GroupedProblems);
    }
}
