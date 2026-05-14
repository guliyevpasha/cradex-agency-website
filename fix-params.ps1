# Fix Next.js 16 async params in all page files

$files = @(
    "app\[locale]\about\page.tsx",
    "app\[locale]\contact\page.tsx",
    "app\[locale]\journal\page.tsx",
    "app\[locale]\journal\[slug]\page.tsx",
    "app\[locale]\portfolio\page.tsx",
    "app\[locale]\portfolio\[slug]\page.tsx",
    "app\[locale]\services\page.tsx",
    "app\[locale]\services\[slug]\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Fix single locale param
        $content = $content -replace 'params: \{ locale: string \}', 'params: Promise<{ locale: string }>'
        $content = $content -replace 'params: \{ locale: string; slug: string \}', 'params: Promise<{ locale: string; slug: string }>'
        
        # Fix params.locale usage
        $content = $content -replace '(\w+) = await getTranslations\(\{ locale: params\.locale,', '$1 = await getTranslations({ locale: (await params).locale,'
        $content = $content -replace 'unstable_setRequestLocale\(params\.locale\)', 'unstable_setRequestLocale((await params).locale)'
        $content = $content -replace 'const (\w+) = await get\w+BySlug\(params\.slug\)', 'const $1 = await get' + '$1' + 'BySlug((await params).slug)'
        $content = $content -replace 'await get(\w+)BySlug\(params\.slug\)', 'await get$1BySlug((await params).slug)'
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    }
}

Write-Host "Done!"
