<?php

$myFile = "epg.txt";
$fh = fopen($myFile, 'w');
fwrite($fh,$_POST['data']);
fclose($fh);

?>