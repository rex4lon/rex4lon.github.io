(function () {
  'use strict';

  // =========================
  // INIT PLATFORM
  // =========================
  Lampa.Platform.tv();

  const STORAGE_KEY = 'torrserver_url';
  const BUTTON_ID = 'SWITCH_SERVER';

  // =========================
  // SERVERS (твой список)
  // =========================
  const SERVERS = [
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

  // =========================
  // HELPERS
  // =========================
  function normalize(url) {
    if (!url.startsWith('http')) return 'http://' + url;
    return url;
  }

  function getServer() {
    return localStorage.getItem(STORAGE_KEY) || SERVERS[0];
  }

  function setServer(url) {
    localStorage.setItem(STORAGE_KEY, url);
  }

  function notify(text) {
    if (window.Lampa && Lampa.Noty) {
      Lampa.Noty.show(text);
    } else {
      console.log(text);
    }
  }

  // =========================
  // SWITCH SERVER
  // =========================
  function switchServer() {
    const current = getServer();

    let index = SERVERS.indexOf(current);
    if (index === -1) index = 0;

    index = (index + 1) % SERVERS.length;

    const next = normalize(SERVERS[index]);

    setServer(next);
    notify(`Сервер переключен: ${next}`);
  }

  // =========================
  // CHECK SERVER
  // =========================
  async function checkServer(url) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // =========================
  // AUTO DETECT WORKING SERVER
  // =========================
  async function autoDetect() {
    for (let server of SERVERS) {
      const url = normalize(server);
      const ok = await checkServer(url);

      if (ok) {
        setServer(url);
        notify(`Рабочий сервер: ${url}`);
        return;
      }
    }

    notify('Нет доступных серверов');
  }

  // =========================
  // UI BUTTON
  // =========================
  function createButton() {
    const btn = document.createElement('div');

    btn.id = BUTTON_ID;
    btn.className = 'head__action selector switch-screen';

    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/>
      </svg>
    `;

    btn.addEventListener('hover:enter hover:click hover:touch', switchServer);

    return btn;
  }

  function injectButton() {
    const header = document.querySelector('#app > div.head > div > div.head__actions');

    if (!header) return;

    if (!document.getElementById(BUTTON_ID)) {
      header.appendChild(createButton());
    }
  }

  // =========================
  // SETTINGS
  // =========================
  function addSettings() {
    if (!Lampa.Settings) return;

    Lampa.Settings.add({
      component: 'torrserver',
      name: 'Free TorrServer',
      description: 'Переключение серверов TorrServer'
    });

    Lampa.Settings.add({
      component: 'torrserver',
      field: {
        name: 'URL TorrServer',
        type: 'input',
        value: getServer()
      },
      onChange: (value) => {
        setServer(normalize(value));
        notify('Сервер сохранен');
      }
    });
  }

  // =========================
  // INIT
  // =========================
  function init() {
    injectButton();
    addSettings();
    autoDetect();
  }

  // =========================
  // LAMPA HOOK
  // =========================
  if (window.Lampa) {
    Lampa.Listener.follow('app', (event) => {
      if (event.type === 'ready') {
        init();
      }
    });
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
