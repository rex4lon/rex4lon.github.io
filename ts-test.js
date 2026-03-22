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

  _s.forEach((_, i) => Lampa.Storage.set(`_fs${i}`, ''));

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
    Lampa.Storage.set('torrserver_url_two', _d(_s[best.i]));
    Lampa.Storage.set('torrserver_use_link', 'two');
    Lampa.Storage.set('_fsbest', String(best.i + 1));
    Lampa.Settings.update();
  }

  const _hide = () => {
    // основное поле torrserver_url — НЕ трогаем
    $('div[data-name="torrserver_url_two"]').hide();
    $('div[data-name="torrserver_use_link"]').hide();
    $('div.settings-param__name:contains("Посилання")').closest('.settings-param').hide();
    $('.selectbox-item.selector > div').each(function () {
      const txt = $(this).text();
      if (/\d{1,3}\.\d{1,3}\.\d{1,3}/.test(txt) || txt === 'NotFound') {
        $(this).parent().hide();
      }
    });
    $('.selectbox-item.selector').each(function () {
      const idx = parseInt($(this).data('value')) - 1;
      if (!isNaN(idx) && !Lampa.Storage.get(`_fs${idx}`)) $(this).hide();
    });
  };

  setInterval(_hide, 150);

  _poll();

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
          $('div[data-name="_fsbest"]').insertAfter('div[data-name="torrserver_use_link"]');
          _hide();
        }, 0);
      }
    });
  }, 5000);
})();
