import { Diagnostic } from '../../shared/types/diagnostic.types';

export class CSVFormatter {
    format(diagnostics: Diagnostic[]): string {
        return diagnostics.map(d => [
            d.id,
            d.message,
            d.severity,
            `${d.range.start.line}:${d.range.start.character}`,
            d.source || '',
            d.code || ''
        ].join(',')).join('\n');
    }
}
