export interface FileSystemPort {
  /**
   * Write data to a file
   */
  writeFile(path: string, data: string | Buffer): Promise<void>;

  /**
   * Ensure a directory exists, create it if it doesn't
   */
  ensureDir(path: string): Promise<void>;

  /**
   * Check if a file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Get the workspace root path
   */
  getWorkspaceRoot(): Promise<string>;
}
