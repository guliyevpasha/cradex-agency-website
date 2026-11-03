# Kalkulyator (arxiv)

Qiymət kalkulyatoru saytdan müvəqqəti çıxarılıb. Kod silinməyib.

- Səhifə: `archive/calculator/page.tsx`
- Komponentlər: `components/calculator/*` (yerində qalır, testlər də işləyir)
- Test: `archive/calculator/calculator.test.ts` (`tests/` qovluğuna qaytarın; `calculatorUtils` faylı əvvəldən çatışmır, onu da bərpa etmək lazımdır)
- Mətnlər: `messages/*.json` → `calculator` açarı

## Yenidən aktiv etmək

1. `archive/calculator/page.tsx` faylını `app/[locale]/calculator/page.tsx` yerinə köçürün.
2. `next.config.mjs` içindəki `/calculator` → `/pricing` yönləndirməsini silin.
3. Menyuya link lazımdırsa, `lib/site/navigation.ts` faylına əlavə edin.

— Cradex Agency
