(async function () {
  'use strict';
  Lampa.Platform.tv();

  const servers = [
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

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // сбрасываем статусы
  servers.forEach((_, i) => {
    Lampa.Storage.set(`FreeServ_${i+1}`, 'NotFound');
  });

  // проверка сервера с измерением времени ответа
  async function pingServer(url, index) {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(`http://${url}/echo`, { signal: controller.signal });
      clearTimeout(timeout);
      const ms = Date.now() - start;
      Lampa.Storage.set(`FreeServ_${index+1}`, url);
      return { url, index, ms };
    } catch (e) {
      Lampa.Storage.set(`FreeServ_${index+1}`, 'NotFound');
      return { url, index, ms: Infinity };
    }
  }

  // опрашиваем все серверы параллельно и выбираем лучший
  async function pollServers() {
    const results = await Promise.all(servers.map((url, i) => pingServer(url, i)));

    // сортируем по времени ответа
    const alive = results.filter(r => r.ms !== Infinity);
    if (alive.length === 0) return;

    alive.sort((a, b) => a.ms - b.ms);
    const best = alive[0];

    console.log(`[TorrServer] Лучший сервер: ${best.url} (${best.ms}ms)`);

    // автоматически применяем лучший
    Lampa.Storage.set('torrserver_url_two', best.url);
    Lampa.Storage.set('torrserver_use_link', 'two');

    // обновляем select чтобы показал выбранный
    Lampa.Storage.set('freetorrserv', String(best.index + 1));
    Lampa.Settings.update();
  }

  // скрываем NotFound в выпадающих списках
  setInterval(() => {
    const el = $('.selectbox-item.selector > div:contains("NotFound")');
    if (el.length > 0) el.parent('div').hide();
  }, 100);

  pollServers();

  // создаём пункт настроек
  setTimeout(() => {
    Lampa.SettingsApi.addParam({
      component: 'server',
      param: {
        name: 'freetorrserv',
        type: 'select',
        values: servers.reduce((acc, _, i) => {
          acc[i + 1] = Lampa.Storage.get(`FreeServ_${i+1}`) + '';
          return acc;
        }, {}),
        default: 0
      },
      field: {
        name: 'Бесплатный TorrServer #free',
        description: 'Выбирается автоматически по скорости. Можно сменить вручную'
      },
      onChange: function (value) {
        if (value === '0') {
          Lampa.Storage.set('torrserver_url_two', '');
        } else {
          const idx = Number(value) - 1;
          Lampa.Storage.set('torrserver_url_two', servers[idx]);
        }
        Lampa.Storage.set('torrserver_use_link', 'two');
        Lampa.Settings.update();
      },
      onRender: function (item) {
        setTimeout(function () {
          if ($('div[data-name="freetorrserv"]').length > 1) item.hide();
          $('.settings-param__name', item).css('color', 'f3d900');
          $(".ad-server").hide();
          $('div[data-name="freetorrserv"]').insertAfter(
            'div[data-name="torrserver_use_link"]'
          );
        }, 0);
      }
    });
  }, 5000);
})();
