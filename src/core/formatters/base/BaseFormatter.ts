/**
 * Abstract base class for problem formatters
 * @abstract
 * @class BaseFormatter
 * @implements {IFormatter}
 */
import { IFormatter } from '../interfaces/IFormatter';
import { 
    ProblemRecord, 
    GroupedProblems, 
    FormatterOptions 
} from '../../types';

export abstract class BaseFormatter implements IFormatter {
    /**
     * Abstract method to format problems
     * @param problems Raw problem records
     * @param groupedProblems Problems grouped by various criteria
     * @param options Optional formatting options
     * @returns Promise resolving to a formatted buffer
     */
    abstract format(
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        },
        options?: FormatterOptions
    ): Promise<Buffer>;

    /**
     * Get the file extension for the current formatter
     * @returns File extension string
     */
    abstract getFileExtension(): string;

    /**
     * Utility method to group problems
     * @param problems Raw problem records
     * @param groupBy Criteria to group problems
     * @returns Grouped problems
     */
    protected groupProblems(
        problems: ProblemRecord[], 
        groupBy: 'type' | 'source' | 'code'
    ): ProblemRecord[] {
        const grouped: { [key: string]: ProblemRecord[] } = {};
        
        problems.forEach(problem => {
            const key = this.getGroupKey(problem, groupBy);
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(problem);
        });

        return Object.entries(grouped)
            .map(([groupName, groupProblems]) => ({
                groupName,
                problems: groupProblems
            }));
    }

    /**
     * Get the group key for a problem
     * @param problem Problem record
     * @param groupBy Grouping criteria
     * @returns Group key string
     */
    private getGroupKey(
        problem: ProblemRecord, 
        groupBy: 'type' | 'source' | 'code'
    ): string {
        switch (groupBy) {
            case 'type':
                return problem.type || 'Unknown';
            case 'source':
                return problem.source || 'Unknown';
            case 'code':
                return problem.code?.toString() || 'No Code';
        }
    }
}
