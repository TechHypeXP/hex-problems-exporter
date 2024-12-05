import { Diagnostic, ExportOptions } from '../../shared/types';
import { DiagnosticRepository } from '../../domain/repositories/diagnostic.repository';
import { FileSystemPort, UIPort } from '../../application/types';
import { mockDiagnostics } from './diagnostic.fixture';

export class MockDiagnosticRepository implements DiagnosticRepository {
    private diagnostics: Diagnostic[] = [];

    async getAllDiagnostics(): Promise<Diagnostic[]> {
        return this.diagnostics;
    }

    async getDiagnosticsForFile(filePath: string): Promise<Diagnostic[]> {
        return this.diagnostics.filter(d => d.range.start.file === filePath);
    }

    async exportDiagnostics(diagnostics: Diagnostic[], options: ExportOptions): Promise<void> {
        // Mock implementation - no actual export
    }

    setDiagnostics(diagnostics: Diagnostic[]): void {
        this.diagnostics = diagnostics;
    }

    clear(): void {
        this.diagnostics = [];
    }
}

export class MockFileSystem implements FileSystemPort {
    private files: Map<string, Buffer | string> = new Map();
    private directories: Set<string> = new Set();

    async writeFile(path: string, data: string | Buffer): Promise<void> {
        this.files.set(path, data);
        return;
    }

    async ensureDir(path: string): Promise<void> {
        this.directories.add(path);
        return;
    }

    async exists(path: string): Promise<boolean> {
        return this.files.has(path) || this.directories.has(path);
    }

    async getWorkspaceRoot(): Promise<string> {
        return '/mock/workspace';
    }

    getFileContent(path: string): string | Buffer | undefined {
        return this.files.get(path);
    }

    isDirectory(path: string): boolean {
        return this.directories.has(path);
    }
}

export class MockUI implements UIPort {
    private messages: Array<{ type: 'error' | 'info'; message: string }> = [];

    async showError(message: string): Promise<void> {
        this.messages.push({ type: 'error', message });
        return;
    }

    async showInfo(message: string): Promise<void> {
        this.messages.push({ type: 'info', message });
        return;
    }

    async withProgress<T>(
        title: string,
        operation: (progress: { report: (message: string) => void }) => Promise<T>
    ): Promise<T> {
        const progress = {
            report: (message: string): void => {
                this.messages.push({ type: 'info', message });
            }
        };
        return operation(progress);
    }

    getMessages(): Array<{ type: 'error' | 'info'; message: string }> {
        return [...this.messages];
    }

    clearMessages(): void {
        this.messages = [];
    }
}
