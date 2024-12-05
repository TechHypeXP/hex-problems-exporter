import { DiagnosticCollection, Uri } from 'vscode';
import { EventBus, EventHandler } from '../../domain/events';
import { DiagnosticRepository } from '../../domain/repositories';
import { FileSystemPort, UIPort } from '../../application/types';
import { Diagnostic } from '../../shared/types/diagnostic.types';
import { mockDiagnostics } from './diagnostics.fixture';

export interface MockEvent {
    type: string;
    payload: Record<string, unknown>;
}

export class MockEventBus implements EventBus {
    private handlers: Map<string, EventHandler<MockEvent>[]> = new Map();

    async publish(event: MockEvent): Promise<void> {
        const handlers = this.handlers.get(event.type) || [];
        await Promise.all(handlers.map(h => h.handle(event)));
    }

    subscribe(eventType: string, handler: EventHandler<MockEvent>): void {
        const handlers = this.handlers.get(eventType) || [];
        this.handlers.set(eventType, [...handlers, handler]);
    }

    unsubscribe(eventType: string, handler: EventHandler<MockEvent>): void {
        const handlers = this.handlers.get(eventType) || [];
        this.handlers.set(
            eventType,
            handlers.filter(h => h !== handler)
        );
    }
}

export interface MockDiagnosticCollection extends DiagnosticCollection {
    get(uri: Uri): readonly Diagnostic[];
    set(uri: Uri, diagnostics: readonly Diagnostic[]): void;
    delete(uri: Uri): void;
    clear(): void;
    forEach(callback: (uri: Uri, diagnostics: readonly Diagnostic[], collection: DiagnosticCollection) => void): void;
    dispose(): void;
}

export function createMockDiagnosticCollection(): MockDiagnosticCollection {
    const diagnostics = new Map<string, Diagnostic[]>();

    return {
        name: 'mock-diagnostics',
        get(uri: Uri): readonly Diagnostic[] {
            return diagnostics.get(uri.toString()) || [];
        },
        set(uri: Uri, items: readonly Diagnostic[]): void {
            diagnostics.set(uri.toString(), [...items]);
        },
        delete(uri: Uri): void {
            diagnostics.delete(uri.toString());
        },
        clear(): void {
            diagnostics.clear();
        },
        forEach(callback: (uri: Uri, items: readonly Diagnostic[], collection: DiagnosticCollection) => void): void {
            diagnostics.forEach((items, uriString) => {
                callback(Uri.parse(uriString), items, this);
            });
        },
        dispose(): void {
            diagnostics.clear();
        }
    };
}

export class MockFileSystem implements FileSystemPort {
  writeFile: (path: string, content: string) => Promise<void> = jest.fn();
  ensureDir: (path: string) => Promise<void> = jest.fn();
  exists: (path: string) => Promise<boolean> = jest.fn().mockResolvedValue(true);
  getWorkspaceRoot: () => Promise<string> = jest.fn().mockResolvedValue('/workspace');
}

export class MockUI implements UIPort {
  showError: (message: string) => void = jest.fn();
  showInfo: (message: string) => void = jest.fn();
  withProgress: <T>(title: string, operation: (report: (message: string) => void) => Promise<T>) => Promise<T> = jest.fn().mockImplementation((_, operation) => 
    operation({ report: jest.fn() })
  );
}

export class MockDiagnosticRepository implements DiagnosticRepository {
  getAllDiagnostics: () => Promise<Diagnostic[]> = jest.fn().mockResolvedValue(mockDiagnostics);
  getDiagnosticsForFile: (file: string) => Promise<Diagnostic[]> = jest.fn().mockResolvedValue(mockDiagnostics);
  exportDiagnostics: (diagnostics: Diagnostic[]) => void = jest.fn();
}
