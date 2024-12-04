import { formatMarkdown } from './markdownFormatter';
import { formatJson } from './jsonFormatter';
import { formatCsv } from './csvFormatter';
import { formatXlsx } from './xlsxFormatter';

export {
  formatMarkdown,
  formatJson,
  formatCsv,
  formatXlsx
};

export * from './base/BaseFormatter';

export const formatters = {
    markdown: formatMarkdown,
    json: formatJson,
    csv: formatCsv,
    xlsx: formatXlsx
};

export const supportedFormats = Object.keys(formatters);

export function getFormatter(format: string): (data: any) => any {
    const lowercaseFormat = format.toLowerCase();
    if (!(lowercaseFormat in formatters)) {
        throw new Error(`Unsupported format: ${format}`);
    }
    return formatters[lowercaseFormat as keyof typeof formatters];
}
