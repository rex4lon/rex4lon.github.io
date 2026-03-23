(function () {
  'use strict';

  if (window._freeTorrServerLoaded) return;
  window._freeTorrServerLoaded = true;

  Lampa.Platform.tv();

  // ─── SVG иконка для кнопки в шапке (currentColor) ───────────────────────
  var _btnSvg = '<svg version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor"><g id="SVGRepo_iconCarrier"> <g> <polygon style="fill:none;" points="275.211,140.527 360.241,140.527 380.083,120.685 275.211,120.685 "></polygon> <polygon style="fill:none;" points="232.234,268.534 219.714,281.054 232.234,281.054 "></polygon> <g> <g> <rect x="232.254" y="69.157" style="fill:#718176;" width="42.982" height="377.465"></rect> <polygon style="fill:#718176;" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588 "></polygon> <polygon style="fill:#718176;" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588 "></polygon> <rect x="232.234" y="446.588" style="fill:#979696;" width="42.977" height="42.977"></rect> <path style="fill:#718176;" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8c-4.315,0-7.8-3.485-7.8-7.8V7.837 c0-4.315,3.485-7.799,7.8-7.799h496.372C508.487,0.037,511.972,3.522,511.972,7.837z"></path> <path style="fill:#718176;" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8c-4.315,0-7.8-3.568-7.8-7.883v-105.05 c0-4.315,3.485-7.8,7.8-7.8h496.372C508.487,140.518,511.972,144.003,511.972,148.318z"></path> <path style="fill:#718176;" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8c-4.315,0-7.8-3.484-7.8-7.799v-105.05 c0-4.314,3.485-7.799,7.8-7.799h496.372C508.487,281.082,511.972,284.568,511.972,288.882z"></path> <path style="fill:#FFFFFF;" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539 c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573 C505.737,12.222,499.778,6.264,492.427,6.264z"></path> <path style="fill:#FFFFFF;" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31 h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1C505.737,152.749,499.778,146.79,492.427,146.79z"></path> <path style="fill:#FFFFFF;" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539 c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539 C505.737,293.276,499.778,287.318,492.427,287.318z"></path> <rect x="225.104" y="49.742" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="61.198" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="61.198" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="61.198" r="19.487"></circle> <rect x="225.104" y="190.269" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="201.725" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="201.725" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="201.725" r="19.487"></circle> <rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle> </g></g></g></g></svg>';

  // ─── SVG для поля настроек (fill="#000000" — оригинал) ───────────────────
  var _fieldSvg = '<svg version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" width="256px" height="256px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <polygon style="fill:none;" points="275.211,140.527 360.241,140.527 380.083,120.685 275.211,120.685 "></polygon> <polygon style="fill:none;" points="232.234,268.534 219.714,281.054 232.234,281.054 "></polygon> <g> <g> <rect x="232.254" y="69.157" style="fill:#718176;" width="42.982" height="377.465"></rect> <polygon style="fill:#718176;" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588 "></polygon> <polygon style="fill:#718176;" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588 "></polygon> <rect x="232.234" y="446.588" style="fill:#979696;" width="42.977" height="42.977"></rect> <path style="fill:#718176;" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8c-4.315,0-7.8-3.485-7.8-7.8V7.837 c0-4.315,3.485-7.799,7.8-7.799h496.372C508.487,0.037,511.972,3.522,511.972,7.837z"></path> <path style="fill:#718176;" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8c-4.315,0-7.8-3.568-7.8-7.883v-105.05 c0-4.315,3.485-7.8,7.8-7.8h496.372C508.487,140.518,511.972,144.003,511.972,148.318z"></path> <path style="fill:#718176;" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8c-4.315,0-7.8-3.484-7.8-7.799v-105.05 c0-4.314,3.485-7.799,7.8-7.799h496.372C508.487,281.082,511.972,284.568,511.972,288.882z"></path> <path style="fill:#FFFFFF;" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539 c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573 C505.737,12.222,499.778,6.264,492.427,6.264z"></path> <path style="fill:#FFFFFF;" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31 h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1C505.737,152.749,499.778,146.79,492.427,146.79z"></path> <path style="fill:#FFFFFF;" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539 c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539 C505.737,293.276,499.778,287.318,492.427,287.318z"></path> <rect x="225.104" y="49.742" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="61.198" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="61.198" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="61.198" r="19.487"></circle> <rect x="225.104" y="190.269" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="201.725" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="201.725" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="201.725" r="19.487"></circle> <rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect> <circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle> <circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle> <circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle> </g></g></g></g></svg>';

  var _fieldName =
    '<div class="settings-folder" style="padding:0!important">' +
    '<div style="width:1.3em;height:1.3em;padding-right:.1em">' + _fieldSvg + '</div>' +
    '<div style="font-size:1.0em"><div style="padding: 0.3em 0.3em; padding-top: 0;">' +
    '<div style="background: #d99821; padding: 0.5em; border-radius: 0.4em;">' +
    '<div style="line-height: 0.3;">Free TorrServer</div>' +
    '</div></div></div></div>';

  // ─── Смена сервера: оригинальный endpoint, без проверки bylampa ──────────
  function changeServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://185.87.48.42:8090/random_torr', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var ip = xhr.responseText;
        Lampa.Storage.set('torrserver_url_two', 'http://' + ip + ':8090');
      } else {
        console.error('Ошибка при получении IP-адреса:', xhr.status);
        Lampa.Noty.show('Ошибка запроса');
      }
    };
    xhr.onerror = function () {
      console.error('Ошибка при получении IP-адреса:', xhr.status);
      Lampa.Noty.show('Ошибка запроса');
    };
    xhr.send();
  }

  // ─── Режимы кнопки ───────────────────────────────────────────────────────

  // mode=1: скрыть, при activity всегда скрывать
  function hiddenMode() {
    setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      if (Lampa.Activity.active().component !== 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
      if (Lampa.Activity.active().component === 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
    });
  }

  // mode=2: скрыть, при torrents показать
  function showInTorrents() {
    setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      if (Lampa.Activity.active().component !== 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 10);
      if (Lampa.Activity.active().component === 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').show(); }, 10);
    });
  }

  // mode=3: показать, при activity всегда показывать
  function showAlways() {
    setTimeout(function () { $('#SWITCH_SERVER').show(); }, 10);
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      if (Lampa.Activity.active().component !== 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').show(); }, 10);
      if (Lampa.Activity.active().component === 'torrents')
        setTimeout(function () { $('#SWITCH_SERVER').show(); }, 10);
    });
  }

  // диспетчер
  function updateButtonMode() {
    if (Lampa.Storage.field('switch_server_button') == 1) hiddenMode();
    if (Lampa.Storage.field('switch_server_button') == 2) showInTorrents();
    if (Lampa.Storage.field('switch_server_button') == 3) showAlways();
  }

  // ─── Инициализация кнопки в шапке ───────────────────────────────────────
  // Точная копия _0x5152e2 (второй блок оригинала)
  function initButton() {
    var btnHtml = '<div id="SWITCH_SERVER" class="head__action selector switch-screen">' + _btnSvg + '</div>';

    $('#app > div.head > div > div.head__actions').append(btnHtml);
    $('#SWITCH_SERVER').insertAfter('div[class="head__action selector open--settings"]');

    // mode==1 → hide через 500мс
    if (Lampa.Storage.field('switch_server_button') == 1)
      setTimeout(function () { $('#SWITCH_SERVER').hide(); }, 500);

    // mode==2 → showInTorrents
    if (Lampa.Storage.field('switch_server_button') == 2)
      showInTorrents();

    // mode==3 → show
    if (Lampa.Storage.field('switch_server_button') == 3)
      $('#SWITCH_SERVER').show();

    // torrserv==0 → hiddenMode
    if (Lampa.Storage.field('torrserv') == 0)
      hiddenMode();

    // клик
    $('#SWITCH_SERVER').on('hover:enter hover:click hover:touch', function () {
      Lampa.Noty.show('TorrServer изменён');
      changeServer();
    });
  }

  // ─── MutationObserver ────────────────────────────────────────────────────
  // Точная копия второго блока: var _0x322a3f объявлен внутри listener
  // запускается если torrserv===null или ==1
  if (localStorage.getItem('torrserv') === null || localStorage.getItem('torrserv') == 1) {
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;

      var observer; // объявлен в замыкании

      if (Lampa.Activity.active().component === 'torrents') {
        if (!observer) {
          observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
              if (!$(m.target).is('.modal__title')) return;
              var title = $('.modal__title').text().trim();
              if (title === Lampa.Lang.translate('torrent_error_connect')) {
                $('.torrent-checklist__progress-bar > div').remove();
                $('.torrent-checklist__progress-steps').remove();
                $('.torrent-checklist__list > li').remove();

                var descr = $('.torrent-checklist__descr');
                if (descr.length)
                  descr.html('Сервер не ответил, нажмите кнопку снизу для его замены на другой !');

                var btn = $('.modal .simple-button');
                if (btn.length) {
                  btn.html('Сменить сервер');
                  btn.on('hover:enter hover:click hover:touch', function () {
                    $('.modal').remove();
                    Lampa.Noty.show('TorrServer изменён');
                    changeServer();
                    Lampa.Activity.back('content');
                  });
                }
              }
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      } else {
        if (observer) { observer.disconnect(); observer = null; }
      }
    });
  }

  // ─── Boot ────────────────────────────────────────────────────────────────
  // Точная копия _0x2da124 (второй блок):
  // - НЕ set torrserv='1'
  // - clear torrserver_url_two, через 3000мс: changeServer() + set use_link='two'
  // - switch_server_button===null → set '2' + showInTorrents
  var _wait = setInterval(function () {
    if (typeof Lampa !== 'undefined') {
      clearInterval(_wait);
      boot();
    }
  }, 200);

  function boot() {
    if (localStorage.getItem('torrserv') === null || localStorage.getItem('torrserv') == 1) {
      Lampa.Storage.set('torrserver_url_two', '');
      setTimeout(function () {
        changeServer();
        Lampa.Storage.set('torrserver_use_link', 'two');
      }, 3000);
    }

    if (localStorage.getItem('switch_server_button') === null)
      showInTorrents();

    if (Lampa.Platform.is('android'))
      Lampa.Storage.set('internal_torrclient', true);
  }

  // ─── Настройки ───────────────────────────────────────────────────────────

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
      if (value == '0') {
        Lampa.Storage.set('torrserver_use_link', 'one');
        Lampa.Storage.set('torrserver_url_two', '');
        if (Lampa.Storage.get('switch_server_button') !== 1) hiddenMode();
        Lampa.Settings.update();
        return;
      }
      if (value == '1') {
        Lampa.Noty.show('TorrServer изменён');
        Lampa.Storage.set('torrserver_use_link', 'two');
        changeServer();
        updateButtonMode();
        Lampa.Settings.update();
        return;
      }
    },
    onRender: function (item) {
      setTimeout(function () {
        if ($('div[data-name="torrserv"]').length > 1) item.hide();

        $('.settings-param__name', item).css('color', 'ffffff');
        $('div[data-name="torrserv"]').insertAfter('div[data-name="torrserver_use_link"]');

        if (Lampa.Storage.field('torrserv') == '1') {
          var el = document.querySelector(
            '#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)'
          );
          Lampa.Controller.focus(el);
          Lampa.Controller.toggle('settings_component');
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_url"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div > span:contains("Ссылки")').remove();
        }

        if (Lampa.Storage.field('torrserv') == '0') {
          var el = document.querySelector(
            '#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)'
          );
          Lampa.Controller.focus(el);
          Lampa.Controller.toggle('settings_component');
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div[data-name="switch_server_button"]').hide();
        }
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
      description: 'Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера'
    },
    onChange: function () {
      updateButtonMode();
    },
    onRender: function (item) {
      setTimeout(function () {
        $('div[data-name="switch_server_button"]').insertAfter('div[data-name="torrserver_url"]');
      }, 0);
    }
  });

  // ─── Запуск ──────────────────────────────────────────────────────────────
  if (window.appready) {
    initButton();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type == 'ready') initButton();
    });
  }

})();
