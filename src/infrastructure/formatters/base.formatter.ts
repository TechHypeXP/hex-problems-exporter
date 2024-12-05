import { Diagnostic } from 'vscode';

export interface IFormatter {
    format(diagnostics: Diagnostic[], outputPath: string): Promise<string>;
}
