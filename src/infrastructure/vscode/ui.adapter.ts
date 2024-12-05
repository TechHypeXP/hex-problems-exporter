import * as vscode from 'vscode';
import { UIPort, ProgressReporter } from '../../application/ports';

export class VSCodeUIAdapter implements UIPort {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async showError(message: string): Promise<void> {
    await vscode.window.showErrorMessage(message);
  }

  async showInfo(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }

  async withProgress<T>(
    title: string,
    operation: (progress: ProgressReporter) => Promise<T>
  ): Promise<T> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title,
        cancellable: false
      },
      async (progress) => {
        const reporter: ProgressReporter = {
          report: (message: string) => {
            progress.report({ message });
          }
        };
        return operation(reporter);
      }
    );
  }
}
