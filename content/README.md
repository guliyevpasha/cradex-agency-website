# Jurnal məqalələri — iş axını

Məqalələr burada mənbə kimi saxlanılır, sonra bir əmrlə Sanity CMS-ə yüklənir və saytda hər dörd dildə görünür.

```
content/
  articles/          ← məqalələrin mənbəyi (hər fayl = 1 məqalə, 4 dil)
  import/
    articles.ndjson  ← avtomatik yaranır, Sanity-yə yüklənən fayl
    covers/*.webp    ← avtomatik yaranır, hər məqalənin kapak şəkli
```

## 1. Məqalə yazmaq

`content/articles/` qovluğunda yeni `.mjs` faylı yaradın. Şablon:

```js
export default {
  slug: 'url-de-gorunecek-ad',        // dəyişdirilməməlidir — link buna bağlıdır
  category: 'seo',                    // seo | smm | branding | design |
                                      // copywriting | web-dev | marketing-strategy
  author: 'Paşa Quliyev',
  publishedAt: '2026-09-02',          // YYYY-MM-DD

  title:   { az: '', en: '', ru: '', tr: '' },
  excerpt: { az: '', en: '', ru: '', tr: '' },   // 1–2 cümlə, kartda görünür
  body:    { az: ``, en: ``, ru: ``, tr: `` },   // markdown
}
```

Mətndə istifadə oluna bilən formatlar (saytda düzgün göstərilən yalnız bunlardır):

| Yazılış | Nəticə |
|---|---|
| `## Başlıq` | bölmə başlığı |
| `### Alt başlıq` | alt başlıq |
| `**mətn**` | qalın mətn |
| `- bənd` | nöqtəli siyahı |
| `1. bənd` | nömrəli siyahı |
| `> sitat` | sitat bloku |

## 2. Yığmaq

```bash
node scripts/build-articles.mjs
```

Bu əmr hər məqalə üçün kapak şəkli çəkir, mətnləri Sanity formatına çevirir və
`content/import/articles.ndjson` faylını yeniləyir. Sonunda hər məqalənin
dil-dil söz sayını göstərir. Hansısa dil boş qalıbsa, xəbərdarlıq verir.

## 3. Sayta yükləmək

Studio qovluğundan, **bir dəfə** giriş edin:

```bash
npx sanity login
```

Sonra hər yükləmədə:

```bash
npx sanity dataset import "../cradex-agency/content/import/articles.ndjson" production --replace
```

Bu əmr `cradex-sanity-studio` qovluğunda işlədilir. `--replace` o deməkdir ki,
eyni `slug` ilə məqalə artıq varsa, təzəsi ilə əvəz olunur — təkrar yaranmır.
Kapak şəkilləri də bu zaman avtomatik yüklənir; ayrıca token və ya parol
lazım deyil, öz Sanity hesabınızla giriş kifayətdir.

Yükləmədən sonra sayt 60 saniyə ərzində özünü yeniləyir (ISR).

## 4. Nəyi dəyişmək olar, nəyi yox

- **Mətni, başlığı, şəkli** istənilən vaxt dəyişib yenidən yükləmək olar.
- **`slug`-u dəyişmək** məqalənin linkini dəyişir — Google-dakı köhnə link
  ölür. Zərurət olmasa toxunmayın.
- Sanity Studio-da əl ilə edilən dəyişiklik növbəti `--replace` yükləməsində
  itir. Ona görə düzəlişlər burada, mənbə faylında edilməlidir.
