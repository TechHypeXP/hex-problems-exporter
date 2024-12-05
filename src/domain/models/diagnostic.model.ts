import { DiagnosticSeverity, Range } from 'vscode';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { DiagnosticError } from '../errors/diagnostic.error';
import { ErrorCode } from '../../shared/types/diagnostic.types';

export class DiagnosticModel implements Diagnostic {
    constructor(
        public readonly id: string,
        public readonly message: string,
        public readonly severity: DiagnosticSeverity,
        public readonly range: Range,
        public readonly source?: string,
        public readonly code?: string | number
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic must have an ID'
            });
        }

        if (!this.message) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic must have a message'
            });
        }

        if (!this.range) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic must have a range'
            });
        }

        if (!this.range.start || !this.range.end) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic range must include start and end positions'
            });
        }

        if (this.range.start.line < 0 || this.range.start.character < 0 ||
            this.range.end.line < 0 || this.range.end.character < 0) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic range positions must be non-negative'
            });
        }

        if (this.range.end.line < this.range.start.line || 
            (this.range.end.line === this.range.start.line && 
             this.range.end.character < this.range.start.character)) {
            throw new DiagnosticError({
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Diagnostic range end must be after start'
            });
        }
    }

    public toString(): string {
        return `[${DiagnosticSeverity[this.severity]}] ${this.message}`;
    }
}
