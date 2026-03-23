(function () {
  'use strict';

  Lampa.Platform.tv();

  // ─── СЕРВЕРЫ (base64) ────────────────────────────────────────────────────
  var _s = [
    'MTg1LjIzNS4yMTguMTA5OjgwOTA=',  // 185.235.218.109:8090
    'OTUuMTc0LjkzLjU6ODA5MA==',       // 95.174.93.5:8090
    'NzcuMTEwLjEyMi4xMTU6ODA5MA==',   // 77.110.122.115:8090
    'NzcuMjM4LjIyOC40MTo4Mjkw',       // 77.238.228.41:8290
    'OTEuMTkyLjEwNS42OTo4MDkw',       // 91.192.105.69:8090
    'MTk1LjY0LjIzMS4xOTI6ODA5MA==',   // 195.64.231.192:8090
    'MTkzLjIyOC4xMjguMTEyL3Rz',       // 193.228.128.112/ts
    'MzEuMTI5LjIzNC4xODEvdHM=',       // 31.129.234.181/ts
    'NzguNDAuMTk1LjIxODo5MTE4L3Rz',   // 78.40.195.218:9118/ts
    'NDUuMTQ0LjUzLjI1OjM3OTQw'        // 45.144.53.25:37940
  ];
  var _d = function (s) { return atob(s); };

  // ─── SVG ИКОНКА ──────────────────────────────────────────────────────────
  var _icon = '<svg version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor"><g id="SVGRepo_iconCarrier"><g><g><g>'
    + '<rect x="232.254" y="69.157" style="fill:#718176;" width="42.982" height="377.465"></rect>'
    + '<polygon style="fill:#718176;" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588"></polygon>'
    + '<polygon style="fill:#718176;" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588"></polygon>'
    + '<rect x="232.234" y="446.588" style="fill:#979696;" width="42.977" height="42.977"></rect>'
    + '<path style="fill:#718176;" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8c-4.315,0-7.8-3.485-7.8-7.8V7.837c0-4.315,3.485-7.799,7.8-7.799h496.372C508.487,0.037,511.972,3.522,511.972,7.837z"></path>'
    + '<path style="fill:#718176;" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8c-4.315,0-7.8-3.568-7.8-7.883v-105.05c0-4.315,3.485-7.8,7.8-7.8h496.372C508.487,140.518,511.972,144.003,511.972,148.318z"></path>'
    + '<path style="fill:#718176;" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8c-4.315,0-7.8-3.484-7.8-7.799v-105.05c0-4.314,3.485-7.799,7.8-7.799h496.372C508.487,281.082,511.972,284.568,511.972,288.882z"></path>'
    + '<path style="fill:currentColor;" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573C505.737,12.222,499.778,6.264,492.427,6.264z"></path>'
    + '<path style="fill:currentColor;" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1C505.737,152.749,499.778,146.79,492.427,146.79z"></path>'
    + '<path style="fill:currentColor;" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539C505.737,293.276,499.778,287.318,492.427,287.318z"></path>'
    + '<rect x="225.104" y="49.742" style="fill:#979696;" width="100.213" height="21.202"></rect>'
    + '<circle style="fill:#43B471;" cx="369.338" cy="61.198" r="19.487"></circle>'
    + '<circle style="fill:#D3D340;" cx="416.663" cy="61.198" r="19.487"></circle>'
    + '<circle style="fill:#D15075;" cx="463.989" cy="61.198" r="19.487"></circle>'
    + '<rect x="225.104" y="190.269" style="fill:#979696;" width="100.213" height="21.202"></rect>'
    + '<circle style="fill:#43B471;" cx="369.338" cy="201.725" r="19.487"></circle>'
    + '<circle style="fill:#D3D340;" cx="416.663" cy="201.725" r="19.487"></circle>'
    + '<circle style="fill:#D15075;" cx="463.989" cy="201.725" r="19.487"></circle>'
    + '<rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect>'
    + '<circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle>'
    + '<circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle>'
    + '<circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle>'
    + '</g></g></g></g></svg>';

  var _fieldName = '<div class="settings-folder" style="padding:0!important">'
    + '<div style="width:1.3em;height:1.3em;padding-right:.1em">' + _icon + '</div>'
    + '<div style="font-size:1.0em"><div style="padding:.3em .3em;padding-top:0">'
    + '<div style="background:#d99821;padding:.5em;border-radius:.4em">'
    + '<div style="line-height:.3">Free TorrServer</div>'
    + '</div></div></div></div>';

  // ─── ВЫБОР ЖИВОГО СЕРВЕРА ─────────────────────────────────────────────────
  async function _pickServer() {
    var shuffled = _s.slice().sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < shuffled.length; i++) {
      var url = _d(shuffled[i]);
      try {
        var ctrl = new AbortController();
        var t = setTimeout(function () { ctrl.abort(); }, 4000);
        var res = await fetch('http://' + url + '/echo', { signal: ctrl.signal });
        clearTimeout(t);
        if (res.ok) return url;
      } catch (e) {}
    }
    return null;
  }

  // ─── ПРИМЕНИТЬ СЕРВЕР ─────────────────────────────────────────────────────
  async function _applyServer() {
    var url = await _pickServer();
    if (url) {
      Lampa.Storage.set('torrserver_url_two', 'http://' + url);
      Lampa.Storage.set('torrserver_use_link', 'two');
      Lampa.Noty.show('TorrServer: ' + url);
    } else {
      Lampa.Noty.show('Нет доступных серверов');
    }
  }

  // ─── ТЕСТ СКОРОСТИ ───────────────────────────────────────────────────────
  async function _testSpeed() {
    var baseUrl = Lampa.Storage.get('torrserver_url_two') || Lampa.Storage.get('torrserver_url') || '';
    if (!baseUrl) {
      Lampa.Noty.show('Сервер не задан');
      return;
    }
    Lampa.Noty.show('Тестирование...');
    var start = Date.now();
    try {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 8000);
      var res = await fetch(baseUrl + '/echo', { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) {
        var ms = Date.now() - start;
        Lampa.Noty.show('Пинг: ' + ms + ' мс — ' + baseUrl.replace('http://', ''));
      } else {
        Lampa.Noty.show('Сервер не отвечает');
      }
    } catch (e) {
      Lampa.Noty.show('Ошибка подключения');
    }
  }

  // ─── РЕЖИМЫ ПОКАЗА КНОПКИ ────────────────────────────────────────────────
  function _hiddenMode() {
    setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
  }

  function _showInTorrents() {
    setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 50);
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      var comp = Lampa.Activity.active().component;
      if (comp === 'torrents') setTimeout(function () { $('#SWITCH_SERVER').show(); }, 100);
      else                     setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 50);
    });
  }

  function _showAlways() {
    setTimeout(function () { $('#SWITCH_SERVER').show(); }, 50);
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      setTimeout(function () { $('#SWITCH_SERVER').show(); }, 50);
    });
  }

  function _updateButtonMode() {
    var mode = Lampa.Storage.get('switch_server_button');
    if (mode == 1) _hiddenMode();
    if (mode == 2) _showInTorrents();
    if (mode == 3) _showAlways();
  }

  // ─── КНОПКА В ШАПКЕ ──────────────────────────────────────────────────────
  function _initButton() {
    var btnHtml = '<div id="SWITCH_SERVER" class="head__action selector switch-screen">' + _icon + '</div>';
    $('#app > div.head > div > div.head__actions').append(btnHtml);
    $('#SWITCH_SERVER').insertAfter('div[class="head__action selector open--settings"]');
    _updateButtonMode();
    $('#SWITCH_SERVER').on('hover:enter hover:click hover:touch', function () {
      _applyServer();
    });
  }

  // ─── MUTATIONOBSERVER: ошибка → сменить сервер ───────────────────────────
  function _startErrorObserver() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (!$(m.target).is('.modal__title')) return;
        var title = $('.modal__title').text().trim();
        if (title !== Lampa.Lang.translate('torrent_error_connect')) return;

        $('.torrent-checklist__progress-bar > div').remove();
        $('.torrent-checklist__progress-steps').remove();
        $('.torrent-checklist__list > li').remove();

        var descr = $('.torrent-checklist__descr');
        if (descr.length) descr.html('Сервер не ответил — нажмите кнопку ниже для замены');

        var btn = $('.modal .simple-button');
        if (btn.length) {
          btn.html('Сменить сервер');
          btn.off('hover:enter hover:click hover:touch');
          btn.on('hover:enter hover:click hover:touch', function () {
            $('.modal').remove();
            _applyServer();
            Lampa.Activity.active('content');
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── НАСТРОЙКИ ────────────────────────────────────────────────────────────

  // 1. Free TorrServer — главный переключатель
  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name:    'torrserv',
      type:    'select',
      values:  { 0: 'Свой вариант', 1: 'Автовыбор' },
      default: 1
    },
    field: {
      name:        _fieldName,
      description: 'Нажмите для смены сервера'
    },
    onChange: function (value) {
      if (value == '0') {
        Lampa.Storage.set('torrserver_use_link', 'one');
        Lampa.Storage.set('torrserver_url_two', '');
        _hiddenMode();
        Lampa.Settings.update();
        return;
      }
      if (value == '1') {
        Lampa.Storage.set('torrserver_use_link', 'two');
        _applyServer();
        _updateButtonMode();
        Lampa.Settings.update();
        return;
      }
    },
    onRender: function (item) {
      setTimeout(function () {
        if ($('div[data-name="torrserv"]').length > 1) item.hide();
        $('.settings-param__name', item).css('color', '#ffffff');

        if (Lampa.Storage.field('torrserv') == '1') {
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_url"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div > span:contains("Ссылки")').remove();
          $('div > span:contains("Посилання")').remove();
        }
        if (Lampa.Storage.field('torrserv') == '0') {
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div[data-name="switch_server_button"]').hide();
          $('div[data-name="torrserv_speed_test"]').hide();
        }
      }, 0);
    }
  });

  // 2. Кнопка для смены сервера
  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name:    'switch_server_button',
      type:    'select',
      values:  { 1: 'Не показывать', 2: 'Показывать только в торрентах', 3: 'Показывать всегда' },
      default: '2'
    },
    field: {
      name:        'Кнопка для смены сервера',
      description: 'Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера'
    },
    onChange: function () { _updateButtonMode(); },
    onRender: function () {
      setTimeout(function () {
        $('div[data-name="switch_server_button"]').insertAfter('div[data-name="torrserver_url"]');
      }, 0);
    }
  });

  // 3. Тест скорости
  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'torrserv_speed_test',
      type: 'button'
    },
    field: {
      name:        'Тестувати швидкість',
      description: ''
    },
    onClick: function () {
      _testSpeed();
    },
    onRender: function () {
      setTimeout(function () {
        $('div[data-name="torrserv_speed_test"]').insertAfter('div[data-name="switch_server_button"]');
      }, 0);
    }
  });

  // ─── СТАРТ ────────────────────────────────────────────────────────────────
  var _wait = setInterval(function () {
    if (typeof Lampa !== 'undefined') {
      clearInterval(_wait);
      _boot();
    }
  }, 200);

  function _boot() {
    if (localStorage.getItem('torrserv') === null || localStorage.getItem('torrserv') == 1) {
      Lampa.Storage.set('torrserv', '1');
      Lampa.Storage.set('torrserver_url_two', '');
      setTimeout(function () {
        _applyServer();
        Lampa.Storage.set('torrserver_use_link', 'two');
      }, 3000);
    }

    if (localStorage.getItem('switch_server_button') === null) {
      Lampa.Storage.set('switch_server_button', '2');
    }

    if (Lampa.Platform.is('android')) {
      Lampa.Storage.set('internal_torrclient', true);
    }

    _startErrorObserver();
  }

  // ─── КНОПКА ПОСЛЕ ЗАГРУЗКИ APP ───────────────────────────────────────────
  if (window.appready) {
    _initButton();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type == 'ready') _initButton();
    });
  }

})();
