# Migration script with exact structure preservation
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"

# Create backup with exact structure
Write-Host "Creating exact backup in: $backupDir"
New-Item -Path $backupDir -ItemType Directory
robocopy "src" "$backupDir/src" /E /MIR

# Clean and create new structure
Write-Host "Cleaning existing structure..."
Remove-Item -Path "src/*" -Recurse -Force

# Create new directories
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

# Move files to new structure
Write-Host "Moving files to new structure..."

# Function to copy preserving structure
function Copy-PreservingStructure {
    param (
        [string]$sourceRoot,
        [string]$targetRoot,
        [string]$pattern
    )
    
    Get-ChildItem -Path $sourceRoot -Filter $pattern -Recurse | ForEach-Object {
        $targetPath = $_.FullName.Replace($sourceRoot, $targetRoot)
        $targetDir = Split-Path -Parent $targetPath
        
        if (!(Test-Path $targetDir)) {
            New-Item -Path $targetDir -ItemType Directory -Force
        }
        Copy-Item $_.FullName -Destination $targetPath -Force
    }
}

# Map old paths to new paths
$pathMappings = @{
    "$backupDir/src/test" = "src/test"
    "$backupDir/src/core/formatters" = "src/infrastructure/formatters"
    "$backupDir/src/core/types" = "src/shared/types"
    "$backupDir/src/core/services" = "src/application/services"
}

foreach ($mapping in $pathMappings.GetEnumerator()) {
    if (Test-Path $mapping.Key) {
        Copy-PreservingStructure -sourceRoot $mapping.Key -targetRoot $mapping.Value -pattern "*.ts"
        Write-Host "Moved files from $($mapping.Key) to $($mapping.Value)"
    }
}

Write-Host "Migration completed successfully!"
Write-Host "Old files backed up exactly to: $backupDir"
Write-Host "Please verify the new structure and update import paths in moved files."
