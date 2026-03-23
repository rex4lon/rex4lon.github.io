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

  var _icon = `<svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
  <rect x="232" y="69" width="43" height="377" fill="#718176"/>
  <rect x="232" y="446" width="43" height="43" fill="#979696"/>
  <circle cx="369" cy="61" r="19" fill="#43B471"/>
  <circle cx="416" cy="61" r="19" fill="#D3D340"/>
  <circle cx="463" cy="61" r="19" fill="#D15075"/>
  </svg>`;

  var _fieldName = '<div class="settings-folder" style="padding:0!important">'
    + '<div style="width:1.3em;height:1.3em;padding-right:.1em">' + _icon + '</div>'
    + '<div style="font-size:1.0em"><div style="padding:.3em .3em;padding-top:0">'
    + '<div style="background:#d99821;padding:.5em;border-radius:.4em">'
    + '<div style="line-height:.3">Free TorrServer</div>'
    + '</div></div></div></div>';

  async function _pickServer() {
    var shuffled = SERVERS.slice().sort(() => Math.random() - 0.5);
    for (var url of shuffled) {
      try {
        var ctrl = new AbortController();
        var t = setTimeout(() => ctrl.abort(), 4000);
        var res = await fetch('http://' + url + '/echo', { signal: ctrl.signal });
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

  function _updateButtonMode() {
    var mode = Lampa.Storage.get('switch_server_button');
    if (mode == 1) $('#SWITCH_SERVER').hide();
    if (mode == 2) $('#SWITCH_SERVER').hide();
    if (mode == 3) $('#SWITCH_SERVER').show();
  }

  function _initButton() {
    if ($('#SWITCH_SERVER').length) return;

    var btn = $('<div id="SWITCH_SERVER" class="head__action selector switch-screen">' + _icon + '</div>');
    $('#app .head__actions').append(btn);

    btn.on('hover:enter hover:click hover:touch', function () {
      _applyServer(true);
    });

    _updateButtonMode();
  }

  function _startFixDuplicates() {
    setTimeout(function () {

      // ❗ УДАЛЯЕМ ОРИГИНАЛЬНЫЙ BLOК LAMPA
      $('div[data-name="torrserv"]').not('._fts-torrserv').remove();

      // ❗ УДАЛЯЕМ ОРИГИНАЛЬНУЮ КНОПКУ СКОРОСТИ
      $('div[data-name="torrserv_speed_test"]').remove();

    }, 300);
  }

  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'torrserv',
      type: 'select',
      values: { 0: 'Свой вариант', 1: 'Автовыбор' },
      default: 1
    },
    field: {
      name: _fieldName,
      description: 'Нажмите для смены сервера'
    },
    onChange: function (value) {
      if (value == '1') _applyServer(true);
    },
    onRender: function (item) {
      item.hide();
      setTimeout(function () {

        // ❗ фикс дубликатов
        $('div[data-name="torrserv"]').not(item).remove();

        item.addClass('_fts-torrserv');
        item.prependTo(item.parent());
        item.show();

      }, 0);
    }
  });

  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'switch_server_button',
      type: 'select',
      values: {
        1: 'Не показывать',
        2: 'Показывать только в торрентах',
        3: 'Показывать всегда'
      },
      default: '2'
    },
    field: {
      name: 'Кнопка для смены сервера',
      description: 'Отображение кнопки'
    },
    onChange: _updateButtonMode
  });

  var wait = setInterval(function () {
    if (typeof Lampa !== 'undefined') {
      clearInterval(wait);

      _startFixDuplicates();

      if (window.appready) _initButton();
      else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') _initButton();
        });
      }
    }
  }, 200);

})();
