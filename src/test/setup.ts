import * as vscode from 'vscode';
import * as sinon from 'sinon';

export const mockVSCode = {
  DiagnosticCollection: sinon.stub(),
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2
  },
  // Add more mock implementations as needed
};

// Mock vscode module
jest.mock('vscode', () => mockVSCode);

// Global test setup
beforeEach(() => {
  sinon.restore();
});

afterEach(() => {
  sinon.restore();
});
