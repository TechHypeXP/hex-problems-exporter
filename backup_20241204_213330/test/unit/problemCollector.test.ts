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

import { ProblemCollector } from '../../../core/services/ProblemCollector';
import type { DiagnosticSeverity } from 'vscode';
import type { ProblemRecord } from '../../../core/types/problems/ProblemTypes';
import { mockVscode } from '../../mocks/vscode';
import * as sinon from 'sinon';

describe('ProblemCollector', () => {
    let problemCollector: ProblemCollector;

    beforeEach((): void => {
        // Initialize ProblemCollector
        problemCollector = new ProblemCollector();
        jest.clearAllMocks();
    });

    const mockDiagnostics = [
        {
            range: {
                start: { line: 0, character: 0 },
                end: { line: 1, character: 10 }
            },
            severity: 0, // Error
            message: 'Test error message',
            source: 'typescript',
            code: 'TEST001',
            relatedInformation: []
        }
    ];

    it('should collect problems from diagnostics', async (): Promise<void> => {
        const _mockDiagnostics = [
            {
                severity: 1 as DiagnosticSeverity,
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
        
        const mockDiagnostic = mockVscode.Diagnostic(
            mockRange,
            'Test error message',
            mockVscode.DiagnosticSeverity.Error
        );

        const mockDiagnosticsList = [
            [
                mockVscode.Uri.file('/path/to/test1.ts'),
                [mockDiagnostic]
            ]
        ];

        const getDiagnosticsStub = sinon.stub(mockVscode.languages, 'getDiagnostics').returns(mockDiagnosticsList as any);

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
        const getDiagnosticsStub = sinon.stub(mockVscode.languages, 'getDiagnostics').returns([]);

        // Collect problems
        const problems = await problemCollector.collectProblems();

        // Assertions
        expect(problems).toHaveLength(0);

        // Restore stubs
        getDiagnosticsStub.restore();
    });

    it('should correctly group problems', () => {
        const mockProblems: ProblemRecord[] = [
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
