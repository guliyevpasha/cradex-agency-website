# Sanity Webhook Konfiqurasiyası

Bu sənəd Sanity Studio-da webhook qurmağı izah edir ki, admin paneldə dəyişikliklər avtomatik olaraq canlı saytda görünsün.

## Webhook Nədir?

Webhook Sanity Studio-da hər dəfə content publish və ya update edəndə avtomatik olaraq canlı sayta bildiriş göndərir. Bu bildiriş saytın cache-ini təmizləyir və yeni məlumatları göstərir.

## Quraşdırma Addımları

### 1. Sanity Manage Panelə Daxil Olun

https://sanity.io/manage → **Cradex Agency** layihəsini seçin

### 2. API Bölməsinə Keçin

Sol menyudan **API** → **Webhooks** seçin

### 3. Yeni Webhook Yaradın

**"Create webhook"** düyməsinə klikləyin və aşağıdakı məlumatları daxil edin:

#### Ümumi Parametrlər:
- **Name**: `Production Site Revalidation`
- **Description**: `Automatically updates cradexagency.com when content is published`
- **URL**: `https://cradexagency.com/api/revalidate`
- **Dataset**: `production`
- **Trigger on**: `Create`, `Update`, `Delete` (hamısını seçin)
- **HTTP method**: `POST`
- **HTTP Headers**:
  ```
  Authorization: Bearer 2c1c6a4b03ff9a518aca57d6ee06baf4e0b6927c2041f32c11cf62c4456593d7
  Content-Type: application/json
  ```
- **API version**: `v2021-10-21` (və ya ən son versiya)

#### Projection (Request Body):
```groq
{
  "_type": _type,
  "slug": slug.current,
  "previousSlug": ^.slug.current
}
```

#### Filter (İstəyə bağlı - yalnız vacib content type-lar üçün):
```groq
_type in ["portfolio", "blog", "testimonial", "partner", "comboPackage"]
```

### 4. Test Edin

- **"Test webhook"** düyməsinə klikləyin
- Response status **200** və ya **201** olmalıdır
- Response body-də `"success": true` görünməlidir

### 5. Aktivləşdirin

- **"Save"** düyməsinə basın
- Webhook avtomatik aktivləşəcək

## Yoxlama

1. Sanity Studio-da bir portfolio açın
2. Kiçik dəyişiklik edin (məsələn, description-a bir cümlə əlavə edin)
3. **"Publish"** düyməsinə basın
4. 60 saniyə gözləyin
5. Canlı saytı yeniləyin (Ctrl+F5 / Cmd+Shift+R)
6. Dəyişiklik görünməlidir

## Webhook Log-larını Yoxlayın

Sanity Manage → API → Webhooks → **Production Site Revalidation** → **Delivery log**

Buradan hər webhook çağırışının statusunu görə bilərsiniz:
- ✅ **200 OK** - uğurlu
- ❌ **401 Unauthorized** - token yanlışdır
- ❌ **500 Error** - server xətası

## Problemlər və Həllər

### Problem: Webhook 401 Unauthorized qaytarır
**Həll**: Authorization header-də token düzgün olduğundan əmin olun:
```
Authorization: Bearer 2c1c6a4b03ff9a518aca57d6ee06baf4e0b6927c2041f32c11cf62c4456593d7
```

### Problem: Dəyişikliklər hələ də görünmür
**Həll 1**: 60 saniyə gözləyin (cache interval)
**Həll 2**: Browser cache-ini təmizləyin (Ctrl+F5)
**Həll 3**: Vercel deployment log-larını yoxlayın

### Problem: Webhook timeout (30s+)
**Həll**: Normal haldır, çünki Vercel cache revalidation ağır prosesdir. Webhook uğurlu sayılır.

## Content Type-lar və Revalidate Olunan Səhifələr

| Content Type | Revalidate Olunan Səhifələr |
|--------------|------------------------------|
| **portfolio** | `/portfolio`, `/portfolio/[slug]`, `/` (home), service pages |
| **blog** | `/journal`, `/journal/[slug]`, `/`, service pages |
| **testimonial** | `/` (home), all service pages, pricing pages |
| **partner** | `/` (home), `/clients` |
| **comboPackage** | `/` (home), `/products`, `/products/[slug]` |

## Əlavə Məlumat

- Webhook kodu: `cradex-agency/app/api/revalidate/route.ts`
- Revalidate interval: 60 saniyə (webhook + fallback)
- Maksimum timeout: 30 saniyə
- Token environment variable: `REVALIDATION_TOKEN`

## Təhlükəsizlik

⚠️ **DİQQƏT**: Webhook token-u heç vaxt public commit-də paylaşmayın!
- Token yalnız `.env.local` faylındadır
- GitHub-da `.gitignore` vasitəsilə ignore olunur
- Vercel Environment Variables-da təyin edilib

## Əlaqə

Suallar və ya problemlər olduqda:
- Email: info@cradexagency.com
- Developer: Paşa Quliyev
