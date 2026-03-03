$name = "A i tance and `n Liai on - s S"
$name = [Text.RegularExpressions.Regex]::Replace($name, '\s+', ' ')
Write-Host $name
