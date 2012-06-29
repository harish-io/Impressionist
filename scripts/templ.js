/**
 * Impressionist
 *
 * Impressionist is a visual ide for impress.js. impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Impressionist Copyright 2012 Harish Sivaramakrishnan (@hsivaram) 
 */
 
var templatearray =
					[

						 "<html><head><title>Impressionist previewer - (by @hsivaram)</title>",
						 "<link href='http://fonts.googleapis.com/css?family=Inika:400,700' rel='stylesheet' type='text/css'>",
						 "<link href='http://fonts.googleapis.com/css?family=Bevan' rel='stylesheet' type='text/css'><link href='css/style.css' rel='stylesheet' />",
						 "<link href='http://fonts.googleapis.com/css?family=Doppio+One' rel=',stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Henny+Penny' rel='stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Ribeye+Marrow' rel='stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Unkempt' rel='stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Fresca' rel='stylesheet' type='text/css'>",
    					 "<link href='http://fonts.googleapis.com/css?family=Walter+Turncoat' rel='stylesheet' type='text/css'>",
						 "<link href='css/mappingstyle.css' rel='stylesheet' />",
						 "<script src='scripts/jquery.js'></script>",
						 "</head>",
						 "<body class='impress-not-supported'>",
						 "<div id='impress' style='background-color:#FFCC00;'>",
						 "<div></div>",
						 "!____PLACEHOLDER____!",
						 "</div>",
						 "<script src='scripts/impress.js'></script>",
                         "<script>impress().init();</script>",
						 "</body>",
						 "</html>"
					];

var largetext = "<h3 class='!OBJECT_SIZE! slideobject' id='!ID!' data-font-size='largeheader' data-font-face='Inika' data-selected-color='#000000'>This is sample text</h3>";
var orchtemplate = "<div class='orchestrationthumbnail' id='!SLIDE_ID!'><div id='!THUMBCONTID!'></div><span id='!XP!'class='label label-info xspan'></span><span id='!YP!' class='label label-info vspan'></span><p id='!SLIDENUMBER!' class='slidethumbnailnumberorch'>!COUNT!</p><div class='subbottombar'><a class='blackp' id='!OROT!'>!ROTTEXT!<sup>o</sup></a></div><div class='bottombar'><a class='whitep' id='!ZP!'>!DEPTH!</a><br/><a class='whitep' ></a></div></div>";
var slidethumbtemplate = "<div class='slidethumbnail' id='!SLIDE_ID!'><p class='slidethumbnailnumber' id='!THUMBDISPLAYNUMBER!'>!COUNT!</p><p id='!THUMBDELETE!' class='thumbdeleteicon deletehide' onclick='deleteSlide()'>x</p></div>";
var slidetemplate="<div class='mainslide step' id='!SLIDE_ID!'></div>";
var pictemplate = "<img class='slideimage' id='!IMG_ID!' src='!IMG_SRC!'></img>";
var presotemplate = "<li class='presolistitem' id='!PRESOID!'>!PRESOTITLE!</li>";
var paginationtemplate = "<li><a href='#' class='whiteanchor' id='!PAGINATIONID!'>!PAGECOUNT!</a></li>"
var ultemplate = "<ul id='!ULID!'><li></li></ul>";


var fontStyle = "largeheader";
var bevantext = "'Bevan', serif;";
var inikatext = "'Inika', serif;";

