# Bütün kateqoriyalı portfolio (arxiv)

Saytda indi yalnız veb sayt layihələri göstərilir. SMM, dizayn, video və s. layihələr Sanity-də qalır, sadəcə saytda görünmür.

- Köhnə səhifə (kateqoriya filtri ilə): `archive/portfolio-all/page.tsx`
- Komponentlər: `components/portfolio/PortfolioFilter.tsx`, `PortfolioGrid.tsx`, `PortfolioCard.tsx` (yerində qalır)

## Yenidən aktiv etmək

1. `lib/site/portfolio.ts` içində `WEBSITES_ONLY = false` edin (detal səhifələri və sitemap yenidən bütün layihələri açır).
2. Filtrli siyahı lazımdırsa, `archive/portfolio-all/page.tsx` faylını `app/[locale]/portfolio/page.tsx` yerinə köçürün.

— Cradex Agency
