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

import * as sinon from 'sinon';
import { ProblemCollector } from '../../core/services/problemCollector';
import { ProblemRecord } from '../../core/types/problems/ProblemTypes';

// Mock vscode module
const mockVscode = {
    Uri: {
        file: (path: string) => ({ 
            path, 
            fsPath: path 
        }),
    },
    DiagnosticSeverity: {
        Error: 0,
        Warning: 1,
        Information: 2,
        Hint: 3
    },
    Diagnostic: class {
        constructor(
            public range: { 
                start: { line: number, character: number }, 
                end: { line: number, character: number } 
            },
            public message: string,
            public severity: number,
            public source?: string,
            public code?: string | number
        ) {}
    },
    languages: {
        getDiagnostics: () => []
    }
};

describe('ProblemCollector', () => {
    let problemCollector: ProblemCollector;

    beforeEach(() => {
        // Initialize ProblemCollector
        problemCollector = new ProblemCollector();
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

    test('collectProblems should collect problems from multiple files', async () => {
        // Stub getDiagnostics to return mock diagnostics
        const mockDiagnosticsList = [
            [
                mockVscode.Uri.file('/path/to/test1.ts'),
                [
                    new mockVscode.Diagnostic(
                        { 
                            start: { line: 0, character: 0 }, 
                            end: { line: 0, character: 10 } 
                        }, 
                        'Test error message', 
                        mockVscode.DiagnosticSeverity.Error,
                        'typescript',
                        '123'
                    )
                ]
            ]
        ];

        const getDiagnosticsStub = sinon.stub(mockVscode.languages, 'getDiagnostics').returns(mockDiagnosticsList as any);

        // Collect problems
        const problems = await problemCollector.collectProblems();

        // Assertions
        expect(problems).toHaveLength(1);
        expect(problems[0]).toHaveProperty('filename', '/path/to/test1.ts');
        expect(problems[0]).toHaveProperty('type', 'error');
        expect(problems[0]).toHaveProperty('code', '123');

        // Restore stubs
        getDiagnosticsStub.restore();
    });

    test('collectProblems should handle empty diagnostic list', async () => {
        // Stub getDiagnostics to return empty list
        const getDiagnosticsStub = sinon.stub(mockVscode.languages, 'getDiagnostics').returns([]);

        // Collect problems
        const problems = await problemCollector.collectProblems();

        // Assertions
        expect(problems).toHaveLength(0);

        // Restore stubs
        getDiagnosticsStub.restore();
    });

    test('groupProblems should correctly group problems', () => {
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

    test('getSeverityString handles all diagnostic severity levels', () => {
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
