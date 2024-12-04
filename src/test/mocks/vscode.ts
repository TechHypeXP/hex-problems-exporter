import type { Diagnostic, DiagnosticSeverity, Uri, Range, OutputChannel, WorkspaceConfiguration } from 'vscode';
import type { Mock } from 'jest-mock';

export interface VSCodeMock {
  window: {
    showErrorMessage: Mock<(message: string) => Promise<string>>;
    showInformationMessage: Mock<(message: string) => Promise<string>>;
    createOutputChannel: Mock<(name: string) => OutputChannel>;
  };
  workspace: {
    getConfiguration: Mock<(section?: string) => WorkspaceConfiguration>;
  };
  Uri: {
    file: Mock<(path: string) => Uri>;
    parse: Mock<(path: string) => Uri>;
  };
  DiagnosticSeverity: {
    Error: DiagnosticSeverity;
    Warning: DiagnosticSeverity;
    Information: DiagnosticSeverity;
  };
  Diagnostic: Mock<(range: Range, message: string, severity?: DiagnosticSeverity) => Diagnostic>;
}

export const mockVscode = jest.fn() as unknown as VSCodeMock;
