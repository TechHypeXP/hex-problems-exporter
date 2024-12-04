import { ProblemRecord, GroupedProblems } from '../types';

export function formatJson(
    allProblems: ProblemRecord[],
    byType: GroupedProblems,
    bySource: GroupedProblems,
    byCode: GroupedProblems
): string {
    const report = {
        summary: {
            totalProblems: allProblems.length,
            byType: Object.fromEntries(
                Object.entries(byType).map(([type, problems]) => [type, problems.length])
            )
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
