(function () {
    'use strict';

    // =====================================================================
    // 1. НАЛАШТУВАННЯ
    // =====================================================================
    Lampa.SettingsApi.addComponent({
        component: 'jellyfin_config',
        name: 'Jellyfin',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'jellyfin_config',
        param: {
            name: 'jellyfin_nas_server',
            type: 'input',
            placeholder: 'http://192.168.1.161:8096',
            values: '',
            default: 'http://192.168.1.161:8096'
        },
        field: {
            name: 'Адреса сервера Jellyfin',
            description: 'Наприклад: http://192.168.1.161:8096'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'jellyfin_config',
        param: {
            name: 'jellyfin_nas_token',
            type: 'input',
            placeholder: 'a4393364ae8b45b28f76506cd6b19cd0',
            values: '',
            default: 'a4393364ae8b45b28f76506cd6b19cd0'
        },
        field: {
            name: 'API Ключ',
            description: 'Згенеруйте ключ в панелі адміністратора Jellyfin'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'jellyfin_config',
        param: {
            name: 'jellyfin_nas_check',
            type: 'button'
        },
        field: {
            name: 'Перевірити підключення',
            description: 'Натисніть для тестового запиту до сервера'
        }
    });

    // Обработчик кнопки проверки соединения
    Lampa.Settings.listener.follow('open', function (e) {
        if (e.name == 'jellyfin_config') {
            var checkBtn = e.body.find('[data-name="jellyfin_nas_check"]');
            if (checkBtn.length) {
                checkBtn.find('.settings-param__name').css('color', '#00ff00');

                checkBtn.off('hover:enter click').on('hover:enter click', function () {
                    var url = (Lampa.Storage.get('jellyfin_nas_server') || 'http://192.168.1.161:8096').replace(/\/$/, '').trim();
                    var token = (Lampa.Storage.get('jellyfin_nas_token') || 'a4393364ae8b45b28f76506cd6b19cd0').trim();

                    if (!url || !token) {
                        Lampa.Noty.show('Спочатку введіть адресу та ключ!');
                        return;
                    }

                    Lampa.Noty.show('З\'єднуємось з сервером...');

                    $.ajax({
                        url: url + '/System/Info?api_key=' + token,
                        type: 'GET',
                        dataType: 'json',
                        timeout: 10000,
                        success: function (res) {
                            if (res && res.Id) {
                                Lampa.Noty.show('✓ Успіх! Підключено до: ' + (res.ServerName || 'Jellyfin'));
                            } else {
                                Lampa.Noty.show('✗ Помилка: Невірний API Ключ!');
                            }
                        },
                        error: function (xhr) {
                            if (xhr.status === 401 || xhr.status === 403) {
                                Lampa.Noty.show('✗ Помилка авторизації. Перевірте API ключ');
                            } else if (xhr.status === 0) {
                                Lampa.Noty.show('✗ Помилка підключення. Перевірте адресу сервера');
                            } else {
                                Lampa.Noty.show('✗ Помилка підключення до сервера');
                            }
                        }
                    });
                });
            }
        }
    });

    // =====================================================================
    // 2. ФУНКЦІЯ ПЛЕЄРА
    // =====================================================================
    function startPlayer(id, title, url, token) {
        var streamUrl = url + '/Items/' + id + '/Download?api_key=' + token;

        console.log('Jellyfin: запуск плеєра -', title);
        Lampa.Noty.show('Відкриваємо плеєр...');

        var video = {
            title: title,
            url: streamUrl
        };

        Lampa.Player.play(video);
        Lampa.Player.playlist([video]);
    }

    // =====================================================================
    // 3. ПОШУК ТА ВІДТВОРЕННЯ
    // =====================================================================
    function getSettings() {
        return {
            url: (Lampa.Storage.get('jellyfin_nas_server') || 'http://192.168.1.161:8096').replace(/\/$/, '').trim(),
            token: (Lampa.Storage.get('jellyfin_nas_token') || 'a4393364ae8b45b28f76506cd6b19cd0').trim()
        };
    }

    function findAndPlay(movie) {
        var s = getSettings();
        if (!s.url || !s.token) {
            Lampa.Noty.show('Налаштуйте Jellyfin у налаштуваннях');
            return;
        }

        var tmdbId = String(movie.id || movie.tmdb_id || '');
        var imdbId = String(movie.imdb_id || movie.imdb || '');

        Lampa.Noty.show('Шукаємо у медіатеці Jellyfin...');

        $.ajax({
            url: s.url + '/Users?api_key=' + s.token,
            type: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function (users) {
                if (!users || users.length === 0) {
                    Lampa.Noty.show('Користувачів Jellyfin не знайдено');
                    return;
                }
                var userId = users[0].Id;

                // Пошук по TMDB ID
                $.ajax({
                    url: s.url + '/Users/' + userId + '/Items?Recursive=true&IncludeItemTypes=Movie,Series&Fields=ProviderIds,Path&AnyProviderIdEquals=tmdb.' + tmdbId + '&api_key=' + s.token,
                    type: 'GET',
                    dataType: 'json',
                    timeout: 10000,
                    success: function (data) {
                        var foundItem = null;

                        if (data && data.Items && data.Items.length > 0) {
                            for (var i = 0; i < data.Items.length; i++) {
                                if (data.Items[i].ProviderIds && String(data.Items[i].ProviderIds.Tmdb) === tmdbId) {
                                    foundItem = data.Items[i];
                                    break;
                                }
                            }
                            if (!foundItem) foundItem = data.Items[0];
                        }

                        if (foundItem) {
                            openItem(foundItem, userId, s);
                            return;
                        }

                        // Fallback: пошук по IMDB ID
                        if (imdbId && imdbId !== 'undefined' && imdbId !== '') {
                            $.ajax({
                                url: s.url + '/Users/' + userId + '/Items?Recursive=true&IncludeItemTypes=Movie,Series&Fields=ProviderIds,Path&AnyProviderIdEquals=imdb.' + imdbId + '&api_key=' + s.token,
                                type: 'GET',
                                dataType: 'json',
                                timeout: 10000,
                                success: function (d2) {
                                    if (d2 && d2.Items && d2.Items.length > 0) {
                                        openItem(d2.Items[0], userId, s);
                                    } else {
                                        Lampa.Noty.show('Цього відео немає у вашій медіатеці Jellyfin');
                                    }
                                },
                                error: function () {
                                    Lampa.Noty.show('Помилка пошуку файлів');
                                }
                            });
                        } else {
                            Lampa.Noty.show('Цього відео немає у вашій медіатеці Jellyfin');
                        }
                    },
                    error: function () {
                        Lampa.Noty.show('Помилка пошуку файлів');
                    }
                });
            },
            error: function () {
                Lampa.Noty.show('Помилка авторизації на сервері');
            }
        });
    }

    function openItem(foundItem, userId, s) {
        if (foundItem.Type === 'Series') {
            $.ajax({
                url: s.url + '/Shows/' + foundItem.Id + '/Episodes?userId=' + userId + '&Fields=Path&api_key=' + s.token,
                type: 'GET',
                dataType: 'json',
                timeout: 10000,
                success: function (epData) {
                    if (epData && epData.Items && epData.Items.length > 0) {
                        var episodes = epData.Items.map(function (ep) {
                            return {
                                title: 'S' + (ep.ParentIndexNumber || 1) + ' E' + (ep.IndexNumber || 1) + ' - ' + (ep.Name || 'Episode'),
                                jellyId: ep.Id
                            };
                        });
                        Lampa.Select.show({
                            title: 'Оберіть серію',
                            items: episodes,
                            onSelect: function (sel) {
                                startPlayer(sel.jellyId, sel.title, s.url, s.token);
                            },
                            onBack: function () {
                                Lampa.Controller.toggle('full_start');
                            }
                        });
                    } else {
                        Lampa.Noty.show('Серій не знайдено');
                    }
                },
                error: function () {
                    Lampa.Noty.show('Помилка завантаження серій');
                }
            });
        } else {
            startPlayer(foundItem.Id, foundItem.Name, s.url, s.token);
        }
    }

    // =====================================================================
    // 4. КНОПКА В КАРТЦІ ФІЛЬМУ
    // =====================================================================
    Lampa.Listener.follow('full', function (e) {
        if (e.type == 'complite' || e.type == 'complete') {
            var render = e.object.activity.render();

            var btn = render.find('.view--jellyfin');
            if (!btn.length) {
                btn = $('<div class="full-start__button selector view--jellyfin" style="background-color: #8b3ab9;"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span style="color:#fff; margin-left: 8px;">Jellyfin</span></div>');

                var target = render.find('.view--torrent');
                if (target.length) {
                    target.after(btn);
                } else {
                    var buttonsContainer = render.find('.full-start__buttons');
                    if (buttonsContainer.length) {
                        buttonsContainer.append(btn);
                    }
                }
            }

            btn.off('hover:enter click').on('hover:enter click', function () {
                findAndPlay(e.data.movie);
            });
        }
    });

    // =====================================================================
    // 5. ЛІВЕ МЕНЮ
    // =====================================================================
    function addMenu() {
        if ($('[data-action="jellyfin_catalog"]').length) return;
        
        var item = $('<li class="menu__item selector" data-action="jellyfin_catalog"><div class="menu__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div class="menu__text">Jellyfin</div></li>');
        
        item.on('hover:enter click', function () {
            Lampa.Activity.push({
                url: '',
                title: 'Jellyfin Медіа',
                component: 'jellyfin_catalog',
                page: 1
            });
        });
        
        var menuList = $('.menu__list').eq(0);
        if (menuList.length) {
            menuList.append(item);
        }
    }

    if (window.appready) addMenu();
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') addMenu();
    });

    // =====================================================================
    // 6. КОМПОНЕНТ КАТАЛОГУ
    // =====================================================================
    function JellyfinCatalog(object) {
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = [];
        var html = $('<div></div>');
        var body = $('<div class="category-full"></div>');
        var _this = this;

        this.activity = object.activity;

        this.create = function () {
            var s = getSettings();

            if (!s.url || !s.token) {
                html.append('<div class="empty">Налаштуйте Jellyfin у налаштуваннях</div>');
                return this.render();
            }

            _this.activity.loader(true);

            var reqUrl = s.url + '/Items?Recursive=true&IncludeItemTypes=Movie,Series&Fields=ProviderIds,ProductionYear,CommunityRating&SortBy=DateCreated&SortOrder=Descending&api_key=' + s.token;

            $.ajax({
                url: reqUrl,
                type: 'GET',
                dataType: 'json',
                timeout: 15000,
                success: function (data) {
                    _this.activity.loader(false);
                    if (data && data.Items && data.Items.length > 0) {
                        _this.build(data.Items, s.url, s.token);
                    } else {
                        html.append('<div class="empty">Бібліотека порожня</div>');
                    }
                },
                error: function () {
                    _this.activity.loader(false);
                    html.append('<div class="empty">Помилка підключення до сервера</div>');
                }
            });

            return this.render();
        };

        this.build = function (items, url, token) {
            html.empty();
            html.append(scroll.render());
            scroll.append(body);

            items.forEach(function (item) {
                var tmdbId = (item.ProviderIds && item.ProviderIds.Tmdb) ? item.ProviderIds.Tmdb : null;
                var type = item.Type === 'Series' ? 'tv' : 'movie';
                var year = item.ProductionYear ? item.ProductionYear + '-01-01' : '';

                var card_data = {
                    id: tmdbId || item.Id,
                    source: tmdbId ? 'tmdb' : 'jellyfin',
                    type: type,
                    title: item.Name,
                    name: item.Name,
                    original_title: item.OriginalTitle || item.Name,
                    release_date: year,
                    first_air_date: year,
                    poster_path: '',
                    img: '',
                    vote_average: item.CommunityRating || 0
                };

                var card = new Lampa.Card(card_data, { card_category: true });
                card.create();

                var cardEl = card.render();
                cardEl.removeClass('card--preload').addClass('card--loaded');

                if (tmdbId) {
                    var lang = Lampa.Storage.get('language', 'uk');
                    var apiKey = Lampa.TMDB.key();
                    var tmdbUrl = Lampa.TMDB.api(type + '/' + tmdbId + '?api_key=' + apiKey + '&language=' + lang);

                    $.ajax({
                        url: tmdbUrl,
                        type: 'GET',
                        dataType: 'json',
                        timeout: 5000,
                        success: function (res) {
                            if (res && res.poster_path) {
                                var secureImg = Lampa.TMDB.image('t/p/w300' + res.poster_path);
                                card_data.poster_path = res.poster_path;
                                card_data.img = secureImg;
                                cardEl.find('.card__img').attr('src', secureImg);
                                if (cardEl.hasClass('focus')) {
                                    Lampa.Background.change(secureImg);
                                }
                            } else {
                                var localUrl = url + '/Items/' + item.Id + '/Images/Primary?api_key=' + token;
                                card_data.img = localUrl;
                                cardEl.find('.card__img').attr('src', localUrl);
                            }
                        },
                        error: function () {
                            var localUrl = url + '/Items/' + item.Id + '/Images/Primary?api_key=' + token;
                            card_data.img = localUrl;
                            cardEl.find('.card__img').attr('src', localUrl);
                        }
                    });
                } else {
                    var localUrl = url + '/Items/' + item.Id + '/Images/Primary?api_key=' + token;
                    card_data.img = localUrl;
                    cardEl.find('.card__img').attr('src', localUrl);
                }

                cardEl.on('hover:focus', function () {
                    if (card_data.img) {
                        Lampa.Background.change(card_data.img);
                    }
                });

                cardEl.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        url: '',
                        component: 'full',
                        id: card_data.id,
                        method: card_data.type,
                        card: card_data,
                        source: card_data.source
                    });
                });

                body.append(cardEl);
                files.push(card);
            });

            scroll.onScroll = function () {
                files.forEach(function (c) {
                    if (c.visible) c.visible();
                });
            };

            setTimeout(function () {
                files.forEach(function (c) {
                    if (c.visible) c.visible();
                });
            }, 100);

            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(scroll.render());
                    Lampa.Controller.collectionFocus(files.length ? files[0].render() : false, scroll.render());
                },
                right: function () { Navigator.move('right'); },
                left: function () {
                    if (Navigator.canmove('left')) Navigator.move('left');
                    else Lampa.Controller.toggle('menu');
                },
                down: function () { Navigator.move('down'); },
                up: function () {
                    if (Navigator.canmove('up')) Navigator.move('up');
                    else Lampa.Controller.toggle('head');
                },
                back: function () { Lampa.Activity.backward(); }
            });
            Lampa.Controller.toggle('content');
        };

        this.render = function () { return html; };
        this.start = function () { Lampa.Controller.toggle('content'); };
        this.pause = function () {};
        this.stop = function () {};
        this.destroy = function () {
            files.forEach(function (card) { card.destroy(); });
            files = [];
            scroll.destroy();
            html.remove();
        };
    }

    Lampa.Component.add('jellyfin_catalog', JellyfinCatalog);

})();
