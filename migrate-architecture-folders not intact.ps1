# Migration script
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"

# 1. Backup
Write-Host "Creating backup in: $backupDir"
New-Item -Path $backupDir -ItemType Directory
Copy-Item -Path "src/*" -Destination $backupDir -Recurse -Force

# 2. Clean existing structure
Write-Host "Cleaning existing structure..."
Remove-Item -Path "src/*" -Recurse -Force

# 3. Create new structure
$directories = @(
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

Write-Host "Creating new directory structure..."
foreach ($dir in $directories) {
    New-Item -Path $dir -ItemType Directory -Force
    Write-Host "Created: $dir"
}

# 4. Move and restructure existing files
# Move test setup
if (Test-Path "$backupDir/test/setup.ts") {
    Copy-Item "$backupDir/test/setup.ts" -Destination "src/test/setup/environment.ts"
    Write-Host "Moved: test setup file"
}

# Move formatters
$formatterFiles = Get-ChildItem -Path "$backupDir/core/formatters" -Filter "*.ts" -Recurse
foreach ($file in $formatterFiles) {
    Copy-Item $file.FullName -Destination "src/infrastructure/formatters/"
    Write-Host "Moved formatter: $($file.Name)"
}

# Move types
$typeFiles = Get-ChildItem -Path "$backupDir/core/types" -Filter "*.ts" -Recurse
foreach ($file in $typeFiles) {
    Copy-Item $file.FullName -Destination "src/shared/types/"
    Write-Host "Moved type: $($file.Name)"
}

# Move services
$serviceFiles = Get-ChildItem -Path "$backupDir/core/services" -Filter "*.ts" -Recurse
foreach ($file in $serviceFiles) {
    Copy-Item $file.FullName -Destination "src/application/services/"
    Write-Host "Moved service: $($file.Name)"
}

# 5. Create new core files
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
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Encoding UTF8
    Write-Host "Created file: $($file.Key)"
}

Write-Host "Migration completed successfully!"
Write-Host "Old files backed up to: $backupDir"
Write-Host "Please verify the new structure and update import paths in moved files."
