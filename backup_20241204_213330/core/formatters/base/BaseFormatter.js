"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormatter = void 0;
class BaseFormatter {
    /**
     * Validate problems
     * @param problems Raw problem records
     */
    validateProblems(problems) {
        if (!Array.isArray(problems)) {
            throw new Error('Problems must be an array');
        }
    }
    /**
     * Utility method to group problems
     * @param problems Raw problem records
     * @param groupBy Criteria to group problems
     * @returns Grouped problems
     */
    groupProblems(problems, groupBy) {
        return problems.reduce((acc, problem) => {
            const key = problem[groupBy]?.toString() || 'unknown';
            acc[key] = acc[key] || [];
            acc[key].push(problem);
            return acc;
        }, {});
    }
}
exports.BaseFormatter = BaseFormatter;
//# sourceMappingURL=BaseFormatter.js.map