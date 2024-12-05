import { DiagnosticSeverity } from 'vscode';
import { Diagnostic } from '../../shared/types/diagnostic.types';

export function createDiagnostic(overrides: Partial<Diagnostic> = {}): Diagnostic {
    return {
        id: 'test-diagnostic',
        message: 'Test diagnostic message',
        severity: DiagnosticSeverity.Error,
        location: {
            file: '/test/file.ts',
            line: 1,
            column: 1
        },
        source: 'test',
        code: 'TEST001',
        ...overrides
    };
}

export const mockDiagnostics: Diagnostic[] = [
    createDiagnostic(),
    createDiagnostic({
        id: 'test-diagnostic-2',
        message: 'Another test diagnostic'
    })
];
