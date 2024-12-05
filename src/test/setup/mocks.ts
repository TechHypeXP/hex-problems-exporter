import { DiagnosticCollection, DiagnosticSeverity, Range, Position, Disposable, Uri, Diagnostic } from 'vscode';

export class MockPosition implements Position {
    constructor(public line: number, public character: number) {}
    isAfter(other: Position): boolean { return false; }
    isAfterOrEqual(other: Position): boolean { return false; }
    isBefore(other: Position): boolean { return false; }
    isBeforeOrEqual(other: Position): boolean { return false; }
    isEqual(other: Position): boolean { return false; }
    translate(lineDelta?: number, characterDelta?: number): Position { return this; }
    with(line?: number, character?: number): Position { return this; }
    compareTo(other: Position): number { return 0; }
}

export class MockRange implements Range {
    constructor(
        public start: Position = new MockPosition(0, 0),
        public end: Position = new MockPosition(0, 10)
    ) {}
    isEmpty: boolean = false;
    isSingleLine: boolean = true;
    contains(positionOrRange: Position | Range): boolean { return false; }
    isEqual(other: Range): boolean { return false; }
    intersection(range: Range): Range | undefined { return undefined; }
    union(other: Range): Range { return this; }
    with(start?: Position, end?: Position): Range { return this; }
}

export class MockDiagnosticCollection implements DiagnosticCollection {
    name: string = 'mock';
    set(uri: Uri, diagnostics: readonly Diagnostic[] | undefined): void;
    set(entries: readonly [Uri, readonly Diagnostic[] | undefined][]): void;
    set(uri: Uri, diagnostics: Diagnostic[]): void;
    set(arg1: any, arg2?: any): void {}
    delete(uri: Uri): void {}
    clear(): void {}
    dispose(): void {}
    get(uri: Uri): readonly Diagnostic[] { return []; }
    has(uri: Uri): boolean { return false; }
    forEach(callback: (uri: Uri, diagnostics: readonly Diagnostic[], collection: DiagnosticCollection) => any): void {}
    [Symbol.iterator](): Iterator<[Uri, readonly Diagnostic[]]> {
        return [][Symbol.iterator]();
    }
}

export const mockWorkspaceConfig = {
    get: (section?: string) => ({}),
    update: async () => {},
    has: (section: string) => false,
    inspect: (section: string) => undefined
};

export const mockRange = new MockRange(
    new MockPosition(0, 0),
    new MockPosition(0, 10)
);

export const LARGE_SET = Array(1000).fill(null).map((_, i) => ({
    id: `test-${i}`,
    message: `Test message ${i}`,
    severity: DiagnosticSeverity.Error,
    range: mockRange,
    source: 'test',
    code: `TEST${i}`
}));

export const MEDIUM_SET = LARGE_SET.slice(0, 100);
