# Sanity CMS — İdarəetmə Paneli

Cradex Agency veb-saytının **Journal (blog)** və **Portfolio** bölmələri Sanity CMS ilə idarə olunur.
Yeni məqalə və ya portfolio işi əlavə etmək üçün kod yazmağa ehtiyac yoxdur.

---

## 1. Sanity Hesabı Yaradın

1. [sanity.io](https://sanity.io) saytına daxil olun
2. "Start for free" düyməsinə klikləyin
3. Yeni layihə yaradın: **"cradex-agency"**
4. Dataset: **production**

---

## 2. Project ID-ni Əldə Edin

1. [sanity.io/manage](https://sanity.io/manage) → layihənizi seçin
2. **Settings → API** bölməsinə keçin
3. **Project ID**-ni kopyalayın

---

## 3. Environment Variables Qurun

`.env.local.example` faylını `.env.local` adı ilə kopyalayın:

```bash
cp .env.local.example .env.local
```

Sonra `.env.local` faylını açıb `NEXT_PUBLIC_SANITY_PROJECT_ID` dəyərini doldurun:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## 4. Sanity Studio-ya Daxil Olun

Layihəni işə salın:

```bash
npm run dev
```

Brauzerdə açın: **http://localhost:3000/studio**

Sanity hesabınızla daxil olun. İdarəetmə paneli açılacaq.

---

## 5. Məzmun Əlavə Etmək

### Yeni Məqalə (Journal)

1. Sol menyudan **📝 Məqalələr** seçin
2. **+ New Article** düyməsinə klikləyin
3. Doldurun:
   - **Başlıq** — məqalənin adı
   - **Slug** — URL (avtomatik yaranır, dəyişə bilərsiniz)
   - **Qısa xülasə** — kart üçün qısa mətn (max 200 simvol)
   - **Məzmun** — tam məqalə mətni (rich text editor)
   - **Kateqoriya** — SEO, SMM, Brendinq və s.
   - **Müəllif** — ad, vəzifə, şəkil
   - **Örtük şəkli** — məqalənin baş şəkli
   - **Yayım tarixi**
   - **Dil** — AZ, EN, RU, TR
4. **Publish** düyməsinə klikləyin

### Yeni Portfolio İşi

1. Sol menyudan **🖼️ Portfolio İşləri** seçin
2. **+ New Portfolio Item** düyməsinə klikləyin
3. Doldurun:
   - **Layihə adı**
   - **Müştəri adı**
   - **Xidmət kateqoriyası**
   - **Örtük şəkli** — əsas şəkil
   - **Qalereya** — əlavə şəkillər
   - **Təsvir** — layihə haqqında məlumat
   - **Alətlər** — istifadə olunan texnologiyalar
   - **Nəticələr** — əldə edilən nəticələr
   - **Əsas səhifədə göstər** — ✅ işarələyin ki, home page-də görünsün
4. **Publish** düyməsinə klikləyin

---

## 6. Şəkil Tövsiyələri

| Bölmə | Ölçü | Format |
|---|---|---|
| Məqalə örtük şəkli | 1200×630 px | WebP/JPG |
| Portfolio örtük şəkli | 800×600 px | WebP/JPG |
| Müəllif avatarı | 200×200 px | WebP/JPG |
| Portfolio qalereya | 1200×800 px | WebP/JPG |

---

## 7. Vercel-də Deploy

Vercel Dashboard-da aşağıdakı environment variables əlavə edin:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = 7ia9tt83
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SANITY_API_VERSION = 2024-01-01
NEXT_PUBLIC_WHATSAPP_NUMBER = 994507786887
NEXT_PUBLIC_SITE_URL = https://cradexagency.com
REVALIDATION_TOKEN = <gizli — Vercel-də saxlanılır>
```

Tam siyahı, dəyişən tipləri və webhook konfiqurasiyası: **[VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)**.

---

## 8. CORS Ayarları (Production üçün)

[sanity.io/manage](https://sanity.io/manage) → **API → CORS Origins** bölməsinə:

```
https://cradexagency.com
https://www.cradexagency.com
```

əlavə edin.

---

## Suallar?

Hər hansı problem yaranarsa, [Sanity Documentation](https://www.sanity.io/docs) saytına baxın.
