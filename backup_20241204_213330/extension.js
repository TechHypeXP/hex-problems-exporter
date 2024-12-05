"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const problemExporter_1 = require("./core/services/problemExporter");
function activate(context) {
    const disposable = vscode.commands.registerCommand('hexProblemsExporter.export', async () => {
        try {
            const problemExporter = new problemExporter_1.ProblemExporter();
            // Format selection via QuickPick
            const format = await vscode.window.showQuickPick(['Markdown', 'JSON', 'CSV', 'XLSX'], {
                placeHolder: 'Select export format',
                title: 'Hex Problems Exporter'
            });
            if (!format) {
                return; // User cancelled
            }
            // Progress window
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Exporting Problems Report',
                cancellable: true
            }, async (progress, token) => {
                await problemExporter.exportProblems(format.toLowerCase(), '', progress, token);
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Problem Export Failed: ${error instanceof Error ? error.message : error}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
    // Cleanup logic if needed
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map