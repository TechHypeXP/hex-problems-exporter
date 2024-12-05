import * as vscode from 'vscode';
import { EventBus } from '../../domain/events';

export interface EventData {
    type: string;
    payload: Record<string, unknown>;
}

export class VSCodeEventBusAdapter implements EventBus {
    private readonly emitter = new vscode.EventEmitter<EventData>();

    async publish<T extends EventData>(event: T): Promise<void> {
        this.emitter.fire(event);
    }

    subscribe(callback: (event: EventData) => void): vscode.Disposable {
        return this.emitter.event(callback);
    }

    dispose(): void {
        this.emitter.dispose();
    }
}
