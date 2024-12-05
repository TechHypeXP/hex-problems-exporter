import * as vscode from 'vscode';
import { DiagnosticPersistence } from './infrastructure/persistence/diagnostic.persistence';
import { DiagnosticService } from './application/services/diagnostic.service';
import { ExportDiagnosticsCommand } from './application/commands/export-diagnostics.command';

export function activate(context: vscode.ExtensionContext) {
    console.log('Hex Problems Exporter Extension is activated');
    const collection = vscode.languages.createDiagnosticCollection('problems');
    const repository = new DiagnosticPersistence();
    const service = new DiagnosticService(repository);
    const exportCommand = new ExportDiagnosticsCommand(service);

    let disposable = vscode.commands.registerCommand('hex-problems-exporter.export', async () => {
        console.log('Export Problems command executed');
        try {
            const diagnostics = await service.getDiagnostics();
            
            if (diagnostics.length === 0) {
                vscode.window.showInformationMessage('No problems found to export');
                return;
            }

            const outputPath = await vscode.window.showSaveDialog({
                filters: {
                    'CSV files': ['csv'],
                    'Excel files': ['xlsx']
                },
                defaultUri: vscode.Uri.file('problems.csv')
            });

            if (!outputPath) {
                return;
            }

            const format = outputPath.fsPath.endsWith('.csv') ? 'csv' : 'excel';
            
            await exportCommand.execute({ 
                format, 
                outputPath: outputPath.fsPath 
            });
            
            vscode.window.showInformationMessage('Problems exported successfully');
        } catch (error) {
            console.error('Failed to export problems:', error);
            vscode.window.showErrorMessage(`Failed to export problems: ${error.message || error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
