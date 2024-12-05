import { expect } from 'chai';

// Custom matcher configuration
export const configureCustomMatchers = () => {
  expect.extend({
    toHaveFailed(received: { status: string }) {
      const pass = received.status === 'failed';
      return {
        message: () =>
          `expected status to ${pass ? 'not ' : ''}be 'failed', got '${received.status}'`,
        pass
      };
    }
  });
};

// Test framework configuration
export const testConfig = {
  chai: {
    plugins: ['sinon-chai', 'chai-as-promised']
  },
  jest: {
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    clearTimers: true
  }
} as const;

import { DiagnosticSeverity } from 'vscode';
import { Diagnostic, ExportOptions } from '../types/diagnostic.types';

export const mockDiagnostic: Diagnostic = {
  id: 'TEST-001',
  message: 'Test diagnostic',
  severity: DiagnosticSeverity.Error,
  range: {
    start: { line: 1, character: 0 },
    end: { line: 1, character: 10 }
  },
  source: 'test',
  code: 'TEST-001'
};

export const mockExportOptions: ExportOptions = {
  format: 'csv',
  outputPath: './test-output.csv',
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
