import { ExtensionContext } from 'vscode';
import { DiagnosticModel } from '../domain/models';

export interface VSCodeContext {
  context: ExtensionContext;
}

export interface FormatterOptions {
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ExportAdapter {
  export(diagnostics: DiagnosticModel[], outputPath: string): Promise<void>;
}

// Infrastructure specific types for VS Code integration
export interface VSCodeDiagnosticData {
  uri: string;
  diagnostics: DiagnosticModel[];
}
