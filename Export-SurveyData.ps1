<#
.SYNOPSIS
    Exports GEC Survey Responses from Supabase to CSV.
.DESCRIPTION
    This script connects to your live Supabase database, extracts all rows from the 
    'gec_survey_responses' table, and converts them to a nice CSV (which opens easily in Excel).
#>

# --- Configuration ---
$SupabaseUrl = "https://xcwqhpwwqcpvgkmsavyv.supabase.co/rest/v1/gec_survey_responses?select=*"
$SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjd3FocHd3cWNwdmdrbXNhdnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjY4MzksImV4cCI6MjA4NzUwMjgzOX0.fm4YAr8Dhki4-Srk1tdmsM572OoXc1Fhvz4AdiC4uBo"

$CsvExportPath = "C:\temp\GEC_Survey_Responses.csv"

Write-Host "1. Connecting to Supabase..." -ForegroundColor Cyan

# --- 1. Fetch Data from Supabase ---
$Headers = @{
    "apikey" = $SupabaseAnonKey
    "Authorization" = "Bearer $SupabaseAnonKey"
}

try {
    $Data = Invoke-RestMethod -Uri $SupabaseUrl -Headers $Headers -Method Get
} catch {
    Write-Error "Failed to connect to Supabase: $_"
    exit
}

if ($Data.Count -eq 0) {
    Write-Host "No survey responses found in the database. Exiting." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($Data.Count) survey responses." -ForegroundColor Green
Write-Host "2. Exporting to CSV (Excel compatible)..." -ForegroundColor Cyan

# --- 2. Export to CSV ---
# Ensure the temp folder exists
if (-not (Test-Path "C:\temp")) {
    New-Item -ItemType Directory -Path "C:\temp" | Out-Null
}

$Data | Select-Object id, session_id, role, approver, aware_section45, strategy_alignment, reporting_channels, methodology, created_at | 
    Export-Csv -Path $CsvExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Exported successfully to $CsvExportPath" -ForegroundColor Green
Write-Host "Exported successfully to $CsvExportPath" -ForegroundColor Green
