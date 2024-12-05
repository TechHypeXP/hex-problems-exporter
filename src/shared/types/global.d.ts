import { expect as chaiExpect } from 'chai';
import { DiagnosticSeverity, Uri, WorkspaceConfiguration, DiagnosticCollection } from 'vscode';
import { Logger } from '../logging';

declare global {
  // Chai type augmentation
  namespace Chai {
    interface Assertion {
      extend(matchers: Record<string, unknown>): void;
    }
  }

  // Global expect declaration
  interface GlobalExpect {
    expect: typeof chaiExpect;
  }
  const expect: GlobalExpect['expect'];

  // Global logger
  interface GlobalLogger {
    logger: Logger;
  }
  const logger: GlobalLogger['logger'];

  // Global setup
  interface GlobalSetup {
    diagnostics: DiagnosticCollection;
  }
  const mockVSCode: GlobalSetup;

  // VS Code diagnostic type
  interface Diagnostic {
    message: string;
    severity: DiagnosticSeverity;
    source?: string;
    code?: string | number;
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }
}

declare module 'vscode' {
    interface ExtensionContext {
        subscriptions: { dispose(): void }[];
    }

    interface DiagnosticCollection {
        set(uri: Uri, diagnostics: Diagnostic[]): void;
        delete(uri: Uri): void;
        clear(): void;
        forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => void): void;
        get(uri: Uri): Diagnostic[] | undefined;
        has(uri: Uri): boolean;
        dispose(): void;
    }

    const languages: {
        createDiagnosticCollection(name?: string): DiagnosticCollection;
    };

    const workspace: {
        workspaceFolders: { uri: Uri }[] | undefined;
        getConfiguration(section?: string): WorkspaceConfiguration;
    };
}

export {};
