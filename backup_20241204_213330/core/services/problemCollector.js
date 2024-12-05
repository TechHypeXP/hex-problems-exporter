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
exports.ProblemCollector = void 0;
const vscode = __importStar(require("vscode"));
class ProblemCollector {
    async collectProblems() {
        const problems = [];
        vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
            diagnostics.forEach(diagnostic => {
                problems.push(this.convertDiagnosticToProblem(uri, diagnostic));
            });
        });
        return problems;
    }
    convertDiagnosticToProblem(uri, diagnostic) {
        // Normalize code to a string
        const code = diagnostic.code
            ? typeof diagnostic.code === 'object'
                ? diagnostic.code.value.toString()
                : diagnostic.code.toString()
            : 'No Code';
        return {
            filename: uri.fsPath,
            type: this.getSeverityString(diagnostic.severity),
            code: code,
            location: {
                startLine: diagnostic.range.start.line + 1,
                startColumn: diagnostic.range.start.character + 1,
                endLine: diagnostic.range.end.line + 1,
                endColumn: diagnostic.range.end.character + 1
            },
            message: diagnostic.message,
            source: diagnostic.source || '',
            severity: diagnostic.severity,
            relatedInfo: diagnostic.relatedInformation?.map(info => ({
                location: {
                    startLine: info.location.range.start.line + 1,
                    startColumn: info.location.range.start.character + 1,
                    endLine: info.location.range.end.line + 1,
                    endColumn: info.location.range.end.character + 1
                },
                message: info.message,
                filename: info.location.uri.fsPath
            })) || []
        };
    }
    getSeverityString(severity) {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            case vscode.DiagnosticSeverity.Information:
                return 'info';
            case vscode.DiagnosticSeverity.Hint:
                return 'info';
            default:
                return 'info';
        }
    }
    groupProblems(problems) {
        return {
            byType: this.groupBy(problems, p => p.type),
            bySource: this.groupBy(problems, p => p.source || 'Unknown'),
            byCode: this.groupBy(problems, p => p.code)
        };
    }
    groupBy(array, keyFn) {
        return array.reduce((result, item) => {
            const key = keyFn(item);
            result[key] = result[key] || [];
            result[key].push(item);
            return result;
        }, {});
    }
}
exports.ProblemCollector = ProblemCollector;
//# sourceMappingURL=problemCollector.js.map