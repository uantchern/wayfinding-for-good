$name = "CARITAS HUMANITARIAN AID & RELIEF INITIATIVES (SINGAPORE) LTD."
$safeQuery = $name -replace '[^a-zA-Z0-9\s]', ' ' -replace '\s+', ' '
$safeQuery = $safeQuery.Trim()
$encodedName = [uri]::EscapeDataString($safeQuery)
$url = "https://www.charities.gov.sg/Pages/BasicSearch.aspx?q=$encodedName"
Write-Host $url

$response = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction SilentlyContinue
Write-Host "Status: $($response.StatusCode)"
