import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import { FileSystemPort } from '../../application/types';
import { DiagnosticError } from '../../shared/errors/diagnostic.error';
import { ErrorCode } from '../../shared/types/diagnostic.types';
import { workspace } from 'vscode';
import { BaseError } from '../../../shared/types/error.types';

export class VSCodeFileSystemAdapter implements FileSystemPort {
  async writeFile(filePath: string, data: string | Buffer): Promise<void> {
    try {
      const uri = workspace.workspaceFile?.with({ path: filePath });
      if (!uri) {
        throw new Error('No workspace file');
      }

      await workspace.fs.writeFile(uri, typeof data === 'string' ? Buffer.from(data) : data);
    } catch (error) {
      throw new BaseError('Failed to write file', {
        component: 'VSCodeFileSystemAdapter',
        operation: 'writeFile',
        metadata: { path: filePath, error }
      });
    }
  }

  async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw DiagnosticError.fileSystem('Failed to create directory', {
        path: dirPath,
        error,
        operation: 'ensureDir'
      });
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async getWorkspaceRoot(): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
      throw DiagnosticError.create('NO_WORKSPACE', 'No workspace folder found', {
        operation: 'getWorkspaceRoot'
      });
    }
    return workspaceFolders[0].uri.fsPath;
  }

  async readFile(path: string): Promise<string> {
    try {
      const uri = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!uri) {
        throw new DiagnosticError({
          code: ErrorCode.NO_WORKSPACE,
          message: 'No workspace folder found'
        });
      }

      const fsPath = uri.fsPath;
      const fullPath = `${fsPath}/${path}`;
      const content = await vscode.workspace.fs.readFile(vscode.workspace.Uri.file(fullPath));
      return Buffer.from(content).toString('utf-8');
    } catch (error) {
      throw new DiagnosticError({
        code: ErrorCode.FILE_READ_ERROR,
        message: `Failed to read file: ${error.message}`,
        metadata: { path, error }
      });
    }
  }
}
