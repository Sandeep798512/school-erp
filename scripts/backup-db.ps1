# Disaster Recovery & Database Backup Script for School ERP Platform
param (
    [string]$DbUrl = $env:DATABASE_URL,
    [string]$BackupDir = "./backups"
)

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
if (-not (Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$BackupFile = "$BackupDir/school_erp_backup_$Timestamp.sql"
Write-Host "Starting PostgreSQL backup to $BackupFile..."

# Execute pg_dump
try {
    docker exec -t school-erp-postgres pg_dumpall -c -U postgres > $BackupFile
    Write-Host "Backup completed successfully: $BackupFile" -ForegroundColor Green
} catch {
    Write-Host "Backup failed: $_" -ForegroundColor Red
}
