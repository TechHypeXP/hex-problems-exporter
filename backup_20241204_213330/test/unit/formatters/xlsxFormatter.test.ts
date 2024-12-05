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
import type { ProblemRecord, GroupedProblems } from '../../../core/types/problems/ProblemTypes';

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

    const testProblems: ProblemRecord[] = [{
        filename: 'test.ts',
        type: 'error',
        code: 'TS1234',
        location: {
            startLine: 1,
            startColumn: 1,
            endLine: 1,
            endColumn: 10
        },
        message: 'Test error',
        source: 'typescript',
        severity: 1,
        relatedInfo: []
    }];

    const mockGroupedProblems: {
        byType: GroupedProblems;
        bySource: GroupedProblems;
        byCode: GroupedProblems;
    } = {
        byType: { 'error': testProblems },
        bySource: { 'typescript': testProblems },
        byCode: { 'TS1234': testProblems }
    };

    it('should format problems to XLSX', async (): Promise<void> => {
        const result = await xlsxFormatter.format(testProblems, mockGroupedProblems);
        expect(result).toBeInstanceOf(Buffer);
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
        const buffer = await xlsxFormatter?.format(testProblems, mockGroupedProblems);
        
        if (!buffer) {
            throw new Error('Buffer should not be undefined');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const sheets = workbook.worksheets;
        expect(sheets.length).toStrictEqual(5); // All Problems, By Type, By Source, By Code, Summary
    });

    test('should format problem data correctly in All Problems sheet', async () => {
        const buffer = await xlsxFormatter?.format(testProblems, mockGroupedProblems);
        
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
        expect(rows?.[0].getCell(2).value).toStrictEqual('TS1234');
        expect(rows?.[0].getCell(3).value).toStrictEqual('typescript');
    });
});
