<?php
echo '<pre>';

$ultima_linea = system('start Shell.exe', $retval);

echo '
</pre>
<hr />Ultima linea de la salida: ' . $ultima_linea . '
<hr />Valor de retorno: ' . $retval;
?>
