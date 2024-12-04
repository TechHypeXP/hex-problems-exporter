/**
 * Hex Problems Exporter - Problem Collector Unit Tests
 * 
 * @file problemCollector.test.ts
 * @description Unit tests for the ProblemCollector service
 * @version 1.1.0
 * 
 * @author Hex Problems Exporter Team
 * @copyright (c) 2024 Hex Problems Exporter
 * @license MIT
 * 
 * @created 2024-01-05
 * @updated 2024-01-05
 * 
 * @dependencies 
 * - chai
 * - sinon
 * - vscode
 * 
 * @testSuite ProblemCollector
 * - Tests problem collection functionality
 * - Verifies problem grouping methods
 * - Handles edge cases and empty scenarios
 */

import { expect } from 'chai';
import { ProblemCollector } from '../../core/services/ProblemCollector';
import * as vscode from 'vscode';
import sinon from 'sinon';

describe('ProblemCollector', () => {
    let problemCollector: ProblemCollector | null = null;
    let diagnosticCollectionStub: sinon.SinonStubbedInstance<vscode.DiagnosticCollection>;

    beforeEach(() => {
        // Create a stub for vscode.DiagnosticCollection
        diagnosticCollectionStub = sinon.createStubInstance(vscode.DiagnosticCollection);
        
        // Initialize ProblemCollector with the stub
        problemCollector = new ProblemCollector(diagnosticCollectionStub);
    });

    describe('collectProblems', () => {
        it('should collect problems from multiple workspaces', () => {
            // Mock workspace folders
            const workspaceFolders: vscode.WorkspaceFolder[] = [
                { uri: vscode.Uri.file('/path/to/workspace1'), name: 'Workspace1', index: 0 },
                { uri: vscode.Uri.file('/path/to/workspace2'), name: 'Workspace2', index: 1 }
            ];

            // Stub vscode.workspace.workspaceFolders
            const workspaceFoldersStub = sinon.stub(vscode.workspace, 'workspaceFolders').value(workspaceFolders);

            // Stub diagnosticCollectionStub to return mock diagnostics
            const mockDiagnostics: vscode.Diagnostic[] = [
                new vscode.Diagnostic(
                    new vscode.Range(0, 0, 0, 10), 
                    'Test error', 
                    vscode.DiagnosticSeverity.Error
                )
            ];
            diagnosticCollectionStub.get.returns(mockDiagnostics);

            // Collect problems
            const problems = problemCollector?.collectProblems();

            // Assertions
            expect(problems).to.be.an('array');
            expect(problems?.length).to.be.greaterThan(0);
            expect(problems?.[0]).to.have.property('severity');
            expect(problems?.[0]).to.have.property('message');
            expect(problems?.[0]).to.have.property('source');

            // Restore stubs
            workspaceFoldersStub.restore();
        });

        it('should handle empty workspace', () => {
            // Stub vscode.workspace.workspaceFolders to return null
            const workspaceFoldersStub = sinon.stub(vscode.workspace, 'workspaceFolders').value(null);

            // Collect problems
            const problems = problemCollector?.collectProblems();

            // Assertions
            expect(problems).to.be.an('array');
            expect(problems?.length).to.equal(0);

            // Restore stubs
            workspaceFoldersStub.restore();
        });
    });

    describe('groupProblems', () => {
        it('should group problems by severity', () => {
            const problems = [
                { severity: vscode.DiagnosticSeverity.Error, message: 'Error 1' },
                { severity: vscode.DiagnosticSeverity.Warning, message: 'Warning 1' },
                { severity: vscode.DiagnosticSeverity.Error, message: 'Error 2' }
            ];

            const groupedProblems = problemCollector?.groupProblems(problems);

            expect(groupedProblems).to.have.property('errors');
            expect(groupedProblems).to.have.property('warnings');
            expect(groupedProblems?.errors.length).to.equal(2);
            expect(groupedProblems?.warnings.length).to.equal(1);
        });
    });

    afterEach(() => {
        sinon.restore();
    });
});
