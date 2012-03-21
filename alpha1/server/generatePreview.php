<?php
session_start();
// Use $HTTP_SESSION_VARS with PHP 4.0.6 or less
if (!isset($_SESSION['htmldata'])) 
{
  $_SESSION['htmldata'] = $_POST["generateddata"];
} 
else 
{
    $_SESSION['htmldata'] = $_POST["generateddata"];
}
echo $_SESSION['htmldata'];
?>