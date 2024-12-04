import * as ExcelJS from 'exceljs';
import { IFormatter } from '../types';
import { ProblemRecord, GroupedProblems, FormatterOptions } from '../types/problems/ProblemTypes';

export class XlsxFormatter implements IFormatter {
    async format(
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        },
        _options?: FormatterOptions
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
            { header: 'Message', key: 'message' }
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
                message: problem.message
            });
        });
    }

    private populateGroupedSheet(
        sheet: ExcelJS.Worksheet, 
        groupedProblems: GroupedProblems, 
        groupName: string
    ): void {
        sheet.columns = [
            { header: groupName, key: 'group' },
            { header: 'Total Problems', key: 'totalProblems' },
            { header: 'Files', key: 'files' }
        ];

        Object.entries(groupedProblems).forEach(([group, problems]) => {
            const uniqueFiles = new Set(problems.map(p => p.filename));
            sheet.addRow({
                group,
                totalProblems: problems.length,
                files: Array.from(uniqueFiles).join(', ')
            });
        });
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
        sheet.columns = [
            { header: 'Metric', key: 'metric' },
            { header: 'Value', key: 'value' }
        ];

        // Total number of problems
        sheet.addRow({
            metric: 'Total Problems',
            value: problems.length
        });

        // Problems by Type
        sheet.addRow({
            metric: 'Problem Types',
            value: Object.keys(groupedProblems.byType).join(', ')
        });

        // Problems by Source
        sheet.addRow({
            metric: 'Problem Sources',
            value: Object.keys(groupedProblems.bySource).join(', ')
        });

        // Unique files with problems
        const uniqueFiles = new Set(problems.map(p => p.filename));
        sheet.addRow({
            metric: 'Files with Problems',
            value: uniqueFiles.size
        });
    }
}
