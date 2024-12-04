/**
 * Interface for problem formatters
 * @interface IFormatter
 * @description Defines the contract for problem report formatters
 */
export interface IFormatter {
    /**
     * Format problems into a specific output format
     * @param problems Raw problem records
     * @param groupedProblems Problems grouped by various criteria
     * @param options Optional formatting options
     * @returns Promise resolving to a formatted buffer
     */
    format(
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
    getFileExtension(): string;
}

import { ProblemRecord, GroupedProblems, FormatterOptions } from '../../types';
