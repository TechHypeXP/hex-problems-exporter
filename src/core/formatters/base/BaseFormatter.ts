/**
 * Abstract base class for problem formatters
 * @abstract
 * @class BaseFormatter
 */
import { ProblemRecord, GroupedProblems } from '../../types/problems/ProblemTypes';

export abstract class BaseFormatter {
    /**
     * Abstract method to format problems
     * @param problems Raw problem records
     * @param groupedProblems Grouped problems
     * @returns Promise resolving to a formatted buffer
     */
    abstract format(
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        }
    ): Promise<string | Buffer>;

    /**
     * Abstract method to get the file extension
     * @returns File extension
     */
    abstract getFileExtension(): string;

    /**
     * Validate problems
     * @param problems Raw problem records
     */
    protected validateProblems(problems: ProblemRecord[]): void {
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
    protected groupProblems(problems: ProblemRecord[], groupBy: keyof ProblemRecord): GroupedProblems {
        return problems.reduce((acc, problem) => {
            const key = problem[groupBy]?.toString() || 'unknown';
            acc[key] = acc[key] || [];
            acc[key].push(problem);
            return acc;
        }, {} as GroupedProblems);
    }
}
