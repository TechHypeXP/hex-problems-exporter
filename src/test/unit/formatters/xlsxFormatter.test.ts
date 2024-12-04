/**
 * Hex Problems Exporter - XLSX Formatter Unit Tests
 * 
 * @file xlsxFormatter.test.ts
 * @description Unit tests for the XLSX Formatter
 * @version 1.1.0
 * 
 * @author Hex Problems Exporter Team
 * @copyright (c) 2024 Hex Problems Exporter
 * @license MIT
 * 
 * @created 2024-01-05
 * @updated 2024-01-05
 * 
 * @dependencies 
 * - chai
 * - exceljs
 * - fs
 * - path
 * 
 * @testSuite XlsxFormatter
 * - Tests XLSX workbook generation
 * - Verifies sheet creation and data population
 * - Checks file extension retrieval
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { XlsxFormatter } from '../../../core/formatters/XlsxFormatter';
import { ProblemRecord, GroupedProblems } from '../../../core/types';

// Mock vscode module
const mockVscode = {
    DiagnosticSeverity: {
        Error: 0,
        Warning: 1,
        Information: 2,
        Hint: 3
    }
};

describe('XlsxFormatter', () => {
    let xlsxFormatter: XlsxFormatter | null = null;
    const testOutputPath = path.join(__dirname, 'test-output.xlsx');

    beforeEach(() => {
        xlsxFormatter = new XlsxFormatter();
    });

    afterEach(() => {
        // Clean up test output file if it exists
        if (fs.existsSync(testOutputPath)) {
            fs.unlinkSync(testOutputPath);
        }
    });

    describe('format', () => {
        it('should generate XLSX file with correct problem data', async () => {
            const mockProblems: ProblemRecord[] = [
                {
                    filename: 'test1.ts',
                    type: 'Error',
                    code: '123',
                    location: { 
                        startLine: 1, 
                        startColumn: 1, 
                        endLine: 1, 
                        endColumn: 2 
                    },
                    message: 'Test error message',
                    source: 'typescript',
                    severity: mockVscode.DiagnosticSeverity.Error,
                    relatedInfo: []
                },
                {
                    filename: 'test2.ts',
                    type: 'Warning',
                    code: '456',
                    location: { 
                        startLine: 2, 
                        startColumn: 3, 
                        endLine: 2, 
                        endColumn: 4 
                    },
                    message: 'Test warning message',
                    source: 'eslint',
                    severity: mockVscode.DiagnosticSeverity.Warning,
                    relatedInfo: []
                }
            ];

            const mockGroupedProblems = {
                byType: { 'Error': mockProblems.filter(p => p.type === 'Error') },
                bySource: { 'typescript': mockProblems.filter(p => p.source === 'typescript') },
                byCode: { '123': mockProblems.filter(p => p.code === '123') }
            };

            const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);

            // Verify the result
            expect(buffer).to.be.instanceOf(Buffer);
        });

        it('should handle empty problem list', async () => {
            const mockGroupedProblems = {
                byType: {},
                bySource: {},
                byCode: {}
            };

            const buffer = await xlsxFormatter?.format([], mockGroupedProblems);

            expect(buffer).to.be.instanceOf(Buffer);
        });

        it('should create an XLSX workbook with multiple sheets', async () => {
            const mockProblems: ProblemRecord[] = [
                {
                    filename: 'test1.ts',
                    type: 'Error',
                    code: '123',
                    location: { 
                        startLine: 1, 
                        startColumn: 1, 
                        endLine: 1, 
                        endColumn: 2 
                    },
                    message: 'Test error message',
                    source: 'typescript',
                    severity: mockVscode.DiagnosticSeverity.Error,
                    relatedInfo: []
                }
            ];

            const mockGroupedProblems = {
                byType: { 'Error': mockProblems },
                bySource: { 'typescript': mockProblems },
                byCode: { '123': mockProblems }
            };

            const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);
            
            if (!buffer) {
                expect.fail('Buffer should not be undefined');
                return;
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const sheets = workbook.worksheets;
            expect(sheets.length).to.equal(5); // All Problems, By Type, By Source, By Code, Summary
        });

        it('should format problem data correctly in All Problems sheet', async () => {
            const mockProblems: ProblemRecord[] = [
                {
                    filename: 'test1.ts',
                    type: 'Error',
                    code: '123',
                    location: { 
                        startLine: 1, 
                        startColumn: 1, 
                        endLine: 1, 
                        endColumn: 2 
                    },
                    message: 'Test error message',
                    source: 'typescript',
                    severity: mockVscode.DiagnosticSeverity.Error,
                    relatedInfo: []
                }
            ];

            const mockGroupedProblems = {
                byType: { 'Error': mockProblems },
                bySource: { 'typescript': mockProblems },
                byCode: { '123': mockProblems }
            };

            const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);
            
            if (!buffer) {
                expect.fail('Buffer should not be undefined');
                return;
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            
            const sheet = workbook.getWorksheet('All Problems');
            const rows = sheet?.getRows(2, 10); // Start from row 2 to skip headers
            
            if (!rows || rows.length === 0) {
                expect.fail('No rows found in the sheet');
                return;
            }

            expect(rows?.[0].getCell(1).value).to.equal('Error');
            expect(rows?.[0].getCell(2).value).to.equal('123');
            expect(rows?.[0].getCell(3).value).to.equal('typescript');
        });
    });

    describe('getFileExtension', () => {
        it('should return xlsx', () => {
            expect(xlsxFormatter?.getFileExtension()).to.equal('xlsx');
        });
    });
});
