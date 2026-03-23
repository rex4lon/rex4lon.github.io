(function () {
  'use strict';

  if (window._freeTorrServerLoaded) return;
  window._freeTorrServerLoaded = true;

  Lampa.Platform.tv();

  var SERVERS = [
    '185.235.218.109:8090',
    '95.174.93.5:8090',
    '77.110.122.115:8090',
    '77.238.228.41:8290',
    '91.192.105.69:8090',
    '195.64.231.192:8090',
    '193.228.128.112/ts',
    '31.129.234.181/ts',
    '78.40.195.218:9118/ts',
    '45.144.53.25:37940'
  ];

  // ─── ВЫБОР СЕРВЕРА ─────────────────
  async function _pickServer() {
    var shuffled = SERVERS.slice().sort(() => Math.random() - 0.5);
    for (let url of shuffled) {
      try {
        let ctrl = new AbortController();
        let t = setTimeout(() => ctrl.abort(), 4000);
        let res = await fetch('http://' + url + '/echo', { signal: ctrl.signal });
        clearTimeout(t);
        if (res.ok) return url;
      } catch (e) {}
    }
    return null;
  }

  async function _applyServer(notify) {
    var url = await _pickServer();
    if (url) {
      Lampa.Storage.set('torrserver_url_two', 'http://' + url);
      Lampa.Storage.set('torrserver_use_link', 'two');
      if (notify) Lampa.Noty.show('TorrServer изменён');
    } else {
      Lampa.Noty.show('Нет доступных серверов');
    }
  }

  async function _testSpeed() {
    var baseUrl = Lampa.Storage.get('torrserver_url_two') || '';
    if (!baseUrl) return Lampa.Noty.show('Сервер не задан');

    var start = Date.now();
    try {
      let res = await fetch(baseUrl + '/echo');
      if (res.ok) {
        Lampa.Noty.show('Пинг: ' + (Date.now() - start) + ' мс');
      }
    } catch (e) {
      Lampa.Noty.show('Ошибка');
    }
  }

  // ─── ФИКС ДУБЛЕЙ (ГЛАВНОЕ) ─────────────────
  function _fixDuplicates() {
    setTimeout(function () {

      // удаляем оригинальный блок выбора сервера
      $('div[data-name="torrserv"]').each(function () {
        if (!$(this).hasClass('_fts-torrserv')) {
          $(this).remove();
        }
      });

      // удаляем оригинальную кнопку скорости
      $('div[data-name="torrserv_speed_test"]').remove();

    }, 300);
  }

  // ─── НАСТРОЙКИ ─────────────────
  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'torrserv',
      type: 'select',
      values: { 0: 'Свой вариант', 1: 'Автовыбор' },
      default: 1
    },
    field: {
      name: '<span style="color:#fff">Free TorrServer</span>',
      description: 'Нажмите для смены сервера'
    },
    onChange: function (value) {
      if (value == '1') _applyServer(true);
    },
    onRender: function (item) {
      item.hide();

      setTimeout(function () {

        // ❗ правильный фикс (не ломает порядок)
        $('._fts-torrserv').not(item).remove();

        item.addClass('_fts-torrserv');

        // вставляем В НАЧАЛО, как в оригинале
        item.prependTo(item.parent());

        item.show();

      }, 0);
    }
  });

  // ─── КНОПКА ─────────────────
  function _initButton() {
    if ($('#SWITCH_SERVER').length) return;

    var btn = $('<div id="SWITCH_SERVER" class="head__action selector switch-screen">TS</div>');

    $('#app .head__actions').append(btn);

    btn.on('hover:enter hover:click hover:touch', function () {
      _applyServer(true);
    });
  }

  // ─── СТАРТ ─────────────────
  var wait = setInterval(function () {
    if (typeof Lampa !== 'undefined') {
      clearInterval(wait);

      _fixDuplicates();

      if (window.appready) _initButton();
      else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') _initButton();
        });
      }
    }
  }, 200);

})();
