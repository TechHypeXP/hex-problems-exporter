"use strict";
/**
 * Hex Problems Exporter - Problem Collector Unit Tests
 *
 * @file problemCollector.test.ts
 * @description Unit tests for the ProblemCollector service
 * @version 1.1.0
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
const ProblemCollector_1 = require("../../../core/services/ProblemCollector");
const vscode_1 = require("../../mocks/vscode");
const sinon = __importStar(require("sinon"));
describe('ProblemCollector', () => {
    let problemCollector;
    beforeEach(() => {
        // Initialize ProblemCollector
        problemCollector = new ProblemCollector_1.ProblemCollector();
        jest.clearAllMocks();
    });
    const mockDiagnostics = [
        {
            range: {
                start: { line: 0, character: 0 },
                end: { line: 1, character: 10 }
            },
            severity: 0,
            message: 'Test error message',
            source: 'typescript',
            code: 'TEST001',
            relatedInformation: []
        }
    ];
    it('should collect problems from diagnostics', async () => {
        const _mockDiagnostics = [
            {
                severity: 1,
                message: 'test warning',
                range: { start: { line: 1, character: 1 }, end: { line: 1, character: 10 } }
            }
        ];
        const result = await problemCollector.collectProblems();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should collect problems from multiple files', async () => {
        // Create a mock diagnostic using the function signature
        const mockRange = {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 10 }
        };
        const mockDiagnostic = vscode_1.mockVscode.Diagnostic(mockRange, 'Test error message', vscode_1.mockVscode.DiagnosticSeverity.Error);
        const mockDiagnosticsList = [
            [
                vscode_1.mockVscode.Uri.file('/path/to/test1.ts'),
                [mockDiagnostic]
            ]
        ];
        const getDiagnosticsStub = sinon.stub(vscode_1.mockVscode.languages, 'getDiagnostics').returns(mockDiagnosticsList);
        // Collect problems
        const problems = await problemCollector.collectProblems();
        // Assertions
        expect(problems).toHaveLength(1);
        expect(problems[0]).toHaveProperty('filename', '/path/to/test1.ts');
        expect(problems[0]).toHaveProperty('type', 'error');
        expect(problems[0]).toHaveProperty('code', undefined);
        // Restore stubs
        getDiagnosticsStub.restore();
    });
    it('should handle empty diagnostic list', async () => {
        // Stub getDiagnostics to return empty list
        const getDiagnosticsStub = sinon.stub(vscode_1.mockVscode.languages, 'getDiagnostics').returns([]);
        // Collect problems
        const problems = await problemCollector.collectProblems();
        // Assertions
        expect(problems).toHaveLength(0);
        // Restore stubs
        getDiagnosticsStub.restore();
    });
    it('should correctly group problems', () => {
        const mockProblems = [
            {
                filename: 'test.ts',
                type: 'error',
                code: 'TEST001',
                location: {
                    startLine: 1,
                    startColumn: 1,
                    endLine: 2,
                    endColumn: 10
                },
                message: 'Test error',
                source: 'test-source',
                severity: 0,
                relatedInfo: []
            },
            {
                filename: 'test2.ts',
                type: 'warning',
                code: 'TEST002',
                location: {
                    startLine: 3,
                    startColumn: 1,
                    endLine: 4,
                    endColumn: 10
                },
                message: 'Test warning',
                source: 'test-source',
                severity: 1,
                relatedInfo: []
            }
        ];
        const groupedProblems = problemCollector.groupProblems(mockProblems);
        expect(Object.keys(groupedProblems.byType)).toEqual(['error', 'warning']);
        expect(Object.keys(groupedProblems.bySource)).toEqual(['test-source']);
        expect(Object.keys(groupedProblems.byCode)).toEqual(['TEST001', 'TEST002']);
    });
    it('should handle all diagnostic severity levels', () => {
        const testCases = [
            { severity: 0, expected: 'error' },
            { severity: 1, expected: 'warning' },
            { severity: 2, expected: 'info' },
            { severity: 3, expected: 'info' }
        ];
        testCases.forEach(({ severity, expected }) => {
            const result = problemCollector['getSeverityString'](severity);
            expect(result).toBe(expected);
        });
    });
    afterEach(() => {
        sinon.restore();
    });
});
//# sourceMappingURL=problemCollector.test.js.map