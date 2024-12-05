import { Diagnostic } from '../../shared/types/diagnostic.types';

export interface FormatterPort {
    format(diagnostics: Diagnostic[]): Promise<string | Buffer>;
}
