import { workspace, Uri } from 'vscode';
import { ErrorCode } from '../../shared/types/error.types';
import { DiagnosticError } from '../../shared/errors/diagnostic.error';

export interface FileSystemPort {
    writeFile(path: string, content: string | Buffer): Promise<void>;
    readFile(path: string): Promise<string>;
    createDirectory(path: string): Promise<void>;
    exists(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    getWorkspaceRoot(): Promise<string>;
}

export class VSCodeFileSystemAdapter implements FileSystemPort {
    async writeFile(path: string, content: string | Buffer): Promise<void> {
        try {
            const uri = Uri.file(path);
            const writeData = content instanceof Buffer ? content : Buffer.from(content);
            await workspace.fs.writeFile(uri, writeData);
        } catch (error) {
            throw new DiagnosticError(
                ErrorCode.FILE_WRITE_ERROR,
                `Failed to write file: ${error}`,
                { path, error }
            );
        }
    }

    async readFile(path: string): Promise<string> {
        try {
            const uri = Uri.file(path);
            const content = await workspace.fs.readFile(uri);
            return Buffer.from(content).toString('utf8');
        } catch (error) {
            throw new DiagnosticError(
                ErrorCode.FILE_READ_ERROR,
                `Failed to read file: ${error}`,
                { path, error }
            );
        }
    }

    async createDirectory(path: string): Promise<void> {
        try {
            const uri = Uri.file(path);
            await workspace.fs.createDirectory(uri);
        } catch (error) {
            throw new DiagnosticError(
                ErrorCode.DIRECTORY_CREATION_ERROR,
                `Failed to create directory: ${error}`,
                { path, error }
            );
        }
    }

    async exists(path: string): Promise<boolean> {
        try {
            const uri = Uri.file(path);
            await workspace.fs.stat(uri);
            return true;
        } catch {
            return false;
        }
    }

    async isDirectory(path: string): Promise<boolean> {
        try {
            const uri = Uri.file(path);
            const stat = await workspace.fs.stat(uri);
            return (stat.type & 2) !== 0; // FileType.Directory = 2
        } catch {
            return false;
        }
    }

    async getWorkspaceRoot(): Promise<string> {
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new DiagnosticError(
                ErrorCode.NO_WORKSPACE,
                'No workspace folder found'
            );
        }
        return workspaceFolders[0].uri.fsPath;
    }
}
