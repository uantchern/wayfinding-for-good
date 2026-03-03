param(
    [int]$Count = 10
)

Add-Type -AssemblyName System.Net.Http

$SupabaseUrl = "https://xcwqhpwwqcpvgkmsavyv.supabase.co/rest/v1/gec_survey_responses"
$SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjd3FocHd3cWNwdmdrbXNhdnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjY4MzksImV4cCI6MjA4NzUwMjgzOX0.fm4YAr8Dhki4-Srk1tdmsM572OoXc1Fhvz4AdiC4uBo"

function Run-Simulation {
    param([int]$SimCount)
    Write-Host "Simulating $SimCount concurrent submissions..." -ForegroundColor Cyan
    
    $client = [System.Net.Http.HttpClient]::new()
    $client.DefaultRequestHeaders.Add("apikey", $SupabaseAnonKey)
    $client.DefaultRequestHeaders.Add("Authorization", "Bearer $SupabaseAnonKey")

    $tasks = @()

    for ($i = 1; $i -le $SimCount; $i++) {
        $guid = [guid]::NewGuid().ToString().Substring(0,8)
        $bodyText = @"
{
    "session_id": "sim_load_$guid",
    "role": "Simulated Load Tester",
    "approver": "Full Board of Directors",
    "aware_section45": "Yes, I acknowledge.",
    "strategy_alignment": "[Auto-Transcribed]: Load test strategy message from concurrent user $i",
    "reporting_channels": "Simulation Dashboard",
    "methodology": "[Auto-Transcribed]: Load test methodology message from concurrent user $i"
}
"@
        $content = [System.Net.Http.StringContent]::new($bodyText, [System.Text.Encoding]::UTF8, "application/json")
        $tasks += $client.PostAsync($SupabaseUrl, $content)
    }

    # Wait for all simultaneous tasks to finish
    [System.Threading.Tasks.Task]::WaitAll($tasks)
    
    $success = 0
    foreach ($task in $tasks) {
        if ($task.Result.IsSuccessStatusCode) {
            $success++
        }
    }
    
    Write-Host "Completed $SimCount simultaneous submissions. Successful insertions: $success!" -ForegroundColor Green
    $client.Dispose()
}

# Run the 10, 50, and 100 simulation load tests safely.
Run-Simulation -SimCount 10
Start-Sleep -Seconds 2

Run-Simulation -SimCount 50
Start-Sleep -Seconds 2

Run-Simulation -SimCount 100

Write-Host "All load tests complete! Checking total DB count..." -ForegroundColor Cyan
