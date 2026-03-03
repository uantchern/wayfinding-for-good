$data = Import-Excel "Charity Advance Search Data export-By Charities.xlsx" -StartRow 2
$nodes = @()
$links = @()

$sectorToDomainMap = @{
    "Social and Welfare" = "dom_social"
    "Health" = "dom_health"
    "Education" = "dom_edu"
    "Arts and Heritage" = "dom_arts"
    "Religious" = "dom_religion"
    "Community" = "dom_community"
    "Sports" = "dom_sports"
    "Others" = "dom_advocacy"
}

foreach ($row in $data) {
    if ([string]::IsNullOrWhiteSpace($row."Name of Organisation")) { continue }
    
    $id = "char_" + $row.UEN
    
    $name = $row."Name of Organisation" -replace '\s+', ' '
    
    $descParams = @()
    if ($row.UEN) { $descParams += "UEN: $($row.UEN)" }
    if ($row.Type) { $descParams += "Type: $($row.Type)" }
    if ($row.Classification) { $descParams += "Classification: $($row.Classification)" }
    if ($row.Activities) { $descParams += "Activities: $($row.Activities)" }
    $desc = $descParams -join " | "
    $desc = $desc -replace '\s+', ' '
    
    $url = "https://www.charities.gov.sg/manage-your-charity/finding-a-charity?keyword=$($row.UEN)"
    
    $domain = $sectorToDomainMap[$row.Sector]
    if (-not $domain) { $domain = "dom_advocacy" }
    
    $nodes += @{
        id = $id
        name = $name
        group = "Charities & VWOs"
        val = 3
        url = $url
        description = $desc
    }
    
    $links += @{
        source = $id
        target = $domain
        relation = "Operates In"
    }
}

$nodesJs = ConvertTo-Json $nodes -Depth 5 -Compress
$linksJs = ConvertTo-Json $links -Depth 5 -Compress

$jsBlock = "
const injectRealCharities = () => {
    const newNodes = $nodesJs;
    const newLinks = $linksJs;
    ecosystemData.nodes = ecosystemData.nodes.concat(newNodes);
    ecosystemData.links = ecosystemData.links.concat(newLinks);
};
injectRealCharities();
"

$file = "index.html"
$content = Get-Content $file -Encoding UTF8 -Raw
$regex = "(?s)const injectRealCharities = \(\) => \{.+?injectRealCharities\(\);"

$match = [regex]::Match($content, $regex)
if ($match.Success) {
    $newContent = $content.Substring(0, $match.Index) + $jsBlock + $content.Substring($match.Index + $match.Length)
    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced successfully."
} else {
    Write-Host "Match failed"
}
