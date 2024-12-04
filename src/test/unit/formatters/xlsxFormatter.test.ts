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
 * - jest
 * - exceljs
 * - fs
 * - path
 * 
 * @testSuite XlsxFormatter
 * - Tests XLSX workbook generation
 * - Verifies sheet creation and data population
 * - Checks file extension retrieval
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { XlsxFormatter } from '../../../core/formatters/xlsxFormatter';
import { ProblemRecord, GroupedProblems } from '../../../core/types/problems/ProblemTypes';

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
    let xlsxFormatter: XlsxFormatter;

    beforeEach(() => {
        xlsxFormatter = new XlsxFormatter();
    });

    const testOutputPath = path.join(__dirname, 'test-output.xlsx');

    afterEach(() => {
        // Clean up test output file if it exists
        if (fs.existsSync(testOutputPath)) {
            fs.unlinkSync(testOutputPath);
        }
    });

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
        }
    ];

    const mockGroupedProblems: {
        byType: GroupedProblems;
        bySource: GroupedProblems;
        byCode: GroupedProblems;
    } = {
        byType: { 'error': mockProblems },
        bySource: { 'test-source': mockProblems },
        byCode: { 'TEST001': mockProblems }
    };

    test('format should return a buffer', async () => {
        const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);
        expect(buffer).toBeInstanceOf(Buffer);
    });

    test('getFileExtension should return xlsx', () => {
        const extension = xlsxFormatter.getFileExtension();
        expect(extension).toBe('xlsx');
    });

    test('format handles empty problems list', async () => {
        const buffer = await xlsxFormatter?.format([], {
            byType: {},
            bySource: {},
            byCode: {}
        });
        expect(buffer).toBeInstanceOf(Buffer);
    });

    test('should create an XLSX workbook with multiple sheets', async () => {
        const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);
        
        if (!buffer) {
            throw new Error('Buffer should not be undefined');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const sheets = workbook.worksheets;
        expect(sheets.length).toStrictEqual(5); // All Problems, By Type, By Source, By Code, Summary
    });

    test('should format problem data correctly in All Problems sheet', async () => {
        const buffer = await xlsxFormatter?.format(mockProblems, mockGroupedProblems);
        
        if (!buffer) {
            throw new Error('Buffer should not be undefined');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        const sheet = workbook.getWorksheet('All Problems');
        const rows = sheet?.getRows(2, 10); // Start from row 2 to skip headers
        
        if (!rows || rows.length === 0) {
            throw new Error('No rows found in the sheet');
        }

        expect(rows?.[0].getCell(1).value).toStrictEqual('error');
        expect(rows?.[0].getCell(2).value).toStrictEqual('TEST001');
        expect(rows?.[0].getCell(3).value).toStrictEqual('test-source');
    });
});
