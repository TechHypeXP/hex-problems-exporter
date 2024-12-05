import { DiagnosticEvent } from './diagnostic.events';

export interface EventHandler<T> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  publish<T extends DiagnosticEvent>(event: T): Promise<void>;
  subscribe<T extends DiagnosticEvent>(
    eventType: T['type'],
    handler: EventHandler<T>
  ): void;
  unsubscribe<T extends DiagnosticEvent>(
    eventType: T['type'],
    handler: EventHandler<T>
  ): void;
}
