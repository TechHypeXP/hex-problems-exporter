export type ExportFormat = 'csv' | 'excel';

export interface ExportOptions {
    format: ExportFormat;
    outputPath: string;
    includeMetadata?: boolean;
}
