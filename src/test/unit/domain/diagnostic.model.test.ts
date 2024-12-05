import { DiagnosticSeverity } from 'vscode';
import { Diagnostic } from '../../../domain/models';

describe('Diagnostic Model', () => {
  it('should create a diagnostic with all properties', () => {
    const diagnostic = new Diagnostic(
      'Test message',
      DiagnosticSeverity.Error,
      {
        start: { line: 1, character: 1 },
        end: { line: 1, character: 2 }
      },
      'test',
      'TEST001'
    );

    expect(diagnostic.message).toBe('Test message');
    expect(diagnostic.severity).toBe(DiagnosticSeverity.Error);
    expect(diagnostic.range).toEqual({
      start: { line: 1, character: 1 },
      end: { line: 1, character: 2 }
    });
    expect(diagnostic.source).toBe('test');
    expect(diagnostic.code).toBe('TEST001');
  });

  it('should create a diagnostic with optional properties undefined', () => {
    const diagnostic = new Diagnostic(
      'Test message',
      DiagnosticSeverity.Error,
      {
        start: { line: 1, character: 1 },
        end: { line: 1, character: 2 }
      }
    );

    expect(diagnostic.source).toBeUndefined();
    expect(diagnostic.code).toBeUndefined();
  });
});
