"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnostic = exports.DiagnosticSeverity = exports.Range = exports.Position = exports.Uri = exports.workspace = exports.window = void 0;
// Mock implementation of VS Code API
exports.window = {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    createOutputChannel: jest.fn(() => ({
        appendLine: jest.fn(),
        show: jest.fn(),
        clear: jest.fn()
    }))
};
exports.workspace = {
    workspaceFolders: [],
    getConfiguration: jest.fn()
};
exports.Uri = {
    file: jest.fn(path => ({ fsPath: path })),
    parse: jest.fn()
};
exports.Position = jest.fn();
exports.Range = jest.fn();
exports.DiagnosticSeverity = {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3
};
exports.Diagnostic = jest.fn();
//# sourceMappingURL=vscode.mock.js.map