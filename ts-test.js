(async function () {
  'use strict';
  Lampa.Platform.tv();

  const _s = [
    'MTg1LjIzNS4yMTguMTA5OjgwOTA=',
    'OTUuMTc0LjkzLjU6ODA5MA==',
    'NzcuMTEwLjEyMi4xMTU6ODA5MA==',
    'NzcuMjM4LjIyOC40MTo4MjkwMA==',
    'OTEuMTkyLjEwNS42OTo4MDkw',
    'MTk1LjY0LjIzMS4xOTI6ODA5MA==',
    'MTkzLjIyOC4xMjguMTEyL3Rz',
    'MzEuMTI5LjIzNC4xODEvdHM=',
    'NzguNDAuMTk1LjIxODo5MTE4L3Rz',
    'NDUuMTQ0LjUzLjI1OjM3OTQw'
  ];

  const _d = (s) => atob(s);

  const labels = _s.reduce((acc, _, i) => {
    acc[i + 1] = `Сервер ${i + 1}`;
    return acc;
  }, {});

  // НЕ сбрасываем статусы — при рестарте сразу работает последний известный сервер
  // Если статуса нет вообще — инициализируем впервые
  _s.forEach((_, i) => {
    if (!Lampa.Storage.get(`_fs${i}`)) Lampa.Storage.set(`_fs${i}`, '');
  });

  async function _ping(encoded, i) {
    const url = _d(encoded);
    const start = Date.now();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(`http://${url}/echo`, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error();
      Lampa.Storage.set(`_fs${i}`, encoded);
      return { i, ms: Date.now() - start };
    } catch {
      Lampa.Storage.set(`_fs${i}`, '');
      return { i, ms: Infinity };
    }
  }

  async function _poll() {
    const res = await Promise.all(_s.map((s, i) => _ping(s, i)));
    const alive = res.filter(r => r.ms !== Infinity).sort((a, b) => a.ms - b.ms);
    if (!alive.length) return;

    const best = alive[0];
    const current = Lampa.Storage.get('torrserver_url_two');
    const bestUrl = _d(_s[best.i]);

    // обновляем только если сервер изменился
    if (current !== bestUrl) {
      Lampa.Storage.set('torrserver_url_two', bestUrl);
      Lampa.Storage.set('torrserver_use_link', 'two');
      Lampa.Storage.set('_fsbest', String(best.i + 1));
      Lampa.Settings.update();
    }
  }

  // при старте применяем сохранённый сервер сразу, без ожидания пинга
  const savedBest = Lampa.Storage.get('_fsbest');
  if (savedBest) {
    const idx = Number(savedBest) - 1;
    const enc = _s[idx];
    if (enc) {
      Lampa.Storage.set('torrserver_url_two', _d(enc));
      Lampa.Storage.set('torrserver_use_link', 'two');
    }
  }

  // первый пинг сразу
  _poll();

  // перепроверяем каждые 5 минут
  setInterval(_poll, 5 * 60 * 1000);

  const _hide = () => {
    $('div[data-name="torrserver_url_two"]').hide();
    $('.selectbox-item.selector').each(function () {
      const val = parseInt($(this).data('value'));
      if (!isNaN(val) && val >= 1 && val <= _s.length) {
        const div = $(this).find('div');
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}/.test(div.text())) {
          div.text(`Сервер ${val}`);
        }
        if (!Lampa.Storage.get(`_fs${val - 1}`)) $(this).hide();
      }
    });
  };

  setInterval(_hide, 150);

  setTimeout(() => {
    Lampa.SettingsApi.addParam({
      component: 'server',
      param: {
        name: '_fsbest',
        type: 'select',
        values: labels,
        default: 0
      },
      field: {
        name: 'Бесплатный TorrServer #free',
        description: 'Выбирается автоматически по скорости'
      },
      onChange: function (value) {
        const idx = Number(value) - 1;
        const enc = _s[idx];
        Lampa.Storage.set('torrserver_url_two', enc ? _d(enc) : '');
        Lampa.Storage.set('torrserver_use_link', 'two');
        Lampa.Settings.update();
      },
      onRender: function (item) {
        setTimeout(function () {
          if ($('div[data-name="_fsbest"]').length > 1) item.hide();
          $('.settings-param__name', item).css('color', '#f3d900');
          $(".ad-server").hide();
          const anchor = $('div[data-name="torrserver_use_link"]');
          if (anchor.length) $('div[data-name="_fsbest"]').insertAfter(anchor);
          _hide();
        }, 100);
      }
    });
  }, 3000);
})();
