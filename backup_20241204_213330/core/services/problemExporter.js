"use strict";
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
exports.ProblemExporter = void 0;
const vscode = __importStar(require("vscode"));
const markdownFormatter_1 = require("../formatters/markdownFormatter");
const jsonFormatter_1 = require("../formatters/jsonFormatter");
const csvFormatter_1 = require("../formatters/csvFormatter");
const xlsxFormatter_1 = require("../formatters/xlsxFormatter");
class ProblemExporter {
    constructor(format) {
        this.format = format;
        this.formatters = {
            'markdown': markdownFormatter_1.formatMarkdown,
            'json': jsonFormatter_1.formatJson,
            'csv': csvFormatter_1.formatCsv,
            'xlsx': xlsxFormatter_1.formatXlsx
        };
    }
    async exportProblems(customOutputPath, progress, token) {
        progress.report({ increment: 25, message: 'Collecting problems...' });
        const problems = await this.collectProblems();
        if (token.isCancellationRequested) {
            return;
        }
        progress.report({ increment: 50, message: 'Formatting output...' });
        const groupedProblems = {
            byType: this.groupBy(problems, 'type'),
            bySource: this.groupBy(problems, 'source'),
            byCode: this.groupBy(problems, 'code')
        };
        const output = await this.formatters[this.format].format(problems, groupedProblems);
        if (token.isCancellationRequested) {
            return;
        }
        progress.report({ increment: 75, message: 'Saving report...' });
        await this.saveReport(output, customOutputPath);
        vscode.window.showInformationMessage('Problems report generated successfully');
    }
    async collectProblems() {
        const diagnostics = this.getDiagnostics();
        return diagnostics.map(diagnostic => ({
            filename: diagnostic.uri.fsPath,
            type: this.getSeverityString(diagnostic.severity),
            code: diagnostic.code?.toString() || '',
            location: {
                startLine: diagnostic.range.start.line,
                startColumn: diagnostic.range.start.character,
                endLine: diagnostic.range.end.line,
                endColumn: diagnostic.range.end.character
            },
            message: diagnostic.message,
            source: diagnostic.source || 'unknown',
            severity: diagnostic.severity || 0,
            relatedInfo: diagnostic.relatedInformation?.map(info => ({
                location: {
                    startLine: info.location.range.start.line,
                    startColumn: info.location.range.start.character,
                    endLine: info.location.range.end.line,
                    endColumn: info.location.range.end.character
                },
                message: info.message,
                filename: info.location.uri.fsPath
            })) || []
        }));
    }
    getDiagnostics() {
        const diagnostics = [];
        for (const [uri, diags] of vscode.languages.getDiagnostics()) {
            diags.forEach(diagnostic => {
                const extendedDiagnostic = diagnostic;
                extendedDiagnostic.uri = uri;
                diagnostics.push(extendedDiagnostic);
            });
        }
        return diagnostics;
    }
    getSeverityString(severity) {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            default:
                return 'info';
        }
    }
    groupBy(problems, key) {
        return problems.reduce((acc, problem) => {
            const value = problem[key]?.toString() || 'unknown';
            acc[value] = acc[value] || [];
            acc[value].push(problem);
            return acc;
        }, {});
    }
    async saveReport(content, customOutputPath) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }
        const outputPath = customOutputPath || workspaceFolder.uri.fsPath;
        const fileName = `problems-report.${this.format}`;
        const fullPath = vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(outputPath), fileName).fsPath);
        await vscode.workspace.fs.writeFile(fullPath, Buffer.from(content.toString()));
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);
    }
}
exports.ProblemExporter = ProblemExporter;
//# sourceMappingURL=problemExporter.js.map