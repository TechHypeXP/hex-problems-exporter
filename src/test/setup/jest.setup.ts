import { expect } from 'chai';
import { DiagnosticSeverity, Uri, WorkspaceConfiguration } from 'vscode';
import { createMockDiagnosticCollection } from '../fixtures/mocks.fixture';

export interface VSCodeMock {
    DiagnosticSeverity: typeof DiagnosticSeverity;
    Uri: {
        file(path: string): Uri;
        parse(path: string): Uri;
    };
    workspace: {
        getConfiguration(section?: string): WorkspaceConfiguration;
    };
}

export interface GlobalMock {
    vscode: VSCodeMock;
    mockVSCode: {
        diagnostics: ReturnType<typeof createMockDiagnosticCollection>;
    };
    expect: typeof expect;
}

export function setupTestEnvironment(): void {
    const globalMock: GlobalMock = {
        vscode: {
            DiagnosticSeverity,
            Uri: {
                file: (path: string): Uri => Uri.file(path),
                parse: (path: string): Uri => Uri.parse(path)
            },
            workspace: {
                getConfiguration: (): WorkspaceConfiguration => ({
                    get: (): Record<string, unknown> => ({}),
                    update: (): Promise<void> => Promise.resolve()
                } as WorkspaceConfiguration)
            }
        },
        mockVSCode: {
            diagnostics: createMockDiagnosticCollection()
        },
        expect
    };

    Object.assign(global, globalMock);
}

setupTestEnvironment();
