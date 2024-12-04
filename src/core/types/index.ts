export type OutputFormat = 'markdown' | 'json' | 'csv' | 'xlsx' | 'xls';

export interface ProblemLocation {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}

export interface RelatedInformation {
    location: ProblemLocation;
    message: string;
    filename: string;
}

export interface ProblemRecord {
    filename: string;
    type: string;
    code: string | number | undefined;
    location: ProblemLocation;
    message: string;
    source: string;
    severity: number;
    relatedInfo: RelatedInformation[];
}

export interface GroupedProblems {
    [key: string]: ProblemRecord[];
}

export interface FormatterOptions {
    groupBy?: 'type' | 'source' | 'code';
    includeDetails?: boolean;
}

export interface IFormatter {
    format(
        problems: ProblemRecord[],
        groupedProblems: {
            byType: GroupedProblems;
            bySource: GroupedProblems;
            byCode: GroupedProblems;
        },
        options?: FormatterOptions
    ): Promise<Buffer>;
    getFileExtension(): string;
}
