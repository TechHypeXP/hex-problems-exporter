# Backup existing structure
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
Write-Host "Creating backup in: $backupDir"
New-Item -Path $backupDir -ItemType Directory
Copy-Item -Path "src/*" -Destination $backupDir -Recurse -Force

# Clean existing structure
Write-Host "Cleaning existing structure..."
Remove-Item -Path "src/*" -Recurse -Force

# Create new directory structure
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

Write-Host "Directory structure created successfully!"
