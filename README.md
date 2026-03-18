# 🎬 Rex4lon — Lampa Plugins

> Колекція плагінів для медіаплеєра [Lampa](https://lampa.mx). Всі файли підключаються через пряме посилання.

---

## 📦 Як підключити плагін

У Lampa: **Налаштування → Плагіни → Додати** → вставити посилання.

---

## 🧩 Плагіни

### 🎯 Рейтинги та якість

---

#### `2rankds.js`
[https://rex4lon.github.io/2rankds.js](https://rex4lon.github.io/2rankds.js)

Комплексний плагін відображення рейтингів. Підтягує дані з кількох API та показує їх у деталях фільму і на постерах.

**Джерела:** MDBList, OMDb, CUB, TMDB  
**Відображає:** IMDb, Metacritic, Rotten Tomatoes, Popcorn, CUB, середній агрегат ⭐, нагороди (🏆 Оскар, Еммі), вікові обмеження (G / PG-13 / R → 3+ / 13+ / 17+)  
**Додатково:** бейджі на постерах, кеш 3 дні, поліфіли для старих TV, налаштування через Lampa Settings  
> ⚠️ Потребує власних API-ключів **MDBList** та **OMDb**

---

#### `QualityUA.js`
[https://rex4lon.github.io/QualityUA.js](https://rex4lon.github.io/QualityUA.js)

Додає SVG-бейджі якості на картки та сторінку фільму через парсер торентів.

**Визначає:** роздільну здатність (HD / Full HD / 2K / 4K), HDR, Dolby Vision, аудіо (2.0–7.1), дубляж, наявність 🇺🇦 UKR локалізації  
**Бейджі** з'являються з анімацією, адаптовані під мобільний екран  
> ⚙️ Залежність: **Icons**

---

#### `rating_light.js` в вручную надо редактировать и перезаливать, ключ вставить від  var omdb_api_key = ' ВСТАВИТИ СВІЙ OMDB API KEY';
[https://rex4lon.github.io/rating_light.js](https://rex4lon.github.io/rating_light.js)

Підтягує рейтинги Rotten Tomatoes та Metacritic через OMDb API. Відображає додаткові блоки поряд з IMDb/KP.

**Колір цифр:** динамічний градієнт 🔴 (0) → 🟡 (5) → 🟢 (10)  
> ⚠️ Потребує власного **OMDb API-ключа**

---

#### `cubcolor.js`
[https://rex4lon.github.io/cubcolor.js](https://rex4lon.github.io/cubcolor.js)

Рахує CUB-рейтинг на основі реакцій користувачів (🔥 fire, 👍 nice, 🤔 think, 😴 bore, 💩 shit) з вагами (10 / 7.5 / 5 / 2.5 / 0). Використовує формулу Байєса з середнім по базі (окремо для фільмів і серіалів). Мінімум 20 реакцій для відображення.

**Колір блоку:** градієнт 🔴→🟢

---

#### `ratingcolormain.js`
[https://rex4lon.github.io/ratingcolormain.js](https://rex4lon.github.io/ratingcolormain.js)

Найпростіший рейтинговий плагін — не змінює логіку, лише **фарбує** вже існуючі бейджі (`.card__vote`, `.full-start__vote` тощо) у фіксовані кольори за порогами:

| Рейтинг | Колір |
|---------|-------|
| ≥ 8.0 | 🟢 Зелений |
| ≥ 7.0 | 🟩 Салатовий |
| ≥ 6.0 | 🟡 Гірчичний |
| < 6.0 | 🔴 Червоний |

Запускається через `setInterval` кожну секунду + при події `app:ready`.

---

#### `maxsm_ratings_mod.js` в вручную надо редактировать и перезаливать, ключ вставить від можно использовать одиночный ключ или массив ключей, после получения API ключей передайте их как массивы через:
    window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.OMDB_API_KEYS
Или просто введите ниже в коде плагина:
    var OMDB_API_KEYS = (window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.OMDB_API_KEYS) || ['YOU_KEY']; // api ключи массивом
    var KP_API_KEYS   = (window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.KP_API_KEYS)   || ['YOU_KEY']; // api ключи массивом

Для получения данных о качестве используется jacred парсер, по умолчанию плагин настроен на получение адреса и ключа вашего введеного jacred,
вы можете изменить это в переменных:
    var JACRED_PROTOCOL = 'https://'; // Протокол JacRed
    var JACRED_URL = Lampa.Storage.get('jackett_url'); // Адрес JacRed для получения информации о карточках без протокола (jacred.xyz)
    var JACRED_API_KEY = Lampa.Storage.get('jackett_key'); // api ключ JacRed

[https://rex4lon.github.io/maxsm_ratings_mod.js](https://rex4lon.github.io/maxsm_ratings_mod.js)

Додає якість разом з рейтингами. Використовує КіноПошук (kinopoiskapiunofficial.tech), Metacritic/Tomatoes через OMDB, якість через Jacred.

```js
var OMDB_API_KEYS = (window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.OMDB_API_KEYS) || ['YOUR_KEY'];
var KP_API_KEYS   = (window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.KP_API_KEYS)   || ['YOUR_KEY'];
```
> ⚠️ Потребує API-ключів **KinoPoisk** та **OMDb**

---

#### `qualtorrUaleft.js`
[https://rex4lon.github.io/qualtorrUaleft.js](https://rex4lon.github.io/qualtorrUaleft.js)

Показує на сторінці фільму блок з інформацією про наявність 🇺🇦 роздачі через Jacred.

**Відображає:** прапорець 🇺🇦, найкращу якість (4K/1080p/720p) з кількістю сідів, найпопулярніший реліз (тип + якість + сіди). Якщо UA не знайдено — іконка «невідомо». Пошук за назвою + роком з fallback через проксі-список.

---

#### `qualUaIn_2.js`
[https://rex4lon.github.io/qualUaIn_2.js](https://rex4lon.github.io/qualUaIn_2.js)

Аналог `qualtorrUaleft.js`, але більш просунутий. Відображає якість **inline** у рядку рейтингів (`.full-start-new__rate-line`).

**Відмінності:** кеш 72 год, детальне логування з таймінгами, багатостратегійний пошук з fallback, поліфіли для старих TV (`AbortController`, `performance.now`, `padStart`)

---

### 🎬 Перегляд та навігація

---

#### `ContinueWatching.js`
[https://rex4lon.github.io/ContinueWatching.js](https://rex4lon.github.io/ContinueWatching.js)

Додає функцію «Продовжити перегляд» для торентів через TorrServer.

Зберігає позицію відтворення (сезон, епізод, час) з прив'язкою до профілю Lampa Account. На сторінці фільму з'являється кнопка **«Продовжити»** яка відновлює відтворення з того місця де зупинились. Підтримує міграцію даних між профілями та дебаунс збереження.

---

#### `Watching.js`
[https://rex4lon.github.io/Watching.js](https://rex4lon.github.io/Watching.js)

Додає секцію **«Продовжити перегляд»** на початок головної сторінки — показує фільми та серіали, які користувач не досмотрів до кінця.

---

#### `no-autostart.js`
[https://rex4lon.github.io/no-autostart.js](https://rex4lon.github.io/no-autostart.js)

Вимикає автоматичний запуск відтворення торрента коли у списку лише один файл.

---

#### `notrailers.js`
[https://rex4lon.github.io/notrailers.js](https://rex4lon.github.io/notrailers.js)

Прибирає кнопку **«Трейлер»** зі сторінки фільму одразу після її відтворення.

---

### 🎨 Інтерфейс та теми

---

#### `interface_horizontal.js`
[https://rex4lon.github.io/interface_horizontal.js](https://rex4lon.github.io/interface_horizontal.js)

Альтернативний інтерфейс Lampa з **горизонтальними картками** (landscape-постери/backdrop).

Включає власний логотип-движок, grid-layout для сторінки фільму, оптимізовано для широкоформатних зображень.

---

#### `interface_vertical.js`
[https://rex4lon.github.io/interface_vertical.js](https://rex4lon.github.io/interface_vertical.js)

Аналогічний альтернативний інтерфейс, але з **вертикальними картками** (portrait-постери).

Автоматично визначає Smart TV і відповідно адаптує поведінку. Обидва файли є варіантами одного «нового інтерфейсу» — різняться лише орієнтацією карток.

---

#### `themes.js`
[https://rex4lon.github.io/themes.js](https://rex4lon.github.io/themes.js)

Масштабний плагін тем для Lampa. Містить **7+ повноцінних тем** (Prisma, Blue, Green, Orange, Pink, Red, Teal тощо), кожна з власною CSS-змінною акценту.

Додатково включає уніфіковані стилі бейджів якості (4K, WEB-DL, BD, HDTV тощо) з кольоровими градієнтами. Підтримує 9 мов. Вмикається через Settings.

---

#### `themes-max.js` *(v2.6.1)*
[https://rex4lon.github.io/themes-max.js](https://rex4lon.github.io/themes-max.js)

Додає **6 кольорових тем**: `mint_dark`, `crystal_cyan`, `deep_aurora`, `violet_blue`, `amber_noir`, `velvet_sakura`.

Кожна тема змінює кольори фону, акцентів та елементів фокусу через CSS. Налаштовується через окремий розділ Settings у Lampa.

---

#### `logoEn.js`
[https://rex4lon.github.io/logoEn.js](https://rex4lon.github.io/logoEn.js)

Замінює текстову назву фільму/серіалу на **графічний логотип** з TMDB.

Автоматично інвертує темні логотипи в білий колір через аналіз яскравості пікселів. Підтримує кеш, вибір мови (UK/EN), розміру, насиченості та адаптацію під вертикальний екран.

---

#### `studioslogo.js`
[https://rex4lon.github.io/studioslogo.js](https://rex4lon.github.io/studioslogo.js)

Додає **логотипи виробничих студій** (до 3-х) під назвою фільму на сторінці картки.

Логотипи клікабельні — відкривають каталог фільмів студії. Також автоінвертує темні логотипи в білий.  
**Налаштування:** підложка, розмір, насиченість, кеш (3 хв)

---

#### `interface_plugin.js`
[https://rex4lon.github.io/interface_plugin.js](https://rex4lon.github.io/interface_plugin.js)

Кастомізує зовнішній вигляд інтерфейсу: рамки та свічення карток, масштаб при фокусі, кольори рейтингу, курсив тексту, приховування елементів шапки та блокування реклами.

Всі налаштування доступні через меню Lampa і зберігаються в `localStorage`. Зовнішніх залежностей немає.

---

#### `torrent_styles_v2.js`
[https://rex4lon.github.io/torrent_styles_v2.js](https://rex4lon.github.io/torrent_styles_v2.js)

**Кольорові бейджі** для карток торентів: сіди, бітрейт, розмір та піри підсвічуються від 🟢 зеленого до 🔴 червоного залежно від значення. Оновлюється динамічно через `MutationObserver`.

---

### 🗂️ Меню та кнопки

---

#### `menu_editor.js`
[https://rex4lon.github.io/menu_editor.js](https://rex4lon.github.io/menu_editor.js)

Дозволяє редагувати **всі три меню** Lampa прямо з налаштувань — змінювати порядок і приховувати пункти.

- **Ліве меню** — переміщення пунктів вгору/вниз, приховування розділів
- **Верхнє меню (шапка)** — перестановка іконок, кнопки «Перезавантаження» та «Очистити кеш»
- **Меню налаштувань** — зміна порядку розділів у Settings
- **Панель навігації** — тогл для повного приховування

Всі зміни зберігаються в `Lampa.Storage`.

---

#### `3buttons.js`
[https://rex4lon.github.io/3buttons.js](https://rex4lon.github.io/3buttons.js)

Змінює порядок кнопок на сторінці фільму: спочатку **«Онлайн»**, потім **«Торрент»**, **«Трейлер»**, решта. Також очищає параметр `full_btn_priority` в налаштуваннях.

> ⚠️ Код сильно обфускований

---

#### `buttons_1.js` *(v1.4.0)*
[https://rex4lon.github.io/buttons_1.js](https://rex4lon.github.io/buttons_1.js)

Розширена версія редактора кнопок. Дозволяє **групувати кнопки в папки**, редагувати порядок всередині них, перейменовувати. Підтримує індивідуальний режим відображення для кожної кнопки (стандарт / тільки іконка / з текстом). ES5-сумісний з повним набором поліфілів.

---

#### `buttons_2.js` *(v2.1)*
[https://rex4lon.github.io/buttons_2.js](https://rex4lon.github.io/buttons_2.js)

Альтернативна версія редактора без папок, але з **перейменуванням кнопок** через текстове поле вводу.

Ключова відмінність — стабільна генерація ID кнопок (`generateStableButtonId`) на основі класів, тексту, `href` та `data-action`. Усуває проблему «зламаного порядку після перезапуску». Також підтримує кнопку «Options (…)».

---

#### `navigation_bar.js`
[https://rex4lon.github.io/navigation_bar.js](https://rex4lon.github.io/navigation_bar.js)

Розширює нижню навігаційну панель на мобільних: дозволяє додавати будь-які пункти меню як кнопки з іконкою та підписом. Налаштовується через Settings.

---

#### `top_bar.js`
[https://rex4lon.github.io/top_bar.js](https://rex4lon.github.io/top_bar.js)

Додає іконку в шапку для швидкого **перемикання плеєра** (Онлайн / IPTV / Торрент) через модальне меню.

---

#### `menu.js`
[https://rex4lon.github.io/menu.js](https://rex4lon.github.io/menu.js)

Задає порядок і список прихованих пунктів бічного меню Lampa (сортування, приховання «Персони», «Фільтр», «Колекції», «Shots»).

---

### 🛠️ Утиліти та фільтри

---

#### `ads_full.js`
[https://rex4lon.github.io/ads_full.js](https://rex4lon.github.io/ads_full.js)

Блокує рекламу у плеєрі Lampa. Перехоплює виклик `Lampa.Player.play`, встановлює прапор `iptv: true` та видаляє параметри `vast_url` / `vast_msg`, що повністю запобігає показу реклами.

---

#### `anti-ru.js` Не рабочий
[https://rex4lon.github.io/anti-ru.js](https://rex4lon.github.io/anti-ru.js)

Фільтрує аудіодоріжки у плеєрі: **прибирає російськомовні треки** та автоматично обирає українську озвучку якщо є.

Вмикається/вимикається через перемикач у налаштуваннях, за замовчуванням **увімкнено**.

---

#### `filter_mod.js`
[https://rex4lon.github.io/filter_mod.js](https://rex4lon.github.io/filter_mod.js)

Глибоко перероблений і покращений фільтр Lampa. Додає новий пункт **«Фільтр +»** у головне меню.

- Пошук завжди ведеться по базі **TMDB** незалежно від джерела
- Виправлена логіка підбору жанрів (будь-який з жанрів, а не сукупність)
- Сортування замінено на прийняте на TMDB
- При вказаному віковому рейтингу або рос. мові оригіналу — пошук через **CUB**
- Налаштування зберігаються між сесіями
- **10 готових пресетів** + збереження власних (до 10)

---

#### `ihide.js`
[https://rex4lon.github.io/ihide.js](https://rex4lon.github.io/ihide.js)

Дозволяє вибірково **приховувати елементи інтерфейсу** через Settings. Кожен елемент вмикається або вимикається окремо — активні підсвічуються 🟢, приховані 🔴.

Підтримує мови: **UK / RU / EN**

---

#### `cache.js`
[https://rex4lon.github.io/cache.js](https://rex4lon.github.io/cache.js)

Додає кнопку **очищення кешу** в шапку Lampa + замінює іконки кнопок (онлайн/торрент/трейлер) на кастомні з кольоровим кодуванням.

---

#### `exit.js`
[https://rex4lon.github.io/exit.js](https://rex4lon.github.io/exit.js)

Додає пункт **«Вихід»** у бічне меню з підтримкою виходу на різних платформах: Android, Tizen, WebOS, Apple TV тощо.

---

#### `no-shots.js`
[https://rex4lon.github.io/no-shots.js](https://rex4lon.github.io/no-shots.js)

Блокує завантаження плагіна **«Shots»** — перехоплює `putScriptAsync` і фільтрує відповідний URL.

---

### 🌐 Каталог та джерела

---

#### `sources.js`
[https://rex4lon.github.io/sources.js](https://rex4lon.github.io/sources.js)

Додає розділ **«Джерела»** в бокове меню Lampa з каталогом серіалів по мережах/стрімінгах.

**Категорії:**
- 📊 Чарти TMDB (популярні, топ-250, тренди)
- 🎬 Стрімінги (Netflix, Prime, Disney+ тощо)
- 📺 TV США / TV Світ
- 🇺🇦 Україна (1+1, ICTV, СТБ тощо)
- 🇷🇺 Росія

Для кожного джерела: сортування за популярністю, рейтингом, датою або голосами.

---

### ⚡ Рекомендовані торенти

---

#### `trrnttlk5.js` *(EasyTorrent v1.1.0 Beta)*
[https://rex4lon.github.io/trrnttlk5.js](https://rex4lon.github.io/trrnttlk5.js)

Аналізує список торентів і **рекомендує найкращі** на основі скорингу.

**Пріоритети:** UA дубляж, роздільна здатність, сіди, бітрейт, HDR (Dolby Vision/HDR10)  
Конфіг профілю зберігається у **Supabase**. Рекомендовані торенти позначаються бейджем **«Рекомендовано»** з розбивкою балів.

---

#### `easytorrent` *(зовнішній плагін)*

Переклад коду EasyTorrent із сторінкою вибору налаштувань.  
Автор коду: **darkestclouds**

| Версія | Посилання | Призначення |
|--------|-----------|-------------|
| Повна | [https://cevamnelampaplagin.github.io/plugins/easytorrent2.1.0.5.js](https://cevamnelampaplagin.github.io/plugins/easytorrent2.1.0.5.js) | Для потужних пристроїв |
| Mini | [https://cevamnelampaplagin.github.io/plugins/easytorrent2.1.0.min.js](https://cevamnelampaplagin.github.io/plugins/easytorrent2.1.0.min.js) | Для старих TV / слабких пристроїв |

> QR-код генерується лише на **lampa.mx**. На lampa.stream — тільки посилання.

---

## 📋 Повний список плагінів

| Плагін | Посилання | Опис |
|--------|-----------|------|
| 2rankds.js | [https://rex4lon.github.io/2rankds.js](https://rex4lon.github.io/2rankds.js) | Комплексні рейтинги (MDBList, OMDb, CUB, TMDB) |
| 3buttons.js | [https://rex4lon.github.io/3buttons.js](https://rex4lon.github.io/3buttons.js) | Порядок кнопок: Онлайн → Торрент → Трейлер |
| ContinueWatching.js | [https://rex4lon.github.io/ContinueWatching.js](https://rex4lon.github.io/ContinueWatching.js) | Продовжити перегляд через TorrServer |
| QualityUA.js | [https://rex4lon.github.io/QualityUA.js](https://rex4lon.github.io/QualityUA.js) | SVG-бейджі якості + 🇺🇦 UKR |
| Watching.js | [https://rex4lon.github.io/Watching.js](https://rex4lon.github.io/Watching.js) | Секція «Продовжити перегляд» на головній |
| ads_full.js | [https://rex4lon.github.io/ads_full.js](https://rex4lon.github.io/ads_full.js) | Блокування реклами у плеєрі |
| anti-ru.js | [https://rex4lon.github.io/anti-ru.js](https://rex4lon.github.io/anti-ru.js) | Фільтр рос. аудіодоріжок, авто-UA |
| buttons_1.js | [https://rex4lon.github.io/buttons_1.js](https://rex4lon.github.io/buttons_1.js) | Редактор кнопок з папками (v1.4.0) |
| buttons_2.js | [https://rex4lon.github.io/buttons_2.js](https://rex4lon.github.io/buttons_2.js) | Редактор кнопок зі стабільними ID (v2.1) |
| cache.js | [https://rex4lon.github.io/cache.js](https://rex4lon.github.io/cache.js) | Кнопка очищення кешу + кастомні іконки |
| cubcolor.js | [https://rex4lon.github.io/cubcolor.js](https://rex4lon.github.io/cubcolor.js) | CUB-рейтинг за реакціями (Байєс) |
| exit.js | [https://rex4lon.github.io/exit.js](https://rex4lon.github.io/exit.js) | Пункт «Вихід» (Android/Tizen/WebOS/tvOS) |
| filter_mod.js | [https://rex4lon.github.io/filter_mod.js](https://rex4lon.github.io/filter_mod.js) | Розширений фільтр + пресети |
| ihide.js | [https://rex4lon.github.io/ihide.js](https://rex4lon.github.io/ihide.js) | Приховування елементів інтерфейсу |
| interface_horizontal.js | [https://rex4lon.github.io/interface_horizontal.js](https://rex4lon.github.io/interface_horizontal.js) | Горизонтальний інтерфейс (backdrop) |
| interface_plugin.js | [https://rex4lon.github.io/interface_plugin.js](https://rex4lon.github.io/interface_plugin.js) | Кастомізація рамок, масштабу, кольорів |
| interface_vertical.js | [https://rex4lon.github.io/interface_vertical.js](https://rex4lon.github.io/interface_vertical.js) | Вертикальний інтерфейс (portrait) |
| logoEn.js | [https://rex4lon.github.io/logoEn.js](https://rex4lon.github.io/logoEn.js) | Графічний логотип фільму з TMDB |
| maxsm_ratings_mod.js | [https://rex4lon.github.io/maxsm_ratings_mod.js](https://rex4lon.github.io/maxsm_ratings_mod.js) | Якість + рейтинги (KP, OMDb, Jacred) |
| menu.js | [https://rex4lon.github.io/menu.js](https://rex4lon.github.io/menu.js) | Порядок та приховування пунктів меню |
| menu_editor.js | [https://rex4lon.github.io/menu_editor.js](https://rex4lon.github.io/menu_editor.js) | Редактор усіх трьох меню Lampa |
| navigation_bar.js | [https://rex4lon.github.io/navigation_bar.js](https://rex4lon.github.io/navigation_bar.js) | Розширена нижня панель навігації |
| no-autostart.js | [https://rex4lon.github.io/no-autostart.js](https://rex4lon.github.io/no-autostart.js) | Вимкнення авто-старту торрента |
| no-shots.js | [https://rex4lon.github.io/no-shots.js](https://rex4lon.github.io/no-shots.js) | Блокування плагіна «Shots» |
| notrailers.js | [https://rex4lon.github.io/notrailers.js](https://rex4lon.github.io/notrailers.js) | Прибирає кнопку «Трейлер» після показу |
| qualUaIn_2.js | [https://rex4lon.github.io/qualUaIn_2.js](https://rex4lon.github.io/qualUaIn_2.js) | 🇺🇦 UA-якість inline у рядку рейтингів |
| qualtorrUaleft.js | [https://rex4lon.github.io/qualtorrUaleft.js](https://rex4lon.github.io/qualtorrUaleft.js) | 🇺🇦 UA-роздача через Jacred (блок) |
| rating_light.js | [https://rex4lon.github.io/rating_light.js](https://rex4lon.github.io/rating_light.js) | RT + Metacritic через OMDb (кольоровий) |
| ratingcolormain.js | [https://rex4lon.github.io/ratingcolormain.js](https://rex4lon.github.io/ratingcolormain.js) | Фарбування існуючих бейджів рейтингу |
| sources.js | [https://rex4lon.github.io/sources.js](https://rex4lon.github.io/sources.js) | Каталог серіалів по стрімінгах/мережах |
| studioslogo.js | [https://rex4lon.github.io/studioslogo.js](https://rex4lon.github.io/studioslogo.js) | Логотипи студій на сторінці фільму |
| themes.js | [https://rex4lon.github.io/themes.js](https://rex4lon.github.io/themes.js) | 7+ тем оформлення + бейджі якості |
| themes-max.js | [https://rex4lon.github.io/themes-max.js](https://rex4lon.github.io/themes-max.js) | 6 кольорових тем (v2.6.1) |
| top_bar.js | [https://rex4lon.github.io/top_bar.js](https://rex4lon.github.io/top_bar.js) | Перемикач плеєра в шапці |
| torrent_styles_v2.js | [https://rex4lon.github.io/torrent_styles_v2.js](https://rex4lon.github.io/torrent_styles_v2.js) | Кольорові бейджі торентів (сіди/бітрейт) |
| trrnttlk5.js | [https://rex4lon.github.io/trrnttlk5.js](https://rex4lon.github.io/trrnttlk5.js) | EasyTorrent — рекомендації торентів |

---

*Плагіни призначені для використання з [Lampa](https://lampa.mx) — медіаплеєром для Smart TV та мобільних пристроїв.*
