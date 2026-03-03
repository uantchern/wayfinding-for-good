$data = Import-Excel "Charity Advance Search Data export-By Charities.xlsx" -StartRow 2
$nodes = New-Object System.Collections.ArrayList
$links = New-Object System.Collections.ArrayList

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
    if (-not $row."Name of Organisation") { continue }
    
    $id = "char_" + $row.UEN
    $name = $row."Name of Organisation"
    $name = $name -replace '"','\"' -replace "`n", " " -replace "`r", "" -replace "`s+", " "
    $desc = "UEN: $($row.UEN) | Type: $($row.Type) | Classification: $($row.Classification) | Activities: $($row.Activities)"
    $desc = $desc -replace '"','\"' -replace "`n", " " -replace "`r", "" -replace "`s+", " "
    
    $url = "https://www.charities.gov.sg/manage-your-charity/finding-a-charity/profile?uen=$($row.UEN)"
    
    $domain = $sectorToDomainMap[$row.Sector]
    if (-not $domain) { $domain = "dom_advocacy" }
    
    [void]$nodes.Add("{ `"id`": `"$id`", `"name`": `"$name`", `"group`": `"Charities & VWOs`", `"val`": 3, `"url`": `"$url`", `"description`": `"$desc`" }")
    [void]$links.Add("{ `"source`": `"$id`", `"target`": `"$domain`", `"relation`": `"Operates In`" }")
}

$nodesJs = "[`n" + ($nodes -join ",`n") + "`n]"
$linksJs = "[`n" + ($links -join ",`n") + "`n]"

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
$newContent = $content -replace $regex, $jsBlock
[System.IO.File]::WriteAllText((Resolve-Path $file).Path, $newContent, [System.Text.Encoding]::UTF8)
