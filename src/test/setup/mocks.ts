import { Position, Range, Uri, Diagnostic, DiagnosticCollection, DiagnosticRelatedInformation, DiagnosticSeverity, DiagnosticTag } from 'vscode';

// Mock Position
export class MockPosition implements Position {
    constructor(public readonly line: number, public readonly character: number) {}

    isBefore(other: Position): boolean { return false; }
    isBeforeOrEqual(other: Position): boolean { return false; }
    isAfter(other: Position): boolean { return false; }
    isAfterOrEqual(other: Position): boolean { return false; }
    isEqual(other: Position): boolean { return false; }
    compareTo(other: Position): number { return 0; }
    translate(lineDelta?: number, characterDelta?: number): Position {
        return new MockPosition(
            this.line + (lineDelta || 0),
            this.character + (characterDelta || 0)
        );
    }
    with(line?: number, character?: number): Position {
        return new MockPosition(
            line ?? this.line,
            character ?? this.character
        );
    }
}

// Mock Range
export class MockRange implements Range {
    constructor(
        public readonly start: Position,
        public readonly end: Position
    ) {}

    isEmpty: boolean = false;
    isSingleLine: boolean = false;

    contains(positionOrRange: Position | Range): boolean { return false; }
    isEqual(other: Range): boolean { return false; }
    intersection(range: Range): Range | undefined { return undefined; }
    union(other: Range): Range { return this; }
    with(start?: Position, end?: Position): Range {
        return new MockRange(
            start || this.start,
            end || this.end
        );
    }
}

// Mock Diagnostic Collection
export class MockDiagnosticCollection implements DiagnosticCollection {
    private diagnostics = new Map<string, Diagnostic[]>();

    constructor(public readonly name: string) {}

    set(uri: Uri, diagnostics: readonly Diagnostic[]): void {
        this.diagnostics.set(uri.toString(), [...diagnostics]);
    }

    delete(uri: Uri): void {
        this.diagnostics.delete(uri.toString());
    }

    clear(): void {
        this.diagnostics.clear();
    }

    forEach(callback: (uri: Uri, diagnostics: readonly Diagnostic[], collection: DiagnosticCollection) => void): void {
        this.diagnostics.forEach((diagnostics, uriString) => {
            callback(Uri.parse(uriString), diagnostics, this);
        });
    }

    get(uri: Uri): readonly Diagnostic[] {
        return this.diagnostics.get(uri.toString()) || [];
    }

    has(uri: Uri): boolean {
        return this.diagnostics.has(uri.toString());
    }

    dispose(): void {
        this.diagnostics.clear();
    }

    *[Symbol.iterator](): Iterator<[Uri, readonly Diagnostic[]]> {
        for (const [uriString, diagnostics] of this.diagnostics) {
            yield [Uri.parse(uriString), diagnostics];
        }
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
