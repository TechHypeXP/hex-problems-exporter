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
 * - vscode
 * 
 * @testSuite XlsxFormatter
 * - Tests XLSX workbook generation
 * - Verifies sheet creation and data population
 * - Checks file extension retrieval
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as ExcelJS from 'exceljs';
import { XlsxFormatter } from '../../../core/formatters/XlsxFormatter';
import { ProblemRecord, GroupedProblems } from '../../../core/types';

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
                    severity: vscode.DiagnosticSeverity.Error,
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
                    severity: vscode.DiagnosticSeverity.Warning,
                    relatedInfo: []
                }
            ];

            const result = await xlsxFormatter?.format(mockProblems, testOutputPath);

            // Verify the result
            expect(result).to.be.true;
            expect(fs.existsSync(testOutputPath)).to.be.true;

            // Optional: Add more detailed checks on the generated XLSX file
            // This might require using a library like xlsx to read the file contents
        });

        it('should handle empty problem list', async () => {
            const result = await xlsxFormatter?.format([], testOutputPath);

            expect(result).to.be.true;
            expect(fs.existsSync(testOutputPath)).to.be.true;
        });

        it('should throw error for invalid output path', async () => {
            const invalidPath = path.join(__dirname, 'non-existent-dir', 'output.xlsx');

            try {
                await xlsxFormatter?.format([], invalidPath);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
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
                    severity: vscode.DiagnosticSeverity.Error,
                    relatedInfo: []
                }
            ];

            const mockGroupedProblems: {
                byType: GroupedProblems;
                bySource: GroupedProblems;
                byCode: GroupedProblems;
            } = {
                byType: { 'Error': mockProblems },
                bySource: { 'typescript': mockProblems },
                byCode: { '123': mockProblems }
            };

            const buffer = await xlsxFormatter?.format(mockProblems, testOutputPath);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            expect(workbook.worksheets.map(ws => ws.name)).to.include.members([
                'All Problems',
                'By Type',
                'By Source',
                'By Code',
                'Summary'
            ]);
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
                    severity: vscode.DiagnosticSeverity.Error,
                    relatedInfo: []
                }
            ];

            const mockGroupedProblems: {
                byType: GroupedProblems;
                bySource: GroupedProblems;
                byCode: GroupedProblems;
            } = {
                byType: { 'Error': mockProblems },
                bySource: { 'typescript': mockProblems },
                byCode: { '123': mockProblems }
            };

            const buffer = await xlsxFormatter?.format(mockProblems, testOutputPath);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            
            const sheet = workbook.getWorksheet('All Problems');
            const rows = sheet.getRows(2, 1);

            expect(rows?.[0].getCell(1).value).to.equal('Error');
            expect(rows?.[0].getCell(2).value).to.equal('123');
            expect(rows?.[0].getCell(3).value).to.equal('typescript');
            expect(rows?.[0].getCell(9).value).to.equal('Test error message');
        });
    });

    describe('getFileExtension', () => {
        it('should return xlsx', () => {
            expect(xlsxFormatter?.getFileExtension()).to.equal('xlsx');
        });
    });
});
