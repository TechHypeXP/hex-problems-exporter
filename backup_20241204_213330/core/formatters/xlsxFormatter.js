"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatXlsx = exports.XlsxFormatter = void 0;
const exceljs_1 = require("exceljs");
const BaseFormatter_1 = require("./base/BaseFormatter");
class XlsxFormatter extends BaseFormatter_1.BaseFormatter {
    async format(problems, groupedProblems) {
        this.validateProblems(problems);
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet('Problems');
        worksheet.columns = [
            { header: 'File', key: 'filename' },
            { header: 'Type', key: 'type' },
            { header: 'Message', key: 'message' },
            { header: 'Start Line', key: 'startLine' },
            { header: 'Start Column', key: 'startColumn' },
            { header: 'End Line', key: 'endLine' },
            { header: 'End Column', key: 'endColumn' },
            { header: 'Source', key: 'source' },
            { header: 'Code', key: 'code' },
            { header: 'Severity', key: 'severity' }
        ];
        problems.forEach(problem => {
            worksheet.addRow({
                filename: problem.filename,
                type: problem.type,
                message: problem.message,
                startLine: problem.location.startLine,
                startColumn: problem.location.startColumn,
                endLine: problem.location.endLine,
                endColumn: problem.location.endColumn,
                source: problem.source,
                code: problem.code,
                severity: problem.severity
            });
        });
        // Add grouped problems sheets
        this.addGroupedSheet(workbook, 'By Type', groupedProblems.byType);
        this.addGroupedSheet(workbook, 'By Source', groupedProblems.bySource);
        this.addGroupedSheet(workbook, 'By Code', groupedProblems.byCode);
        return workbook.xlsx.writeBuffer();
    }
    addGroupedSheet(workbook, name, grouped) {
        const sheet = workbook.addWorksheet(name);
        sheet.columns = [
            { header: 'Group', key: 'group' },
            { header: 'Count', key: 'count' }
        ];
        Object.entries(grouped).forEach(([group, problems]) => {
            sheet.addRow({
                group,
                count: problems.length
            });
        });
    }
    getFileExtension() {
        return 'xlsx';
    }
}
exports.XlsxFormatter = XlsxFormatter;
exports.formatXlsx = new XlsxFormatter();
//# sourceMappingURL=xlsxFormatter.js.map