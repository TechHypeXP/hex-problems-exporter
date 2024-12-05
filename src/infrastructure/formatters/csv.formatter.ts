import { Diagnostic } from '../../shared/types/diagnostic.types';
import { DiagnosticSeverity } from 'vscode';
import * as fs from 'fs/promises';

export class CSVFormatter {
    private readonly headers = ['ID', 'Message', 'Severity', 'Line', 'Character', 'Source', 'Code'];

    async format(diagnostics: Diagnostic[], outputPath: string): Promise<void> {
        const rows = [
            this.headers.join(','),
            ...diagnostics.map(d => [
                this.escapeField(d.id),
                this.escapeField(d.message),
                this.escapeField(this.getSeverityText(d.severity)),
                this.escapeField((d.range.start.line + 1).toString()),
                this.escapeField((d.range.start.character + 1).toString()),
                this.escapeField(d.source || ''),
                this.escapeField(d.code?.toString() || '')
            ].join(','))
        ].join('\n');

        await fs.writeFile(outputPath, rows, 'utf8');
    }

    private escapeField(value: string): string {
        if (!value) return '';
        
        // If the field contains commas, quotes, or newlines, wrap it in quotes
        if (/[,"\n\r]/.test(value)) {
            // Replace any quotes with double quotes for escaping
            return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
    }

    private getSeverityText(severity: DiagnosticSeverity): string {
        switch (severity) {
            case DiagnosticSeverity.Error:
                return 'Error';
            case DiagnosticSeverity.Warning:
                return 'Warning';
            case DiagnosticSeverity.Information:
                return 'Information';
            case DiagnosticSeverity.Hint:
                return 'Hint';
            default:
                return 'Unknown';
        }
    }
}
