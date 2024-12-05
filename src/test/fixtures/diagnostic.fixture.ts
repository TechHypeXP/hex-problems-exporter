import { DiagnosticSeverity, Range, Uri } from 'vscode';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { MockPosition, MockRange } from '../setup/mocks';

export const createRange = (startLine = 0, startChar = 0, endLine = 0, endChar = 0): Range => {
    return new MockRange(
        new MockPosition(startLine, startChar),
        new MockPosition(endLine, endChar)
    );
};

export const createDiagnostic = (options: Partial<Diagnostic> = {}): Diagnostic => {
    const defaultDiagnostic: Diagnostic = {
        id: 'test-diagnostic',
        message: 'Test diagnostic message',
        severity: DiagnosticSeverity.Error,
        range: createRange(),
        source: 'test',
        code: 'TEST001',
        relatedInformation: [],
        tags: []
    };

    return { ...defaultDiagnostic, ...options };
};

export const createErrorDiagnostic = (message = 'Error diagnostic'): Diagnostic => {
    return createDiagnostic({
        id: 'error-diagnostic',
        message,
        severity: DiagnosticSeverity.Error,
        range: createRange(1, 1, 1, 10)
    });
};

export const createWarningDiagnostic = (message = 'Warning diagnostic'): Diagnostic => {
    return createDiagnostic({
        id: 'warning-diagnostic',
        message,
        severity: DiagnosticSeverity.Warning,
        range: createRange(2, 1, 2, 10)
    });
};

export const createInfoDiagnostic = (message = 'Info diagnostic'): Diagnostic => {
    return createDiagnostic({
        id: 'info-diagnostic',
        message,
        severity: DiagnosticSeverity.Information,
        range: createRange(3, 1, 3, 10)
    });
};

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
