import * as ExcelJS from 'exceljs';
import { IFormatter, ProblemRecord, GroupedProblems, FormatOptions } from '../types';

export class XlsxFormatter implements IFormatter {
    async format(
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        },
        _options?: FormatOptions
    ): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();

        // All Problems Sheet
        const allProblemsSheet = workbook.addWorksheet('All Problems');
        this.populateAllProblemsSheet(allProblemsSheet, problems);

        // Problems by Type Sheet
        const byTypeSheet = workbook.addWorksheet('By Type');
        this.populateGroupedSheet(byTypeSheet, groupedProblems.byType, 'Type');

        // Problems by Source Sheet
        const bySourceSheet = workbook.addWorksheet('By Source');
        this.populateGroupedSheet(bySourceSheet, groupedProblems.bySource, 'Source');

        // Problems by Code Sheet
        const byCodeSheet = workbook.addWorksheet('By Code');
        this.populateGroupedSheet(byCodeSheet, groupedProblems.byCode, 'Code');

        // Summary Sheet
        const summarySheet = workbook.addWorksheet('Summary');
        this.populateSummarySheet(summarySheet, problems, groupedProblems);

        // Write to buffer
        return await workbook.xlsx.writeBuffer() as Buffer;
    }

    getFileExtension(): string {
        return 'xlsx';
    }

    private populateAllProblemsSheet(sheet: ExcelJS.Worksheet, problems: ProblemRecord[]): void {
        sheet.columns = [
            { header: 'Type', key: 'type' },
            { header: 'Code', key: 'code' },
            { header: 'Source', key: 'source' },
            { header: 'Filename', key: 'filename' },
            { header: 'Start Line', key: 'startLine' },
            { header: 'Start Column', key: 'startColumn' },
            { header: 'End Line', key: 'endLine' },
            { header: 'End Column', key: 'endColumn' },
            { header: 'Message', key: 'message' },
            { header: 'Related Information', key: 'relatedInfo' }
        ];

        problems.forEach(problem => {
            sheet.addRow({
                type: problem.type,
                code: problem.code,
                source: problem.source,
                filename: problem.filename,
                startLine: problem.location.startLine,
                startColumn: problem.location.startColumn,
                endLine: problem.location.endLine,
                endColumn: problem.location.endColumn,
                message: problem.message,
                relatedInfo: problem.relatedInfo
                    .map(info => `${info.message} (${info.filename}:${info.location.startLine}:${info.location.startColumn})`)
                    .join('\n')
            });
        });

        sheet.getRow(1).font = { bold: true };
    }

    private populateGroupedSheet(sheet: ExcelJS.Worksheet, groupedProblems: GroupedProblems, groupName: string): void {
        sheet.columns = [
            { header: groupName, key: 'group' },
            { header: 'Filename', key: 'filename' },
            { header: 'Location', key: 'location' },
            { header: 'Message', key: 'message' },
            { header: 'Code', key: 'code' },
            { header: 'Source', key: 'source' }
        ];

        Object.entries(groupedProblems).forEach(([group, problems]) => {
            problems.forEach(problem => {
                sheet.addRow({
                    group,
                    filename: problem.filename,
                    location: `${problem.location.startLine}:${problem.location.startColumn}`,
                    message: problem.message,
                    code: problem.code,
                    source: problem.source
                });
            });
        });

        sheet.getRow(1).font = { bold: true };
    }

    private populateSummarySheet(
        sheet: ExcelJS.Worksheet,
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        }
    ): void {
        const summaryData = [
            ['Total Problems', problems.length],
            [],
            ['Problems by Type'],
            ...Object.entries(groupedProblems.byType).map(([type, typeProblems]) => [type, typeProblems.length]),
            [],
            ['Problems by Source'],
            ...Object.entries(groupedProblems.bySource).map(([source, sourceProblems]) => [source, sourceProblems.length]),
            [],
            ['Problems by Code'],
            ...Object.entries(groupedProblems.byCode).map(([code, codeProblems]) => [code, codeProblems.length])
        ];

        summaryData.forEach((row, index) => {
            const sheetRow = sheet.getRow(index + 1);
            row.forEach((cell, colIndex) => {
                sheetRow.getCell(colIndex + 1).value = cell;
                if (index === 0 || index === 2 || index === 5 || index === 8) {
                    sheetRow.getCell(colIndex + 1).font = { bold: true };
                }
            });
        });
    }
}
