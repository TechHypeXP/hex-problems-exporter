# setup.ps1

# Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
New-Item -Path $backupDir -ItemType Directory
Copy-Item -Path "src/*" -Destination $backupDir -Recurse

# Clean and create new structure
Remove-Item -Path "src/*" -Recurse -Force

$structure = @(
    "src/application/commands",
    "src/application/services",
    "src/application/ports",
    "src/domain/models",
    "src/domain/events",
    "src/domain/repositories",
    "src/infrastructure/vscode/commands",
    "src/infrastructure/vscode/providers",
    "src/infrastructure/formatters",
    "src/infrastructure/persistence",
    "src/test/fixtures",
    "src/test/integration",
    "src/test/unit",
    "src/test/setup",
    "src/shared/types",
    "src/shared/errors",
    "src/shared/logging",
    "src/shared/config"
)

foreach ($dir in $structure) {
    New-Item -Path $dir -ItemType Directory -Force
}

# Create core files
$files = @{
    "src/shared/types/problems.ts" = @'
import { DiagnosticSeverity } from "vscode";

export interface Problem {
    id: string;
    message: string;
    severity: DiagnosticSeverity;
    location: CodeLocation;
}

export interface CodeLocation {
    file: string;
    line: number;
    column: number;
}
'@

    "src/domain/repositories/IProblemRepository.ts" = @'
import { Problem } from "../../shared/types/problems";

export interface IProblemRepository {
    getProblems(): Promise<Problem[]>;
    exportProblems(format: string): Promise<void>;
}
'@

    "src/infrastructure/vscode/providers/VSCodeProblemProvider.ts" = @'
import * as vscode from "vscode";
import { IProblemRepository } from "../../../domain/repositories/IProblemRepository";
import { Problem } from "../../../shared/types/problems";

export class VSCodeProblemProvider implements IProblemRepository {
    constructor(private readonly diagnostics: vscode.DiagnosticCollection) {}

    async getProblems(): Promise<Problem[]> {
        // Implementation
        return [];
    }

    async exportProblems(format: string): Promise<void> {
        // Implementation
    }
}
'@

    "src/test/setup/test-environment.ts" = @'
import * as chai from "chai";
import { MockProblemProvider } from "../fixtures/MockProblemProvider";

declare global {
    var expect: Chai.ExpectStatic;
    var mockProvider: MockProblemProvider;
}

Object.assign(global, { 
    expect: chai.expect,
    mockProvider: new MockProblemProvider()
});
'@
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Encoding UTF8
}

# Update package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$packageJson.scripts.test = "mocha -r ts-node/register src/test/**/*.test.ts"
$packageJson | ConvertTo-Json | Set-Content "package.json"
'@
