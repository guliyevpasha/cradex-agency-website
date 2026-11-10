#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Portfolio səhifələrini revalidate etmək üçün PowerShell skripti
    
.DESCRIPTION
    Bu skript Sanity CMS-də dəyişdirilən portfolio məzmununu 
    canlı saytda dərhal yeniləmək üçün istifadə olunur.
    
.PARAMETER Slug
    Portfolio item-ın slug-ı (məsələn: sued-s-b-ti)
    
.PARAMETER Type
    Content type (default: portfolioItem)
    
.PARAMETER Environment
    Production və ya local (default: production)
    
.EXAMPLE
    .\scripts\revalidate-portfolio.ps1 -Slug "sued-s-b-ti"
    
.EXAMPLE
    .\scripts\revalidate-portfolio.ps1 -Slug "sued-s-b-ti" -Environment local

.AUTHOR
    Paşa Quliyev — Cradex Agency
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Slug,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('portfolio', 'portfolioItem', 'workCase')]
    [string]$Type = 'portfolioItem',
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('production', 'local')]
    [string]$Environment = 'production'
)

# .env.local faylından REVALIDATION_TOKEN oxu
$envPath = Join-Path $PSScriptRoot ".." ".env.local"

if (-not (Test-Path $envPath)) {
    Write-Error ".env.local fayli tapilmadi: $envPath"
    exit 1
}

$token = Get-Content $envPath | 
    Where-Object { $_ -match '^REVALIDATION_TOKEN=' } | 
    ForEach-Object { $_ -replace '^REVALIDATION_TOKEN=', '' } |
    Select-Object -First 1

if (-not $token) {
    Write-Error "REVALIDATION_TOKEN .env.local faylinda tapilmadi"
    exit 1
}

# URL müəyyən et
$baseUrl = if ($Environment -eq 'local') { 
    "http://localhost:3000" 
} else { 
    "https://cradexagency.com" 
}

$url = "$baseUrl/api/revalidate"

# Request göndər
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    _type = $Type
    slug = $Slug
} | ConvertTo-Json

Write-Host "🔄 Revalidation başladı..." -ForegroundColor Cyan
Write-Host "   Slug: $Slug" -ForegroundColor Gray
Write-Host "   Type: $Type" -ForegroundColor Gray
Write-Host "   Environment: $Environment" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "✅ Uğurla revalidate edildi!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Yenilənən səhifələr:" -ForegroundColor Yellow
        $result.paths | ForEach-Object {
            Write-Host "   • $_" -ForegroundColor Gray
        }
        Write-Host ""
        Write-Host "🌐 Səhifəni yoxlayın:" -ForegroundColor Cyan
        $result.paths | Where-Object { $_ -match "^/az/portfolio/$Slug$" } | ForEach-Object {
            Write-Host "   $baseUrl$_" -ForegroundColor Blue
        }
    } else {
        Write-Error "❌ Revalidation uğursuz oldu"
        Write-Host $response.Content -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Error "Xeta bash verdi: $_"
    exit 1
}
