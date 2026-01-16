# Script to remove test.step() from all test files
# This PowerShell script will identify remaining files with test.step() usage

Write-Host "Finding all test files with test.step() usage..." -ForegroundColor Cyan

$testFiles = Get-ChildItem -Path "tests" -Recurse -Filter "*.spec.ts" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "test\.step\("
}

Write-Host "Found $($testFiles.Count) test files still using test.step():" -ForegroundColor Yellow

foreach ($file in $testFiles) {
    Write-Host "  - $($file.FullName)" -ForegroundColor White
}

Write-Host "`nThese files need manual review to remove test.step() usage" -ForegroundColor Green
Write-Host "The Steps layer @step decorator provides equivalent reporting functionality" -ForegroundColor Green
