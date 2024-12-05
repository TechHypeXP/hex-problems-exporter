import { Diagnostic, Range, DiagnosticSeverity } from 'vscode';

export const createRange = (
    startLine = 0,
    startColumn = 0,
    endLine = 0,
    endColumn = 10
): Range => ({
    start: {
        line: startLine,
        character: startColumn
    },
    end: {
        line: endLine,
        character: endColumn
    }
});

export const createDiagnostic = (
    overrides: Partial<Diagnostic> = {}
): Diagnostic => ({
    id: 'test-1',
    message: 'Test message',
    severity: DiagnosticSeverity.Error,
    range: createRange(),
    source: 'test',
    code: 'TEST001',
    ...overrides
});

export const mockDiagnostics: Diagnostic[] = [
    createDiagnostic({
        id: 'ERROR-001',
        message: 'Critical error in code',
        severity: DiagnosticSeverity.Error,
        range: createRange(10, 5, 10, 15)
    }),
    createDiagnostic({
        id: 'WARN-001',
        message: 'Potential issue detected',
        severity: DiagnosticSeverity.Warning,
        range: createRange(25, 12, 25, 20)
    }),
    createDiagnostic({
        id: 'INFO-001',
        message: 'Consider refactoring this section',
        severity: DiagnosticSeverity.Information,
        range: createRange(45, 8, 45, 18)
    })
];
