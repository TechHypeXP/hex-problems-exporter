/**
 * Hex Problems Exporter - VS Code Extension
 * 
 * @file extension.ts
 * @description Main entry point for the VS Code extension
 * @version 1.2.0
 * 
 * @author Hex Problems Exporter Team
 * @copyright (c) 2024 Hex Problems Exporter
 * @license MIT
 * 
 * @created 2024-01-05
 * @updated 2024-01-05
 */

import * as vscode from 'vscode';
import { ProblemExporter } from './core/services/problemExporter';
import { OutputFormat } from './core/types';

export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand(
        'hexProblemsExporter.export', 
        async () => {
            try {
                const problemExporter = new ProblemExporter();
                
                // Format selection via QuickPick
                const format = await vscode.window.showQuickPick(
                    ['Markdown', 'JSON', 'CSV', 'XLSX'], 
                    { 
                        placeHolder: 'Select export format',
                        title: 'Hex Problems Exporter'
                    }
                ) as OutputFormat;

                if (!format) {
                    return; // User cancelled
                }

                // Progress window
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Exporting Problems Report',
                    cancellable: true
                }, async (progress, token) => {
                    await problemExporter.exportProblems(
                        format.toLowerCase() as OutputFormat, 
                        '', 
                        progress, 
                        token
                    );
                });
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Problem Export Failed: ${error instanceof Error ? error.message : error}`
                );
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate(): void {
    // Cleanup logic if needed
}
