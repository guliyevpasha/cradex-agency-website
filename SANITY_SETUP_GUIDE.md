# Sanity CMS Quraşdırma Təlimatı

## ✅ Tamamlanmış Addımlar

1. **Sanity layihəsi yaradıldı**
   - Layihə ID: `7ia9tt83`
   - Dataset: `production`
   - Təşkilat: Cradex Agency

2. **Sxemlər (Schemas) yaradıldı**
   - ✅ Blog yazıları (4 dildə: az, en, ru, tr)
   - ✅ Portfolio layihələri (4 dildə)
   - ✅ Tərəfdaş loqoları
   - ✅ Müştəri rəyləri (4 dildə)

3. **Next.js konfiqurasiyası yeniləndi**
   - ✅ Static export silinib (Studio üçün SSR lazımdır)
   - ✅ Sanity CDN üçün şəkil optimallaşdırması əlavə edilib
   - ✅ CSP başlıqları Sanity üçün yenilənib

4. **Sanity sorğu funksiyaları yaradıldı**
   - ✅ `sanity/lib/queries.ts` - bütün məlumatları çəkmək üçün

## 📋 Növbəti Addımlar

### 1. Studio-ya daxil olun

Brauzerinizdə açın:
```
http://localhost:3000/studio
```

İlk dəfə açanda Sanity sizi Google hesabınızla daxil olmağa dəvət edəcək.

### 2. API Token — lazım deyil

Bu layihə Sanity yazma tokeni istifadə etmir və heç bir kod `SANITY_API_TOKEN` dəyişənini oxumur:

- **Studio** (`/studio`) səni öz Sanity hesabınla autentifikasiya edir — token yox, sessiya işlədir
- **Sayt** kontenti public read ilə çəkir (`sanity/lib/client.ts`)

Token yalnız Sanity-yə skript vasitəsilə toplu məlumat yazsan lazım olar. O halda token-i yalnız həmin skriptin mühitində saxla, Vercel-ə əlavə etmə.

### 3. CORS origin əlavə edin

Studio brauzerdə işlədiyi üçün Sanity-də icazə tələb edir. **Settings** → **API** → **CORS origins** bölməsində bunlar olmalıdır:

| Origin | Allow credentials |
|---|---|
| `http://localhost:3000` | ✅ |
| `https://cradexagency.com` | ✅ |
| `https://www.cradexagency.com` | ✅ |

"Allow credentials" işarəsiz olsa, Studio açılar, amma giriş edə bilməzsən.

### 4. Test məlumatları əlavə edin

Studio-da hər bir bölmə üçün test məlumatları əlavə edin:

#### Blog Post əlavə etmək:
1. Studio-da **Blog Posts (Jurnal)** bölməsinə keçin
2. **Create** düyməsinə basın
3. Bütün dillərdə başlıq və məzmun əlavə edin
4. Kateqoriya seçin (SEO, SMM, Brendinq və s.)
5. Şəkil yükləyin
6. **Publish** düyməsinə basın

#### Portfolio əlavə etmək:
1. **Portfolio** bölməsinə keçin
2. **Create** düyməsinə basın
3. Bütün dillərdə başlıq və təsvir əlavə edin
4. Kateqoriya seçin
5. Əsas şəkil və qalereya şəkilləri yükləyin
6. **Publish** düyməsinə basın

#### Tərəfdaş əlavə etmək:
1. **Partners (Tərəfdaşlar)** bölməsinə keçin
2. **Create** düyməsinə basın
3. Şirkət adı və loqo yükləyin
4. **Active** qutusunu işarələyin
5. **Publish** düyməsinə basın

#### Müştəri rəyi əlavə etmək:
1. **Testimonials (Müştəri Rəyləri)** bölməsinə keçin
2. **Create** düyməsinə basın
3. Müştəri adı, şirkət və bütün dillərdə rəy əlavə edin
4. Reytinq (1-5 ulduz) seçin
5. **Publish** düyməsinə basın

## 🔄 Məlumat Mənbəyini Dəyişdirmək

Hazırda sayt JSON fayllarından məlumat oxuyur. Sanity-dən məlumat oxumaq üçün aşağıdakı faylları yeniləməliyik:

### Yeniləməli olan fayllar:

1. **`lib/data/journal.ts`** - Blog məqalələri
2. **`lib/data/portfolio.ts`** - Portfolio layihələri  
3. **`lib/data/partners.ts`** - Tərəfdaş loqoları
4. **`lib/data/testimonials.ts`** - Müştəri rəyləri

Bu faylları yeniləmək üçün mənə deyin və mən onları Sanity sorğularını istifadə edərək yeniləyəcəyəm.

## 📝 Sanity Studio İstifadəsi

### Məzmun əlavə etmək:
1. Studio-ya daxil olun: `http://localhost:3000/studio`
2. Sol menyudan bölmə seçin (Blog, Portfolio və s.)
3. **Create** düyməsinə basın
4. Formu doldurun (bütün dillərdə)
5. **Publish** düyməsinə basın

### Məzmunu redaktə etmək:
1. Siyahıdan məzmunu seçin
2. Dəyişikliklər edin
3. **Publish** düyməsinə basın

### Məzmunu silmək:
1. Məzmunu seçin
2. Sağ yuxarı küncdə **⋮** (üç nöqtə) düyməsinə basın
3. **Delete** seçin

## 🚀 Production-a Deploy

Sanity ilə bağlı üç dəyişən Vercel-də olmalıdır:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=7ia9tt83
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Layihənin bütün dəyişənləri, onların tipi (Config / Secret), Vercel panelindəki yeri və revalidation webhook-unun qurulması **[VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)** sənədində təsvir olunub. Siyahını iki yerdə saxlamamaq üçün detallar orada tək nüsxədə qalır.

## 🔐 Təhlükəsizlik

- **Sirləri heç vaxt repo-ya yükləməyin** — nə koda, nə sənədlərə
- Gizli dəyərlər yalnız `.env.local` (git-ə düşmür) və Vercel panelində saxlanılır
- `.env.local` faylı `.gitignore`-dadır (artıq əlavə edilib)

## 📞 Dəstək

Hər hansı sual və ya problem olduqda mənə yazın!

## 🎯 Növbəti Mərhələ

Test məlumatları əlavə etdikdən sonra mənə deyin və mən:
1. Məlumat fayllarını Sanity-dən oxumaq üçün yeniləyəcəyəm
2. Saytın Sanity ilə düzgün işlədiyini yoxlayacağam
3. Production-a deploy üçün hazırlayacağam
