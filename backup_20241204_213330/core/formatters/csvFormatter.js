"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCsv = void 0;
function formatCsv(problems) {
    const headers = [
        'Type',
        'Code',
        'Source',
        'Filename',
        'Start Line',
        'Start Column',
        'End Line',
        'End Column',
        'Message',
        'Related Information'
    ].join(',');
    const rows = problems.map(problem => {
        const relatedInfo = problem.relatedInfo
            .map(info => `${info.message} (${info.filename}:${info.location.startLine}:${info.location.startColumn})`)
            .join('; ');
        return [
            problem.type,
            problem.code,
            problem.source,
            problem.filename,
            problem.location.startLine,
            problem.location.startColumn,
            problem.location.endLine,
            problem.location.endColumn,
            `"${problem.message.replace(/"/g, '""')}"`,
            `"${relatedInfo.replace(/"/g, '""')}"`
        ].join(',');
    });
    return [headers, ...rows].join('\n');
}
exports.formatCsv = formatCsv;
//# sourceMappingURL=csvFormatter.js.map