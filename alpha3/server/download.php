<?php
/* creates a compressed zip file */
$filename = $_GET["filename"];
function create_zip($files = array(),$destination = '',$overwrite = false) {
  //if the zip file already exists and overwrite is false, return false
  if(file_exists($destination) && !$overwrite) { return false; }
  //vars
  $valid_files = array();
  //if files were passed in...
  if(is_array($files)) {
    //cycle through each file
    foreach($files as $file => $local) {
      //make sure the file exists
      if(file_exists($file)) {
        $valid_files[$file] = $local;
      }
    }
  }
  //if we have good files...
  if(count($valid_files)) {
    //create the archive
    $zip = new ZipArchive();
    if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
      return false;
    }

    //add the files
    foreach($valid_files as $file => $local) {
      $zip->addFile($file, $local);
    }

    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
    
    //close the zip -- done!
    $zip->close();
    
    //check to make sure the file exists
    return file_exists($destination);
  }
  else
  {
    return false;
  }
}

$files_to_zip = array(
  __DIR__.'/css/mappingstyle.css' => '/css/mappingstyle.css',
  __DIR__.'/css/style.css' => '/css/style.css',
  __DIR__.'/scripts/jquery.js' => '/scripts/jquery.js',
  __DIR__.'/scripts/impress.js' => '/scripts/impress.js',
  realpath(__DIR__.'/../output/'.$filename.'.html') => $filename.'.html'
);
//if true, good; if false, zip creation failed
$result = create_zip($files_to_zip, $filename.'.zip');
?>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>impressionist - v 0.0.1.0 | Download</title>
       <link href='http://fonts.googleapis.com/css?family=Inika:400,700' rel='stylesheet' type='text/css'>

     <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet" />
     <script src="../scripts/jquery.js"></script>
     <script src="../css/mainstyle.css"></script>
     <script type="text/javascript" src=" http://twitter.github.com/bootstrap/assets/js/bootstrap-button.js"></script>

 </head>
 <body>
 <div id="hero">
  <div class="hero-unit" style="position:absolute; left: 25%;top:30%; font-family:'Inika', serif; border: 1px dotted #0ca4eb;">
  <h1>Congrats! You are all set.</h1>
  <p>Filename: <?php echo $filename.".zip"?> </p>
  <p>
    <a href='<?php echo $filename.".zip"?>' class="btn btn-info btn-large">
      Download File
    </a>
  </p>
</div>
</div>

</body>
