import { expect, use } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { jest } from '@jest/globals';
import { DiagnosticCollection, Uri, WorkspaceConfiguration } from 'vscode';
import { MockDiagnosticCollection, mockWorkspaceConfig } from './mocks';

// Configure Chai plugins
use(sinonChai);
use(chaiAsPromised);

// Configure global expect
(global as any).expect = expect;

// Mock VS Code module
const mockCollection = new MockDiagnosticCollection();
export const mockVSCode = {
    DiagnosticCollection: MockDiagnosticCollection,
    Uri: {
        file: (path: string) => ({ fsPath: path, path } as Uri),
        parse: (path: string) => ({ fsPath: path, path } as Uri)
    },
    workspace: {
        getConfiguration: () => mockWorkspaceConfig
    },
    diagnosticCollection: mockCollection
};

jest.mock('vscode', () => mockVSCode, { virtual: true });

// Global test setup
beforeEach((): void => {
    jest.clearAllMocks();
});

afterEach(() => {
    sinon.restore();
});

export interface VSCodeMock {
    DiagnosticCollection: typeof DiagnosticCollection;
    Uri: {
        file(path: string): Uri;
        parse(path: string): Uri;
    };
    workspace: {
        getConfiguration(section?: string): WorkspaceConfiguration;
    };
}

declare global {
    const vscode: VSCodeMock;
    const mockVSCode: typeof mockVSCode;
}
