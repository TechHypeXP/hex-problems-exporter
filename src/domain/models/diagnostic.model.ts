import { DiagnosticSeverity, Range } from 'vscode';
import { Diagnostic } from '../../shared/types/diagnostic.types';

export type { Diagnostic } from '../../shared/types/diagnostic.types';

export interface DiagnosticModel extends Diagnostic {
    readonly id: string;
    readonly message: string;
    readonly severity: DiagnosticSeverity;
    readonly range: Range;
    readonly source?: string;
    readonly code?: string | number;
}

export function createDiagnosticModel(
    id: string,
    message: string,
    severity: DiagnosticSeverity,
    range: Range,
    source?: string,
    code?: string | number
): DiagnosticModel {
    return {
        id,
        message,
        severity,
        range,
        source,
        code,
        relatedInformation: [],
        tags: []
    };
}
