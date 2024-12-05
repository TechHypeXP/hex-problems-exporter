import type { Mock } from 'jest-mock';
import type { OutputChannel, WorkspaceConfiguration } from 'vscode';

export interface VSCodeOutputChannel extends OutputChannel {
  append: Mock<(value: string) => void>;
  appendLine: Mock<(value: string) => void>;
  clear: Mock<() => void>;
  show: Mock<() => void>;
}

export interface VSCodeWorkspace {
  getConfiguration: Mock<(section?: string) => WorkspaceConfiguration>;
}

export interface VSCodeWindow {
  createOutputChannel: Mock<(name: string) => VSCodeOutputChannel>;
  showErrorMessage: Mock<(message: string) => Promise<string>>;
  showInformationMessage: Mock<(message: string) => Promise<string>>;
}
