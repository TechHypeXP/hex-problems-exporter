"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJson = void 0;
function formatJson(allProblems, byType, bySource, byCode) {
    const report = {
        summary: {
            totalProblems: allProblems.length,
            byType: Object.fromEntries(Object.entries(byType).map(([type, problems]) => [type, problems.length]))
        },
        problems: {
            all: allProblems,
            byType,
            bySource,
            byCode
        }
    };
    return JSON.stringify(report, null, 2);
}
exports.formatJson = formatJson;
//# sourceMappingURL=jsonFormatter.js.map