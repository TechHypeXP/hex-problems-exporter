import { Position, Range, DiagnosticSeverity } from 'vscode';
import { Diagnostic, ExportOptions } from '../types/diagnostic.types';
import { expect } from 'chai';
import * as chai from 'chai';

chai.use(require('chai-as-promised'));

export { expect };

export function createPosition(line: number, character: number): Position {
    return {
        line,
        character,
        translate: () => createPosition(0, 0),
        with: () => createPosition(0, 0),
        isBefore: () => false,
        isBeforeOrEqual: () => false,
        isAfter: () => false,
        isAfterOrEqual: () => false,
        isEqual: () => false,
        compareTo: () => 0
    };
}

export function createRange(startLine: number, startChar: number, endLine: number, endChar: number): Range {
    return {
        start: createPosition(startLine, startChar),
        end: createPosition(endLine, endChar),
        isEmpty: false,
        isSingleLine: startLine === endLine,
        contains: () => false,
        isEqual: () => false,
        intersection: () => undefined,
        union: () => createRange(0, 0, 0, 0),
        with: () => createRange(0, 0, 0, 0)
    };
}

export function createDiagnostic(
    id: string,
    message: string,
    severity: DiagnosticSeverity = DiagnosticSeverity.Error,
    line: number = 0,
    character: number = 0,
    source: string = 'test',
    code: string | number = ''
): Diagnostic {
    return {
        id,
        message,
        severity,
        range: createRange(line, character, line, character + message.length),
        source,
        code,
        relatedInformation: [],
        tags: []
    };
}

export const mockDiagnostic = createDiagnostic('TEST-001', 'Test diagnostic');

export const mockExportOptions: ExportOptions = {
  format: 'csv',
  outputPath: 'test.csv',
  includeMetadata: true
};

export class TestConfig {
  static getDiagnosticConfig(): Diagnostic {
    return mockDiagnostic;
  }

  static getTestPath(): string {
    return '/test/path';
  }

  static getDefaultExportOptions(): ExportOptions {
    return mockExportOptions;
  }

  static getTestFilePath(): string {
    return 'test/fixtures/test-file.ts';
  }
}
