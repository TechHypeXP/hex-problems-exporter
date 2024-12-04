import { ProblemRecord, GroupedProblems } from '../types';

export function formatMarkdown(
    allProblems: ProblemRecord[],
    byType: GroupedProblems,
    bySource: GroupedProblems,
    byCode: GroupedProblems
): string {
    let report = '# Problems Report\n\n';

    // Summary
    report += '## Summary\n\n';
    report += `Total Problems: ${allProblems.length}\n`;
    Object.entries(byType).forEach(([type, problems]) => {
        report += `- ${type}: ${problems.length}\n`;
    });

    // Problems by Type
    report += '\n## Problems by Type\n\n';
    Object.entries(byType).forEach(([type, problems]) => {
        report += `### ${type} (${problems.length})\n\n`;
        problems.forEach(problem => formatProblem(problem, report));
    });

    // Problems by Source
    report += '\n## Problems by Source\n\n';
    Object.entries(bySource).forEach(([source, problems]) => {
        report += `### ${source} (${problems.length})\n\n`;
        problems.forEach(problem => formatProblem(problem, report));
    });

    // Problems by Error Code
    report += '\n## Problems by Error Code\n\n';
    Object.entries(byCode).forEach(([code, problems]) => {
        report += `### ${code} (${problems.length})\n\n`;
        problems.forEach(problem => formatProblem(problem, report));
    });

    return report;
}

function formatProblem(problem: ProblemRecord, report: string): void {
    report += `#### ${problem.message}\n`;
    report += `- File: \`${problem.filename}\`\n`;
    report += `- Location: Line ${problem.location.startLine}, Column ${problem.location.startColumn}\n`;
    report += `- Type: ${problem.type}\n`;
    report += `- Code: ${problem.code}\n`;
    report += `- Source: ${problem.source}\n`;

    if (problem.relatedInfo.length > 0) {
        report += '- Related Information:\n';
        problem.relatedInfo.forEach(info => {
            report += `  - ${info.message}\n`;
            report += `    at \`${info.filename}\` Line ${info.location.startLine}, Column ${info.location.startColumn}\n`;
        });
    }

    report += '\n';
}
