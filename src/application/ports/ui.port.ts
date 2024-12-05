export interface UIPort {
  /**
   * Show an error message to the user
   */
  showError(message: string): Promise<void>;

  /**
   * Show an information message to the user
   */
  showInfo(message: string): Promise<void>;

  /**
   * Show progress while executing a long-running operation
   */
  withProgress<T>(
    title: string,
    operation: (progress: ProgressReporter) => Promise<T>
  ): Promise<T>;
}

export interface ProgressReporter {
  report(message: string): void;
}
