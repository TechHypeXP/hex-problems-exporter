import * as vscode from 'vscode';
import { DiagnosticEvent } from '../../shared/types/diagnostic.types';

export interface EventBus {
    publish<T extends DiagnosticEvent>(event: T): Promise<void>;
    subscribe<T extends DiagnosticEvent>(eventType: T['type'], handler: (event: T) => void): vscode.Disposable;
    dispose(): void;
}

export class VSCodeEventBusAdapter implements EventBus {
    private readonly emitter = new vscode.EventEmitter<DiagnosticEvent>();
    private readonly handlers = new Map<string, Set<(event: DiagnosticEvent) => void>>();

    async publish<T extends DiagnosticEvent>(event: T): Promise<void> {
        this.emitter.fire(event);
        const handlers = this.handlers.get(event.type);
        if (handlers) {
            handlers.forEach(handler => handler(event));
        }
    }

    subscribe<T extends DiagnosticEvent>(eventType: T['type'], handler: (event: T) => void): vscode.Disposable {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        const handlers = this.handlers.get(eventType)!;
        handlers.add(handler as (event: DiagnosticEvent) => void);

        return new vscode.Disposable(() => {
            handlers.delete(handler as (event: DiagnosticEvent) => void);
            if (handlers.size === 0) {
                this.handlers.delete(eventType);
            }
        });
    }

    dispose(): void {
        this.emitter.dispose();
        this.handlers.clear();
    }
}
