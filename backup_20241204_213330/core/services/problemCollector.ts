import * as vscode from 'vscode';
import { ProblemRecord, GroupedProblems } from '../types/problems/ProblemTypes';

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
        // Normalize code to a string
        const code = diagnostic.code 
            ? typeof diagnostic.code === 'object' 
                ? diagnostic.code.value.toString() 
                : diagnostic.code.toString()
            : 'No Code';

        return {
            filename: uri.fsPath,
            type: this.getSeverityString(diagnostic.severity),
            code: code,
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

    private getSeverityString(severity: vscode.DiagnosticSeverity): 'error' | 'warning' | 'info' {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            case vscode.DiagnosticSeverity.Information:
                return 'info';
            case vscode.DiagnosticSeverity.Hint:
                return 'info';
            default:
                return 'info';
        }
    }

    groupProblems(problems: ProblemRecord[]): {
        byType: GroupedProblems;
        bySource: GroupedProblems;
        byCode: GroupedProblems;
    } {
        return {
            byType: this.groupBy(problems, p => p.type),
            bySource: this.groupBy(problems, p => p.source || 'Unknown'),
            byCode: this.groupBy(problems, p => p.code)
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
