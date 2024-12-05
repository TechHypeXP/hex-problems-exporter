// Mock implementation of VS Code API
export const window = {
  showErrorMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  createOutputChannel: jest.fn(() => ({
    appendLine: jest.fn(),
    show: jest.fn(),
    clear: jest.fn()
  }))
};

export const workspace = {
  workspaceFolders: [],
  getConfiguration: jest.fn()
};

export const Uri = {
  file: jest.fn(path => ({ fsPath: path })),
  parse: jest.fn()
};

export const Position = jest.fn();
export const Range = jest.fn();

export const DiagnosticSeverity = {
  Error: 0,
  Warning: 1,
  Information: 2,
  Hint: 3
};

export const Diagnostic = jest.fn();
