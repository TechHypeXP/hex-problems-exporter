"use strict";
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ExcelJS = __importStar(require("exceljs"));
const xlsxFormatter_1 = require("../../../core/formatters/xlsxFormatter");
describe('XlsxFormatter', () => {
    let xlsxFormatter;
    beforeEach(() => {
        xlsxFormatter = new xlsxFormatter_1.XlsxFormatter();
    });
    const testOutputPath = path.join(__dirname, 'test-output.xlsx');
    afterEach(() => {
        // Clean up test output file if it exists
        if (fs.existsSync(testOutputPath)) {
            fs.unlinkSync(testOutputPath);
        }
    });
    const testProblems = [{
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
    const mockGroupedProblems = {
        byType: { 'error': testProblems },
        bySource: { 'typescript': testProblems },
        byCode: { 'TS1234': testProblems }
    };
    it('should format problems to XLSX', async () => {
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
//# sourceMappingURL=xlsxFormatter.test.js.map