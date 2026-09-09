export default {
  slug: 'sayt-google-da-niye-gorunmur-texniki-sebebler',
  category: 'seo',
  author: 'Paşa Quliyev',
  publishedAt: '2026-08-19',

  title: {
    az: 'Saytınız Google-da niyə görünmür: 12 texniki səbəb',
    en: 'Why your site is invisible on Google: 12 technical reasons',
    ru: 'Почему сайт не виден в Google: 12 технических причин',
    tr: 'Siteniz Google’da neden görünmüyor: 12 teknik neden',
  },

  excerpt: {
    az: 'Məzmun yaxşıdır, amma sayt axtarışda yoxdur. Səbəb çox vaxt texniki olur — hər birini özünüz yoxlaya biləcəyiniz 12 nöqtə.',
    en: 'The content is fine but the site is nowhere in search. The cause is usually technical — twelve checks you can run yourself.',
    ru: 'Контент хороший, а сайта в поиске нет. Причина чаще техническая — двенадцать проверок, которые можно сделать самому.',
    tr: 'İçerik iyi ama site aramada yok. Sebep genelde tekniktir — kendiniz yapabileceğiniz on iki kontrol.',
  },

  body: {
    az: `Sayt hazırdır, dizayn gözəldir, mətnlər yazılıb — amma Google-da adınızı yazanda belə səhifə tapılmır. Bu vəziyyətdə ilk günahlandırılan adətən məzmun olur, halbuki praktikamızda hallarının çoxunda səbəb texnikidir və çoxu bir neçə saatlıq işlə həll olunur.

Aşağıda ardıcıllıqla yoxlanılası 12 nöqtə var. Sıralama təsadüfi deyil: yuxarıdakılar saytı tamamilə görünməz edə bilər, aşağıdakılar isə mövqeyi zəiflədir.

## 1. Sayt indeksləşdirməyə bağlıdır

Ən çox rast gəldiyimiz və ən çox vaxt itirən səbəb budur. Sayt hazırlanarkən developer onu Google-dan gizlədir və işə salarkən açmağı unudur.

Yoxlama sadədir: Google-da site:sizinsayt.az yazın. Heç nə çıxmırsa, sayt indeksdə yoxdur.

Səbəb iki yerdə ola bilər: robots.txt faylında Disallow: / sətri, ya da səhifələrin kodunda noindex göstəricisi. WordPress-də bu, Parametrlər → Oxuma bölməsindəki bir qutucuqdur — bir kliklə açılır və çox vaxt aylarla bağlı qalır.

## 2. Sayt yenidir və Google hələ tanımır

Yeni domenin indeksə düşməsi bir neçə gündən bir neçə həftəyə qədər çəkir. Bu, problem deyil, prosesdir.

Sürətləndirmək üçün: Google Search Console-a saytı əlavə edin, sitemap ünvanını təqdim edin və əsas səhifələr üçün «İndeksləşdirmə tələb et» düyməsini basın. Bu, günlərlə gözləməni saatlara endirir.

## 3. Sitemap yoxdur və ya səhvdir

Sitemap Google-a saytda hansı səhifələrin olduğunu deyən fayldır. sizinsayt.az/sitemap.xml ünvanını açın. Səhifə tapılmırsa, bu fayl yaradılmalıdır.

Fayl var, amma orada silinmiş səhifələr, test ünvanları və ya köhnə linklər varsa, Google saytı etibarsız hesab edir. Sitemap yalnız real, açıq və işlək səhifələri göstərməlidir.

## 4. Səhifə açılma sürəti çox aşağıdır

Mobil cihazda üç saniyədən uzun açılan səhifə həm sıralamada, həm satışda itirir. Google-un PageSpeed Insights alətində saytınızı yoxlayın və mobil göstəriciyə baxın — masaüstü göstərici çox vaxt aldadıcı olur.

Ən çox rast gəlinən üç səbəb: **optimallaşdırılmamış şəkillər** (2-3 MB-lıq foto veb üçün deyil), **lazımsız skriptlər** (istifadə olunmayan plaginlər, üç fərqli analitika sistemi), **ucuz hostinq** (server cavab müddəti 600 ms-dən yuxarıdırsa, qalan optimallaşdırma az kömək edir).

## 5. Sayt mobil cihaz üçün uyğun deyil

Google saytı əvvəlcə mobil versiyada qiymətləndirir. Trafikin təxminən 70 faizi telefondan gəlirsə, bu təkcə texniki deyil, birbaşa gəlir məsələsidir.

Telefonunuzda saytı açın və üç şeyi yoxlayın: mətn böyüdülmədən oxunurmu, düymələr barmaqla rahat basılırmı, üfüqi sürüşdürmə lazım gəlirmi. Üçüncüsü ən çox rast gəlinən problemdir və adətən bir cədvəl və ya şəkilin ekrandan geniş olmasından yaranır.

## 6. Səhifə başlıqları təkrarlanır və ya boşdur

Başlıq (title) Google-un nəticələrdə göstərdiyi mavi sətirdir. Yüz məhsul səhifəsində eyni başlıq varsa, alqoritm onları bir-birindən ayıra bilmir.

Hər səhifənin öz başlığı olmalıdır: 50-60 simvol, əsas sorğu başda, sonda brend adı. Təsvir (description) sıralamaya birbaşa təsir etmir, amma kliklərin sayını dəyişir — 140-160 simvolda insanın niyə məhz sizə kliklməli olduğunu yazın.

## 7. Eyni məzmun bir neçə ünvanda açılır

Sayt həm www ilə, həm onsuz, həm http, həm https ilə açılırsa, Google üçün bu dörd fərqli saytdır və gücünüz dörd yerə bölünür.

Bir əsas variant seçilməli, qalanları ona yönləndirilməlidir. Eyni şey filtr və sıralama parametrləri ilə yaranan ünvanlara da aiddir — onlar üçün canonical göstəricisi qoyulur.

## 8. Sındırılmış linklər və yönləndirmə zəncirləri

Sayt köçürüləndə və ya bölmələr yenidən qurulanda köhnə ünvanlar qırılır. İstifadəçi 404 səhifəsi görür, Google isə saytın baxımsız olduğunu qeyd edir.

Ayrıca zəncirlərə diqqət edin: A → B → C → D şəklində yönləndirmələr həm sürəti azaldır, həm siqnalı zəiflədir. Hər köhnə ünvan birbaşa yeni ünvana yönləndirilməlidir.

## 9. Struktur məlumat (schema) yoxdur

Struktur məlumat Google-a səhifədə nə olduğunu birbaşa deyir: bu qiymətdir, bu rəydir, bu iş saatıdır. Onsuz da sayt işləyir, amma nəticələrdə ulduzlar, qiymət, sual-cavab blokları görünmür — yəni rəqib daha çox yer tutur.

Ən çox fayda verənlər: xidmət və məhsul üçün Service/Product, yerli biznes üçün LocalBusiness, suallar üçün FAQPage, məqalələr üçün Article.

## 10. Daxili keçidlər qurulmayıb

Səhifə saytın heç bir yerindən linklənmirsə, Google ona çətin çatır və az dəyər verir. Menyuda olmayan səhifələr — kampaniya səhifələri, köhnə məqalələr — çox vaxt belə qalır.

Qayda sadədir: hər səhifəyə saytın ən azı bir digər səhifəsindən link olsun; məqalələrdən müvafiq xidmət səhifələrinə keçid verilsin; link mətni «buraya klikləyin» yox, keçid etdiyiniz səhifənin mövzusu olsun.

## 11. Sayt HTTPS-də deyil

Brauzer ünvan sətrində «Təhlükəsiz deyil» yazırsa, həm istifadəçi geri dönür, həm Google mənfi qiymətləndirir. SSL sertifikatı bugün əksər hostinqlərdə pulsuzdur və quraşdırılması bir neçə dəqiqə çəkir.

## 12. Məzmun rəqibdən zəifdir

Texniki hər şey qaydasındadırsa, geriyə bu qalır. Rəqibin səhifəsi suala tam cavab verirsə, sizinki isə iki paraqrafdırsa, texnika kömək etməyəcək.

Yoxlama üsulu: əsas sorğunuzu Google-a yazın, ilk üç nəticəni açın və özünüzə bir sual verin — «mənim səhifəm oxucuya onlarda olmayan nə verir?» Cavab tapılmırsa, məsələ məzmundadır.

## Yoxlamanı hansı ardıcıllıqla aparmaq

Hamısını eyni anda yoxlamağa ehtiyac yoxdur. Ardıcıllıq belədir:

1. site: sorğusu ilə saytın indeksdə olub-olmadığını yoxlayın (1-2-ci bənd).
2. Search Console-da «Səhifələr» hesabatını açın — orada Google-un hansı səhifəni niyə indeksləmədiyi birbaşa yazılır (3, 7, 8-ci bənd).
3. PageSpeed Insights ilə mobil sürəti ölçün (4, 5-ci bənd).
4. Başlıqları və daxili keçidləri nəzərdən keçirin (6, 10-cu bənd).
5. Yerdə qalan vaxtı məzmuna verin.

Birinci iki addım günün yarısını alır və çox vaxt problemin kökünü elə orada tapırsınız.

## Nəticə

Google-da görünməmək demək həmişə «SEO lazımdır» demək deyil. Çox vaxt bu, bir qutucuğun işarəsi, bir yönləndirmə qaydası və ya iki meqabaytlıq şəkil deməkdir. Yuxarıdakı 12 nöqtə bir günlük yoxlama ilə saytınızın hansı vəziyyətdə olduğunu göstərir.

Yoxlamanı özünüz aparmaq istəmirsinizsə və ya nəticələri necə oxumaq lazım olduğunu bilmirsinizsə, saytınıza baxıb hansı problemin nə qədər ciddi olduğunu və nədən başlamağın daha faydalı olacağını deyə bilərik.`,

    en: `The site is finished, the design looks good, the copy is written — and yet searching your own company name brings up nothing. In that situation the content usually gets blamed first, but in most cases we see, the cause is technical, and most of it takes a few hours to fix.

Below are twelve checks in the order worth running them. The order matters: the ones at the top can make a site invisible altogether, the ones lower down merely weaken it.

## 1. The site is blocked from indexing

This is both the most common cause and the one that wastes the most time. During development the site is hidden from Google, and at launch nobody remembers to unhide it.

The check takes seconds: search site:yourdomain.com on Google. Nothing there means the site is not indexed.

There are two usual culprits: a Disallow: / line in robots.txt, or a noindex directive in the pages themselves. In WordPress it is a single checkbox under Settings → Reading — one click to fix, and often left ticked for months.

## 2. The site is new and Google does not know it yet

A new domain takes anywhere from a few days to a few weeks to get indexed. That is a process, not a fault.

To speed it up: add the site to Google Search Console, submit the sitemap, and use “Request indexing” for the key pages. That turns weeks of waiting into hours.

## 3. There is no sitemap, or it is wrong

A sitemap tells Google which pages exist. Open yourdomain.com/sitemap.xml. Nothing there means the file needs to be created.

If the file exists but lists deleted pages, staging URLs or old links, Google treats the site as unreliable. A sitemap should contain only real, public, working pages.

## 4. The pages are too slow

A page that takes over three seconds on mobile loses in rankings and in sales. Run your site through Google PageSpeed Insights and read the mobile score — the desktop one is usually flattering and misleading.

Three causes account for most of it: **unoptimised images** (a 2–3 MB photo does not belong on the web), **unnecessary scripts** (unused plugins, three separate analytics tools), and **cheap hosting** (if server response time is above 600 ms, the rest of the optimisation will not save you).

## 5. The site is not usable on a phone

Google evaluates the mobile version first. When roughly 70% of traffic arrives on a phone, this stops being a technical detail and becomes a revenue one.

Open the site on your own phone and check three things: is the text readable without zooming, are the buttons comfortable to tap, do you have to scroll sideways. The third is the most common, and it usually comes from one table or one image wider than the screen.

## 6. Page titles are duplicated or missing

The title is the blue line Google shows in the results. If a hundred product pages share a title, the algorithm cannot tell them apart.

Every page needs its own: 50–60 characters, the main query at the front, the brand at the end. The meta description does not affect ranking directly, but it changes how many people click — use those 140–160 characters to say why they should choose you.

## 7. The same content opens at several addresses

If the site loads with and without www, and over both http and https, Google sees four different sites and your authority is split four ways.

Pick one canonical version and redirect the rest to it. The same applies to URLs generated by filters and sorting — those need a canonical tag.

## 8. Broken links and redirect chains

When a site is migrated or its structure is reorganised, old addresses break. Users hit a 404; Google records a site that is not maintained.

Watch out for chains as well: A → B → C → D redirects slow the page and dilute the signal. Every old address should point straight at its final destination.

## 9. There is no structured data

Structured data tells Google directly what is on the page: this is a price, this is a review, these are the opening hours. The site works without it, but the results show no stars, no price, no question blocks — meaning your competitor takes up more space on the screen.

The ones that pay off most: Service/Product for what you sell, LocalBusiness for a local company, FAQPage for questions, Article for the blog.

## 10. Internal links are missing

If nothing on the site links to a page, Google reaches it late and values it less. Pages outside the menu — campaign pages, older articles — are usually the ones left stranded.

The rule is simple: every page should be linked from at least one other page; articles should link to the relevant service page; and the link text should describe the destination, not say “click here”.

## 11. The site is not on HTTPS

If the browser says “Not secure”, users leave and Google marks it against you. An SSL certificate is free on most hosting today and takes minutes to install.

## 12. The content is weaker than the competition’s

If everything technical is in order, this is what remains. If the competing page answers the question fully and yours is two paragraphs, no amount of technical work will close that gap.

A quick test: search your main query, open the top three results, and ask yourself one question — “what does my page give the reader that theirs do not?” If you cannot answer, the problem is the content.

## What order to work in

You do not need to check everything at once. This sequence works:

1. Run the site: query to see whether the site is indexed at all (points 1–2).
2. Open the “Pages” report in Search Console — it states plainly which pages Google skipped and why (points 3, 7, 8).
3. Measure mobile speed with PageSpeed Insights (points 4, 5).
4. Review titles and internal links (points 6, 10).
5. Spend whatever time is left on content.

The first two steps take half a day, and more often than not the root cause is already there.

## In closing

Being invisible on Google does not always mean “we need SEO”. Very often it means one ticked checkbox, one missing redirect rule, or one two-megabyte image. The twelve checks above will tell you, in a day, what state your site is actually in.

If you would rather not run them yourself, or you are unsure how to read the results, we can look at your site and tell you how serious each problem is and which one is worth fixing first.`,

    ru: `Сайт готов, дизайн приличный, тексты написаны — а поиск по названию собственной компании ничего не находит. В такой ситуации первым делом обвиняют контент, хотя в большинстве случаев, которые мы видим, причина техническая и устраняется за несколько часов.

Ниже двенадцать проверок в том порядке, в каком их стоит проходить. Порядок не случаен: верхние пункты способны сделать сайт невидимым полностью, нижние — лишь ослабляют позиции.

## 1. Сайт закрыт от индексации

Самая частая причина и та, что съедает больше всего времени. На время разработки сайт закрывают от Google, а при запуске открыть забывают.

Проверка занимает секунды: наберите в Google site:вашсайт.com. Ничего не нашлось — сайта в индексе нет.

Виновников обычно двое: строка Disallow: / в robots.txt или директива noindex в самих страницах. В WordPress это одна галочка в разделе Настройки → Чтение — снимается одним кликом и месяцами остаётся стоять.

## 2. Сайт новый, и Google его ещё не знает

Новому домену на попадание в индекс нужно от нескольких дней до нескольких недель. Это процесс, а не поломка.

Чтобы ускорить: добавьте сайт в Google Search Console, отправьте карту сайта и запросите индексацию ключевых страниц. Недели ожидания превращаются в часы.

## 3. Карты сайта нет или она неверна

Карта сайта сообщает Google, какие страницы существуют. Откройте вашсайт.com/sitemap.xml. Пусто — файл нужно создать.

Если файл есть, но в нём удалённые страницы, тестовые адреса или старые ссылки, Google считает сайт ненадёжным. В карте должны быть только реальные, открытые и рабочие страницы.

## 4. Страницы открываются слишком медленно

Страница, которая на телефоне грузится дольше трёх секунд, теряет и в выдаче, и в продажах. Прогоните сайт через Google PageSpeed Insights и смотрите мобильную оценку — десктопная обычно льстит.

Три причины покрывают почти всё: **неоптимизированные изображения** (фото на 2–3 МБ в вебе не место), **лишние скрипты** (неиспользуемые плагины, три системы аналитики сразу) и **дешёвый хостинг** (если ответ сервера выше 600 мс, остальная оптимизация мало что даст).

## 5. Сайтом неудобно пользоваться с телефона

Google оценивает сначала мобильную версию. Когда с телефона приходит около 70% трафика, это уже не техническая деталь, а вопрос выручки.

Откройте сайт на своём телефоне и проверьте три вещи: читается ли текст без увеличения, удобно ли попадать по кнопкам, приходится ли листать вбок. Третье встречается чаще всего и обычно вызвано одной таблицей или картинкой шире экрана.

## 6. Заголовки страниц дублируются или отсутствуют

Заголовок (title) — это синяя строка, которую Google показывает в выдаче. Если у сотни карточек товара один заголовок, алгоритм их не различает.

У каждой страницы должен быть свой: 50–60 символов, основной запрос в начале, бренд в конце. Описание (description) на позиции напрямую не влияет, но меняет число кликов — используйте эти 140–160 символов, чтобы объяснить, почему стоит выбрать вас.

## 7. Один и тот же контент открывается по нескольким адресам

Если сайт открывается и с www, и без него, и по http, и по https, для Google это четыре разных сайта, а ваш вес делится на четыре.

Нужно выбрать один основной вариант и перенаправить на него остальные. То же касается адресов, которые создают фильтры и сортировки, — для них ставится canonical.

## 8. Битые ссылки и цепочки редиректов

При переезде или перестройке структуры старые адреса ломаются. Пользователь видит 404, а Google фиксирует, что за сайтом не следят.

Отдельно про цепочки: перенаправления вида A → B → C → D замедляют загрузку и размывают сигнал. Каждый старый адрес должен вести сразу на конечный.

## 9. Нет микроразметки

Микроразметка прямо сообщает Google, что находится на странице: это цена, это отзыв, это часы работы. Без неё сайт работает, но в выдаче нет ни звёзд, ни цены, ни блоков с вопросами — то есть конкурент занимает больше места на экране.

Больше всего пользы приносят: Service/Product для того, что вы продаёте, LocalBusiness для локальной компании, FAQPage для вопросов, Article для блога.

## 10. Не выстроена внутренняя перелинковка

Если на страницу не ведёт ни одна ссылка внутри сайта, Google добирается до неё позже и ценит ниже. Обычно так остаются страницы вне меню — акционные страницы, старые статьи.

Правило простое: на каждую страницу должна вести хотя бы одна ссылка с другой страницы; из статей — ссылки на соответствующие услуги; текст ссылки должен описывать, куда она ведёт, а не быть «нажмите здесь».

## 11. Сайт работает не по HTTPS

Если браузер пишет «Не защищено», пользователь уходит, а Google засчитывает это в минус. SSL-сертификат сегодня бесплатен почти на любом хостинге и ставится за несколько минут.

## 12. Контент слабее, чем у конкурентов

Если технически всё в порядке, остаётся это. Когда страница конкурента отвечает на вопрос целиком, а ваша — два абзаца, техника не спасёт.

Способ проверить: наберите основной запрос, откройте первые три результата и задайте себе один вопрос — «что моя страница даёт читателю такого, чего нет у них?» Если ответа нет, дело в контенте.

## В каком порядке проверять

Проверять всё сразу не нужно. Порядок такой:

1. Запросом site: убедитесь, что сайт вообще в индексе (пункты 1–2).
2. Откройте отчёт «Страницы» в Search Console — там прямо написано, какие страницы Google пропустил и почему (пункты 3, 7, 8).
3. Измерьте мобильную скорость в PageSpeed Insights (пункты 4, 5).
4. Просмотрите заголовки и внутренние ссылки (пункты 6, 10).
5. Оставшееся время отдайте контенту.

Первые два шага занимают полдня, и чаще всего корень проблемы обнаруживается уже там.

## Вывод

Отсутствие сайта в Google далеко не всегда означает «нужно SEO». Очень часто это означает одну поставленную галочку, одно недостающее правило перенаправления или одну картинку на два мегабайта. Двенадцать проверок выше за день покажут, в каком состоянии сайт находится на самом деле.

Если проходить их самостоятельно не хочется или непонятно, как читать результаты, мы посмотрим сайт и скажем, насколько серьёзна каждая проблема и с чего полезнее начать.`,

    tr: `Site hazır, tasarım düzgün, metinler yazılmış — ama Google’da kendi şirket adınızı arattığınızda hiçbir şey çıkmıyor. Böyle bir durumda ilk suçlanan genelde içerik olur; oysa gördüğümüz vakaların çoğunda sebep tekniktir ve büyük kısmı birkaç saatte çözülür.

Aşağıda, uygulanması gereken sırayla on iki kontrol var. Sıra rastgele değil: üsttekiler siteyi tamamen görünmez yapabilir, alttakiler yalnızca sıralamayı zayıflatır.

## 1. Site indekslemeye kapalı

Hem en sık karşılaşılan hem de en çok zaman kaybettiren sebep. Geliştirme sırasında site Google’a kapatılır, yayına alınırken açmak unutulur.

Kontrol saniyeler sürer: Google’a site:sitenizinadi.com yazın. Hiçbir şey çıkmıyorsa site indekste değildir.

İki olağan şüpheli var: robots.txt içindeki Disallow: / satırı veya sayfaların kodundaki noindex etiketi. WordPress’te bu, Ayarlar → Okuma bölümündeki tek bir kutucuktur; bir tıkla düzelir ve aylarca işaretli kalır.

## 2. Site yeni, Google henüz tanımıyor

Yeni bir alan adının indekse girmesi birkaç günden birkaç haftaya kadar sürer. Bu bir arıza değil, süreçtir.

Hızlandırmak için: siteyi Google Search Console’a ekleyin, site haritasını gönderin ve ana sayfalar için “Dizine ekleme iste” butonunu kullanın. Haftalarca beklemek böylece saatlere iner.

## 3. Site haritası yok ya da hatalı

Site haritası Google’a hangi sayfaların var olduğunu söyler. sitenizinadi.com/sitemap.xml adresini açın. Boşsa dosyanın oluşturulması gerekir.

Dosya var ama içinde silinmiş sayfalar, test adresleri veya eski bağlantılar varsa Google siteyi güvenilmez sayar. Haritada yalnızca gerçek, açık ve çalışan sayfalar olmalıdır.

## 4. Sayfalar çok yavaş açılıyor

Mobilde üç saniyeden uzun açılan sayfa hem sıralamada hem satışta kaybeder. Sitenizi Google PageSpeed Insights’tan geçirin ve mobil puana bakın — masaüstü puanı genelde yanıltıcı biçimde iyimserdir.

Üç sebep neredeyse her şeyi açıklar: **optimize edilmemiş görseller** (2–3 MB’lık fotoğrafın web’de yeri yoktur), **gereksiz betikler** (kullanılmayan eklentiler, aynı anda üç analiz sistemi) ve **ucuz hosting** (sunucu yanıt süresi 600 ms’nin üstündeyse geri kalan optimizasyon fazla işe yaramaz).

## 5. Site telefonda kullanışlı değil

Google önce mobil sürümü değerlendirir. Trafiğin yaklaşık %70’i telefondan geliyorsa bu artık teknik bir ayrıntı değil, ciro meselesidir.

Siteyi kendi telefonunuzda açın ve üç şeye bakın: metin büyütmeden okunuyor mu, butonlara rahat basılıyor mu, yana kaydırmak gerekiyor mu. Üçüncüsü en sık görülenidir ve genelde ekrandan geniş tek bir tablo ya da görselden kaynaklanır.

## 6. Sayfa başlıkları tekrarlıyor veya boş

Başlık (title), Google’ın sonuçlarda gösterdiği mavi satırdır. Yüz ürün sayfasında aynı başlık varsa algoritma onları ayırt edemez.

Her sayfanın kendi başlığı olmalı: 50–60 karakter, ana arama başta, marka sonda. Açıklama (description) sıralamayı doğrudan etkilemez ama tıklama sayısını değiştirir — o 140–160 karakteri neden sizi seçmeleri gerektiğini anlatmak için kullanın.

## 7. Aynı içerik birden fazla adreste açılıyor

Site hem www ile hem onsuz, hem http hem https üzerinden açılıyorsa Google için bu dört ayrı sitedir ve ağırlığınız dörde bölünür.

Bir ana sürüm seçilip diğerleri ona yönlendirilmelidir. Aynı şey filtre ve sıralamaların ürettiği adresler için de geçerlidir; onlara canonical etiketi konur.

## 8. Kırık bağlantılar ve yönlendirme zincirleri

Site taşınırken ya da yapısı değiştirilirken eski adresler kırılır. Kullanıcı 404 görür, Google ise sitenin bakımsız olduğunu not eder.

Zincirlere ayrıca dikkat: A → B → C → D biçimindeki yönlendirmeler hem yavaşlatır hem sinyali zayıflatır. Her eski adres doğrudan son adrese gitmelidir.

## 9. Yapısal veri yok

Yapısal veri Google’a sayfada ne olduğunu doğrudan söyler: bu fiyattır, bu yorumdur, bunlar çalışma saatleridir. Onsuz da site çalışır ama sonuçlarda ne yıldız ne fiyat ne soru blokları görünür — yani rakibiniz ekranda daha fazla yer kaplar.

En çok işe yarayanlar: sattığınız şey için Service/Product, yerel şirket için LocalBusiness, sorular için FAQPage, blog için Article.

## 10. İç bağlantılar kurulmamış

Bir sayfaya site içinden hiç bağlantı verilmiyorsa Google ona geç ulaşır ve daha az değer verir. Genelde menü dışındaki sayfalar — kampanya sayfaları, eski yazılar — böyle kalır.

Kural basit: her sayfaya en az bir başka sayfadan bağlantı olsun; yazılardan ilgili hizmet sayfalarına bağlantı verilsin; bağlantı metni “buraya tıklayın” değil, gidilen yeri anlatan ifade olsun.

## 11. Site HTTPS’te değil

Tarayıcı “Güvenli değil” yazıyorsa kullanıcı geri döner, Google da bunu eksi hanesine yazar. SSL sertifikası bugün çoğu hostingde ücretsizdir ve birkaç dakikada kurulur.

## 12. İçerik rakibinkinden zayıf

Teknik tarafta her şey yolundaysa geriye bu kalır. Rakibin sayfası soruyu baştan sona cevaplıyor, sizinki iki paragrafsa teknik hiçbir şey bu farkı kapatmaz.

Kontrol yöntemi: ana aramanızı yazın, ilk üç sonucu açın ve kendinize tek bir soru sorun — “benim sayfam okura onlarda olmayan neyi veriyor?” Cevap bulamıyorsanız mesele içeriktedir.

## Hangi sırayla kontrol etmeli

Hepsini aynı anda yapmaya gerek yok. Sıra şöyle:

1. site: sorgusuyla sitenin indekste olup olmadığını görün (1–2. maddeler).
2. Search Console’da “Sayfalar” raporunu açın — Google’ın hangi sayfayı neden atladığı orada açıkça yazar (3, 7, 8. maddeler).
3. PageSpeed Insights ile mobil hızı ölçün (4, 5. maddeler).
4. Başlıkları ve iç bağlantıları gözden geçirin (6, 10. maddeler).
5. Kalan zamanı içeriğe ayırın.

İlk iki adım yarım gün alır ve sorunun kökü çoğu zaman zaten orada bulunur.

## Sonuç

Google’da görünmemek her zaman “SEO lazım” demek değildir. Çok sık olarak tek bir işaretli kutucuk, eksik bir yönlendirme kuralı ya da iki megabaytlık bir görsel demektir. Yukarıdaki on iki kontrol, bir gün içinde sitenizin gerçekte hangi durumda olduğunu gösterir.

Bunları kendiniz yapmak istemiyorsanız ya da sonuçları nasıl okuyacağınızdan emin değilseniz, sitenize bakıp her sorunun ne kadar ciddi olduğunu ve önce neyi düzeltmenin daha faydalı olacağını söyleyebiliriz.`,
  },
}
