(function () {
  'use strict';

  if (window._freeTorrServerLoaded) return;
  window._freeTorrServerLoaded = true;

  Lampa.Platform.tv();

  // ─── СЕРВЕРЫ ─────────────────────────────────────────────────────────────
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
    var shuffled = SERVERS.slice().sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < shuffled.length; i++) {
      var url = shuffled[i];
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
  async function _applyServer(notify) {
    var url = await _pickServer();
    if (url) {
      Lampa.Storage.set('torrserver_url_two', 'http://' + url);
      Lampa.Storage.set('torrserver_use_link', 'two');
      if (notify) Lampa.Noty.show('TorrServer изменён');
    } else {
      Lampa.Noty.show('TorrServer: нет доступных серверов');
    }
  }

  // ─── ТЕСТ СКОРОСТИ ───────────────────────────────────────────────────────
  async function _testSpeed() {
    var baseUrl = Lampa.Storage.get('torrserver_url_two') || Lampa.Storage.get('torrserver_url') || '';
    if (!baseUrl) { Lampa.Noty.show('Сервер не задан'); return; }
    Lampa.Noty.show('Тестирование...');
    var start = Date.now();
    try {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 8000);
      var res = await fetch(baseUrl + '/echo', { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) {
        Lampa.Noty.show('Пинг: ' + (Date.now() - start) + ' мс');
      } else {
        Lampa.Noty.show('TorrServer не отвечает');
      }
    } catch (e) {
      Lampa.Noty.show('TorrServer: ошибка подключения');
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
    if ($('#SWITCH_SERVER').length) return;
    var btnHtml = '<div id="SWITCH_SERVER" class="head__action selector switch-screen">' + _icon + '</div>';
    $('#app > div.head > div > div.head__actions').append(btnHtml);
    $('#SWITCH_SERVER').insertAfter('div[class="head__action selector open--settings"]');
    _updateButtonMode();
    $('#SWITCH_SERVER').on('hover:enter hover:click hover:touch', function () {
      _applyServer(true);
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
            _applyServer(true);
            Lampa.Activity.active('content');
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── НАСТРОЙКИ
