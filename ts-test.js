(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    //  КОНФИГУРАЦИЯ
    // ─────────────────────────────────────────────────────────────────────────
    var SERVERS = [
        'http://185.235.218.109:8090',
        'http://95.174.93.5:8090',
        'http://77.110.122.115:8090',
        'http://77.238.228.41:8290',
        'http://91.192.105.69:8090',
        'http://195.64.231.192:8090',
        'http://193.228.128.112/ts',
        'http://31.129.234.181/ts',
        'http://78.40.195.218:9118/ts',
        'http://45.144.53.25:37940'
    ];

    var COMP_ID     = 'torrservpublic';
    var KEY_IDX     = 'torrserv_idx';
    var KEY_URL     = 'torrserverurl';
    var KEY_USELINK = 'torrserveruselink';

    // ─────────────────────────────────────────────────────────────────────────
    //  SVG ИКОНКА СЕРВЕРА
    // ─────────────────────────────────────────────────────────────────────────
    var SVG_ICON = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"'
        + ' xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"'
        + ' xml:space="preserve" fill="currentColor" width="100%" height="100%">'
        + '<g><polygon style="fill:none" points="275.211,140.527 360.241,140.527 380.083,120.685 275.211,120.685"/>'
        + '<polygon style="fill:none" points="232.234,268.534 219.714,281.054 232.234,281.054"/></g>'
        + '<g>'
        + '<rect x="232.254" y="69.157" style="fill:#718176" width="42.982" height="377.465"/>'
        + '<polygon style="fill:#718176" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588"/>'
        + '<polygon style="fill:#718176" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588"/>'
        + '<rect x="232.234" y="446.588" style="fill:#979696" width="42.977" height="42.977"/>'
        + '<path style="fill:#718176" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8'
        +   'c-4.315,0-7.8-3.485-7.8-7.8V7.837c0-4.315,3.485-7.799,7.8-7.799h496.372'
        +   'C508.487,0.037,511.972,3.522,511.972,7.837z"/>'
        + '<path style="fill:#718176" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8'
        +   'c-4.315,0-7.8-3.568-7.8-7.883v-105.05c0-4.315,3.485-7.8,7.8-7.8h496.372'
        +   'C508.487,140.518,511.972,144.003,511.972,148.318z"/>'
        + '<path style="fill:#718176" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8'
        +   'c-4.315,0-7.8-3.484-7.8-7.799v-105.05c0-4.314,3.485-7.799,7.8-7.799h496.372'
        +   'C508.487,281.082,511.972,284.568,511.972,288.882z"/>'
        + '<path style="fill:#ffffff" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539'
        +   'c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573'
        +   'C505.737,12.222,499.778,6.264,492.427,6.264z"/>'
        + '<path style="fill:#ffffff" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539'
        +   'c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1'
        +   'C505.737,152.749,499.778,146.79,492.427,146.79z"/>'
        + '<path style="fill:#ffffff" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539'
        +   'c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539'
        +   'C505.737,293.276,499.778,287.318,492.427,287.318z"/>'
        + '<circle style="fill:#43B471" cx="369.338" cy="61.198" r="19.487"/>'
        + '<circle style="fill:#D3D340" cx="416.663" cy="61.198" r="19.487"/>'
        + '<circle style="fill:#D15075" cx="463.989" cy="61.198" r="19.487"/>'
        + '<circle style="fill:#43B471" cx="369.338" cy="201.725" r="19.487"/>'
        + '<circle style="fill:#D3D340" cx="416.663" cy="201.725" r="19.487"/>'
        + '<circle style="fill:#D15075" cx="463.989" cy="201.725" r="19.487"/>'
        + '<circle style="fill:#43B471" cx="369.338" cy="342.252" r="19.487"/>'
        + '<circle style="fill:#D3D340" cx="416.663" cy="342.252" r="19.487"/>'
        + '<circle style="fill:#D15075" cx="463.989" cy="342.252" r="19.487"/>'
        + '</g></svg>';

    // ─────────────────────────────────────────────────────────────────────────
    //  ХРАНИЛИЩЕ
    // ─────────────────────────────────────────────────────────────────────────
    function _lsGet(key, def) {
        var v = localStorage.getItem(key);
        return v !== null ? v : def;
    }

    function _lsSet(key, val) {
        try { localStorage.setItem(key, val); } catch (e) {}
    }

    function getIdx() {
        var raw = Lampa.Storage.get(KEY_IDX);
        if (raw === null || raw === undefined || raw === '') {
            raw = _lsGet(KEY_IDX, '0');
        }
        var v = parseInt(raw, 10);
        return (!isNaN(v) && v >= 0 && v < SERVERS.length) ? v : 0;
    }

    function setIdx(idx) {
        if (isNaN(idx) || idx < 0) idx = 0;
        if (idx >= SERVERS.length) idx = 0;
        Lampa.Storage.set(KEY_IDX, idx);
        Lampa.Storage.set(KEY_URL, SERVERS[idx]);
        _lsSet(KEY_IDX, idx);
        _lsSet(KEY_URL, SERVERS[idx]);
    }

    function getUseLink() {
        var v = Lampa.Storage.get(KEY_USELINK);
        if (v === null || v === undefined) v = _lsGet(KEY_USELINK, '0');
        return v === true || v === 'true' || v === '1' || v === 1;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  КНОПКА ПЕРЕКЛЮЧЕНИЯ В ШАПКЕ
    // ─────────────────────────────────────────────────────────────────────────
    function _btnEl() {
        return document.querySelector('[data-name="switchserverbutton"]');
    }

    function renderBtn() {
        var btn = _btnEl();
        if (!btn) return;
        var t = btn.querySelector('.head-action__title');
        if (t) t.innerHTML = 'TS&nbsp;' + (getIdx() + 1);
    }

    function showBtn() {
        var btn = _btnEl();
        if (btn) { btn.style.display = ''; renderBtn(); }
    }

    function hideBtn() {
        var btn = _btnEl();
        if (btn) btn.style.display = 'none';
    }

    function onSwitchClick() {
        var next = (getIdx() + 1) % SERVERS.length;
        setIdx(next);
        renderBtn();
        Lampa.Noty.show('TorrServer ' + (next + 1) + ': ' + SERVERS[next].replace('http://', ''));
    }

    function buildSwitchBtnHtml() {
        return '<div data-name="switchserverbutton"'
            + ' class="head-action selector switch-screen"'
            + ' style="display:none">'
            + '<div style="width:1.3em;height:1.3em;padding-right:.1em">'
            + SVG_ICON
            + '</div>'
            + '<div class="head-action__title">TS&nbsp;' + (getIdx() + 1) + '</div>'
            + '</div>';
    }

    function injectSwitchBtn() {
        if (_btnEl()) return;
        var wrap = document.querySelector('div.head div.headactions');
        if (!wrap) wrap = document.querySelector('div.headactions');
        if (!wrap) return;

        var tmp = document.createElement('div');
        tmp.innerHTML = buildSwitchBtnHtml();
        var btn = tmp.firstChild;

        btn.addEventListener('click',       onSwitchClick);
        btn.addEventListener('touchstart',  onSwitchClick);
        btn.addEventListener('hover:enter', function () { onSwitchClick(); });
        btn.addEventListener('hover:click', function () { onSwitchClick(); });

        wrap.insertBefore(btn, wrap.firstChild);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ИКОНКА В НАСТРОЙКАХ
    // ─────────────────────────────────────────────────────────────────────────
    function buildSettingsIconHtml() {
        return '<div class="settings-folder" style="padding:0!important">'
            + '<div style="width:1.3em;height:1.3em;padding-right:.1em">'
            + SVG_ICON
            + '</div>'
            + '<div style="font-size:1.0em">'
            + '<div style="padding:.3em .3em;padding-top:0">'
            + '<div style="background:#d99821;padding:.5em;border-radius:.4em">'
            + '<div style="line-height:.3">TorrServer</div>'
            + '</div></div></div></div>';
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  РЕГИСТРАЦИЯ НАСТРОЕК
    // ─────────────────────────────────────────────────────────────────────────
    function buildSelectValues() {
        var obj = {};
        SERVERS.forEach(function (url, i) {
            obj[i] = 'TS ' + (i + 1) + '  —  ' + url.replace('http://', '');
        });
        return obj;
    }

    function registerSettings() {
        // Иконка / заголовок раздела
        Lampa.SettingsApi.addParam({
            component: COMP_ID,
            param: { name: COMP_ID + '_label', type: 'table' },
            field: { name: buildSettingsIconHtml(), description: '' }
        });

        // Выбор активного сервера
        Lampa.SettingsApi.addParam({
            component: COMP_ID,
            param: {
                name:    KEY_IDX,
                type:    'select',
                values:  buildSelectValues(),
                default: 0
            },
            field: {
                name:        'Активный сервер',
                description: 'Выберите публичный TorrServer'
            },
            onChange: function (val) {
                setIdx(parseInt(val, 10));
                renderBtn();
            }
        });

        // Прямые ссылки
        Lampa.SettingsApi.addParam({
            component: COMP_ID,
            param: {
                name:    KEY_USELINK,
                type:    'toggle',
                default: false
            },
            field: {
                name:        'Прямые ссылки',
                description: 'Передавать прямой URL вместо стриминга через TorrServer'
            },
            onChange: function (val) {
                Lampa.Storage.set(KEY_USELINK, val);
                _lsSet(KEY_USELINK, val ? '1' : '0');
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ПОКАЗ / СКРЫТИЕ КНОПКИ ПРИ СМЕНЕ АКТИВИТИ
    // ─────────────────────────────────────────────────────────────────────────
    function onActivityChange(e) {
        if (e.type === 'start') {
            var comp = (e.object && e.object.component) ? e.object.component : '';
            if (comp === 'torrents' || comp === 'torrent' || comp === 'player') {
                setTimeout(showBtn, 50);
            } else {
                setTimeout(hideBtn, 50);
            }
        }
        if (e.type === 'end') {
            setTimeout(hideBtn, 50);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MUTATIONOBSERVER — АВТОПЕРЕВОД НОВЫХ DOM-УЗЛОВ
    // ─────────────────────────────────────────────────────────────────────────
    function startObserver() {
        if (typeof MutationObserver === 'undefined') return;
        var obs = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (node.nodeType !== 1) continue;
                    if (!node.querySelectorAll) continue;
                    node.querySelectorAll('.settings-param__name').forEach(function (el) {
                        if (Lampa.Lang && Lampa.Lang.translate) {
                            var t = Lampa.Lang.translate(el.textContent.trim());
                            if (t) el.textContent = t;
                        }
                    });
                }
            }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ИНИЦИАЛИЗАЦИЯ
    // ─────────────────────────────────────────────────────────────────────────
    function init() {
        // Дефолты при первом запуске
        if (Lampa.Storage.get(KEY_IDX) === null || Lampa.Storage.get(KEY_IDX) === undefined) {
            setIdx(0);
        }
        if (!Lampa.Storage.get(KEY_URL)) {
            Lampa.Storage.set(KEY_URL, SERVERS[getIdx()]);
            _lsSet(KEY_URL, SERVERS[getIdx()]);
        }

        // Регистрация плагина
        if (Lampa.Manifest) {
            Lampa.Manifest.field({
                name:        'TorrServer Public',
                description: 'Публичные TorrServer серверы',
                component:   COMP_ID
            });
        }

        registerSettings();

        // После загрузки приложения — вставить кнопку в шапку
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                setTimeout(injectSwitchBtn, 400);
            }
        });

        // Слушатель активити — показ/скрытие кнопки
        Lampa.Listener.follow('activity', onActivityChange);

        // Синхронизация при программной смене KEY_IDX
        Lampa.Storage.listener.follow(KEY_IDX, function (val) {
            var idx = parseInt(val, 10);
            if (!isNaN(idx) && idx >= 0 && idx < SERVERS.length) {
                _lsSet(KEY_IDX, idx);
                _lsSet(KEY_URL, SERVERS[idx]);
                renderBtn();
            }
        });

        startObserver();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ОЖИДАНИЕ LAMPA
    // ─────────────────────────────────────────────────────────────────────────
    var _wait = setInterval(function () {
        if (typeof Lampa !== 'undefined'
            && Lampa.Manifest
            && Lampa.SettingsApi
            && Lampa.Storage
            && Lampa.Listener
            && Lampa.Noty)
        {
            clearInterval(_wait);
            init();
        }
    }, 200);

})();
