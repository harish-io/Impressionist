<?php

// Use $HTTP_SESSION_VARS with PHP 4.0.6 or less
//$inputdata = stripslashes($_POST["generateddata"]);

//session_start();
$result = $_POST["data"];
$filename = stripslashes($_POST["filename"]);
//echo $_SESSION['htmldata'];
$fp = fopen('../output/'.$filename.".html", 'w');
fwrite($fp, stripslashes($result));
fclose($fp);
echo "success".$_POST["filename"].$_POST["data"];
?>