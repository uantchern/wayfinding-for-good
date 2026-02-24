<#
.SYNOPSIS
    Exports GEC Survey Responses from Supabase to CSV and emails them automatically.
.DESCRIPTION
    This script connects to your live Supabase database, extracts all rows from the 
    'gec_survey_responses' table, converts them to a nice CSV (which opens easily in Excel), 
    and sends that CSV as an attachment to uantchern@gmail.com using Gmail's SMTP server.

    NOTE: To run this automatically (e.g., via Windows Task Scheduler every Monday morning),
    you must replace `YOUR_GMAIL_USERNAME` and `YOUR_GMAIL_APP_PASSWORD` with real credentials.
    Because Gmail blocks regular passwords for scripts, you must generate a 16-digit "App Password"
    from your Google Account Security settings.
#>

# --- Configuration ---
$SupabaseUrl = "https://xcwqhpwwqcpvgkmsavyv.supabase.co/rest/v1/gec_survey_responses?select=*"
$SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjd3FocHd3cWNwdmdrbXNhdnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjY4MzksImV4cCI6MjA4NzUwMjgzOX0.fm4YAr8Dhki4-Srk1tdmsM572OoXc1Fhvz4AdiC4uBo"

$CsvExportPath = "C:\temp\GEC_Survey_Responses.csv"

# Email Configuration
$EmailTo = "uantchern@gmail.com"
$EmailFrom = "YOUR_GMAIL_USERNAME@gmail.com"      # <-- CHANGE THIS
$AppPassword = "YOUR_GMAIL_APP_PASSWORD"          # <-- CHANGE THIS (16-digit App Password)

$SMTPServer = "smtp.gmail.com"
$SMTPPort = 587

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
Write-Host "3. Sending Email via SMTP..." -ForegroundColor Cyan

# --- 3. Send Email ---
if ($AppPassword -eq "YOUR_GMAIL_APP_PASSWORD") {
    Write-Host "WARNING: Email skipped. You must edit this script and configure your real Gmail App Password to enable automatic mailing." -ForegroundColor Yellow
    exit
}

try {
    $SecurePassword = ConvertTo-SecureString $AppPassword -AsPlainText -Force
    $Credential = New-Object System.Management.Automation.PSCredential ($EmailFrom, $SecurePassword)

    Send-MailMessage -From $EmailFrom `
                     -To $EmailTo `
                     -Subject "Latest GEC Survey Responses (Automated Export)" `
                     -Body "Hello,`n`nPlease find the latest survey responses from the 2025 Governance over Outcomes and Impact Survey attached to this email.`n`nBest regards,`nSSC Automation System" `
                     -SmtpServer $SMTPServer `
                     -Port $SMTPPort `
                     -UseSsl `
                     -Credential $Credential `
                     -Attachments $CsvExportPath

    Write-Host "Email sent successfully to $EmailTo!" -ForegroundColor Green
} catch {
    Write-Error "Failed to send email. Ensure you generated a valid App Password from Google: $_"
}
