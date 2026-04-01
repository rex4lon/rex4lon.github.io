(function () {  
    'use strict';  
      
    var unic_id = Lampa.Storage.get('lampac_unic_id', '');  
    if (!unic_id) {  
      unic_id = Lampa.Utils.uid(8).toLowerCase();  
      Lampa.Storage.set('lampac_unic_id', unic_id);  
    }  
  
    // Настройки стороннего TorrServer  
    Lampa.Storage.set('torrserver_url', 'http://176.117.76.60:8090/');  
    Lampa.Storage.set('torrserver_auth', 'true');  
    Lampa.Storage.set('torrserver_login', 'novanetua');  
    Lampa.Storage.set('torrserver_password', 'framo');  
      
})();
