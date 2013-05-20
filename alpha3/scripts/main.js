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
/**
 * variables
 */
 //********************************//

var editedobjectchanged = false;
//Slide counter
var totalSlides = 0;
//Array to hold the slides
var slidesArray = [];
//Objects (within the slide counter)
var objectcounter = 0;
//Current object type (text / image / video)
var currentAddObject = "";
//Whether an item is selected or not
var itemSelected = false;
//Whether a slide is selected or not
var slideselected = false;
//Current selected slide
var currentSelected = "";
//Target slide to add an object to
var addTarget = "";
//The object currently under edit
var editedobject = "";
//Whether the editor is toasted or not.
var editorvisible = false;
//Picture objects counter
var piccounter = 0;
//X Coordinate of the currently edited object
var editedobjectx = "";
//Y Coordinate of the currently edited object
var editedobjecty = "";
//Bold toggle
var isBold = false;
//Italic toggle
var isItalic = false;
var isUnderline = false;
//Counter to assign the id for a new slide. Increments.
var slidecounter = 1;
//Whether color pickler menu is open
var colorboxopen = false;
//Current selected font
var selectedFont = "";
//Triggers when the mouse down is tracked on a large image.
//HACK: Usually add is triggered when the mouse down is on the slide, this flag triggers add object when mouse down is over an image.
var bypasscondition = false;
//Default xposition of the orchestration thumbnail
var orchxpos = 20;
//Default skewx for objects
var skewx=0
//Default skewy for objects
var skewy =0;
//Default rotation for objects
var rot = 0;
//REMOVE: variable that holds the pre orchestrated data.
var premodoutput = ""
//Pre postions to re-trace the orchestration if previously done.
var prepositions = new Array();
//viewport x max
var vxmax = 6000;
//Viewport x min
var vxmin = -6000;
//Viewport y max
var vymax = 6000;
//Viewport y min
var vymin = -6000;
//Window x max
var wxmax = 1600;
//Window x min
var wxmin = 0;
//Window y max
var wymax = 650;
//Window y min
var wymin = 0;

//viewport x max
var o_vxmax = 120;
//Viewport x min
var o_vxmin = 0;
//Viewport y max
var o_vymax = 90;
//Viewport y min
var o_vymin = 0;
//Window x max
var o_wxmax = 1000;
//Window x min
var o_wxmin = 0;
//Window y max
var o_wymax = 600;
//Window y min
var o_wymin = 0;
var isMoving = false;


//toggle add object button click state.
var addObjectFlag = false;

var objectmap = new Array();
var ctrlDown = false;
var shiftDown = false;
var ctrlKey1 = 91, ctrlKey2 = 11, vKey = 86, cKey = 67, xKey = 88, leftKey=37, upKey=38, rightKey=39, downKey=40, saveKey=83, oKey1= 79, nKey = 78;
var iscopied = false;
var clonedelement = "";
var ismarkedforcut = false;
var objecttocopy = "";
var selectedorchslide = "";
var currentsliderotation = 0;
var slidemap = new Array();
var recount = 1;
var currentSaveName = "";
var savedObjects = new Array();
var savedPresentations = new Array();
var oldpresoselected = false;
var currentSelectedProject = "";
var replacepreso = false;
var markedforcreate = false;
var previewoutputstring = "";
var markedfordownload = false;
var orchestrationdataarray = [];
var editorToast = false;
var picwindowopen = false;
var firstRetrieve = false;
var thumbCounter = 0;
var firstLayout = true;
var orchpages = 0;
var currentOrchPage = 0;
var isOrchestration = false;
var currentSelectedFont = "Inika";
var currentselectedslidethumb = "";

//startup
//setup all the UI methods. Code in appui.js
function init()
{
	//localStorage.clear();	
	console.log("I am the correct file")
	$(document).bind("mouseup", onDocMouseUp);
	//$("#mask").css("visibility", "visible")
	$("#play").css("visibility","hidden")
	$("#deleteBtn").css("visibility", "hidden");
	setupUI();
	setupKnobs();
	setupColorPicker();
	addSlide();
	togglePaginator(false);
	//checkForSavedPresentations();
	setupClipboard();
	attachKeymaster();
	//$('.scroll-pane').jScrollPane();

}
function attachKeymaster()
{
	key('⌘+d, ctrl+d', 
		function()
		{ 
			//alert('stopped reload!'); 
			deleteObject();
			return false ;
		});
}
function togglePaginator(bool)
{
	if(!bool)
	{
		$("#orchestrationpaginator").css("visibility", "hidden")

	}
	else
	{
		$("#orchestrationpaginator").css("visibility", "visible")

	}
}
function onDocMouseUp(event)
{
	var isslide = (event.target.id).split("____slide");
	if(event.target.id == "" || isslide.length > 1 || event.target.id=="footerbar")
	{
		//toggleToolbarControls(false);
	}
	var isobj = (event.target.id).split("____object");
	if(isobj.length > 1)
	{
		//toggleToolbarControls(true);
		//editedobject = "#"+event.target.id;;
	}
	if(editorvisible && event.target.id != "editorBox" && !isOrchestration && isslide.length > 1 )
	{
		hideEditorBox();
		toggleToolbarControls(false);
		if($("#editorBox").val() != "")
		{
			//$(editedobject).text($("#editorBox").val());
		}
		var x =  $(editedobject).css("left");
		var y =  $(editedobject).css("top");
		editedobjecty = y;
		editedobjectx = x;
		resetEditedObject();
		editorvisible = false;

	}
}
function getOrchestrationData()
{
	var arr = $("#orchestrationarea").children();
	orchestrationdataarray = new Array();
	for(var i =0; i<arr.length; i++)
	{
		var child = arr[i].id
		if(child.split("orch_slide").length > 1)
		{
			var l = $("#"+child).css("left");
			var t = $("#"+child).css("top");
			var id = $("#"+child).attr("id").split("orch_slide____slide")[1];
			var rotation = $("#"+child).attr("data-rotate");
			var z = $("#"+child).attr("data-z");
			var scale = $("#"+child).attr("data-scale");
			var datarotatex = $("#"+child).attr("data-rotate-x");
			var datarotatey = $("#"+child).attr("data-rotate-y");

			if(rotation == undefined)
			{
				rotation = 0;
			}
			if(scale == undefined)
			{
				scale = 1;
			}
			if(z == undefined)
			{
				z = 0;
			}
			orchestrationdataarray.push("id:"+id+"__left:"+l+"__top:"+t+"__rot:"+rotation+"__z:"+z+"__scale:"+scale+"__datarotatex:"+datarotatex+"__datarotatey:"+datarotatey);
		}
	}
	return orchestrationdataarray.join("$*$");
}
function createNewPresentation()
{
	//$("#drawingboard").html('<a href="#" id="deleteBtn" class="deleteicon" style="z-index:0; left:-20000px" onclick="deleteObject()">x</a>');
	$("#slidethumbnailholder").html("");
	slidecounter =1;
	objectcounter= 0;
	addSlide();
	markedforcreate = false;
}
function restoreProject(s)
{
	var arr = s.split("{|||}")
	var thumbstr = arr[0];
	var objectmapstr = arr[1];

	var domstr = arr[2];
	var orchstr = arr[3];
	var thumbidarr = thumbstr.split("<>");
	var objectmaparr = objectmapstr.split("<>");
	var orcharr = orchstr.split("$*$");
	repopulateSlidemap(thumbidarr);
	repopulateObjectmap(objectmaparr);
	addSlidesFromStore(domstr);
	addThumbnailsFromStore(thumbidarr);
	addOrchestrationThumbnailsFromStore(orcharr)
	showPresentationView();
	firstRetrieve = true;

}

function repopulateObjectmap(arr)
{
	objectmap = new Array();
	for(var i=0; i<arr.length; i++)
	{
		objectmap.push({index: arr[i]});
	}
}
function repopulateSlidemap(arr)
{
	slidemap = new Array();
	for(var i=0; i<arr.length; i++)
	{
		slidemap.push({index: arr[i]});
	}
	slidecounter = parseInt(arr[arr.length - 1]) + 1;
}
function setupClipboard()
{
	$(document).bind("keydown", onDocumentKeyDown);
	$(document).bind("keyup", onDocumentKeyUp);
}
function onDocumentKeyDown(event)
{
	if(event.keyCode == 16)
	{
		shiftDown = true;
	}
	if(event.keyCode == leftKey)
	{
		moveLeft()
	}
	else if(event.keyCode == rightKey)
	{
		moveRight();
	}
	else if(event.keyCode == upKey)
	{
		moveUp();
	}
	else if(event.keyCode == downKey)
	{
		moveDown();
	}
	if(event.keyCode == ctrlKey1 || event.keyCode == ctrlKey2)
	{
			ctrlDown = true;
	}
	if(ctrlDown && event.keyCode == cKey)
	{
		objecttocopy = $(editedobject)
		if(editedobject != "")
		{
			iscopied = true;
		}
		else
		{
			iscopied = false;
		}
	}
	if(ctrlDown && event.keyCode == vKey)
	{
		
			if(iscopied && !picwindowopen)
			{
				cloneElement();
			}
	}
	if(ctrlDown && event.keyCode == saveKey)
	{
		event.preventDefault();
		doSave()

	}
	if(ctrlDown && shiftDown && event.keyCode == saveKey)
	{
		event.preventDefault();
		doSaveAs()

	}
	if(ctrlDown && shiftDown && event.keyCode == nKey)
	{
		event.preventDefault();
		saveAndCreate();

	}
	if(ctrlDown && event.keyCode == oKey1)
	{
		event.preventDefault();
		checkForSavedPresentations()
	}
}

function getObjectMapString()
{
	var temparr = new Array();
	for(var i=0; i<objectmap.length; i++)
	{
		if(objectmap[i].index != -1)
		{
			temparr.push(objectmap[i].index);
		}
	}
	var s = temparr.join("<>");
	return s;
}
function getSlidemapString()
{
	var s = "";
	var temparr = new Array();
	for(var i=0; i<slidemap.length; i++)
	{
		temparr.push(slidemap[i].index);
	}
	s = temparr.join("<>");
	return s;

}
function onDocumentKeyUp(event)
{
	if(event.keyCode == ctrlKey1)
	{
		ctrlDown = false;
	}
	if(event.keyCode == 16)
	{
		shiftDown = false;
	}
}
function moveLeft()
{
	$("#play").css("visibility", "hidden");
	if(editedobject != "")
	{
		var l = parseInt($(editedobject).css("left").split("px")[0]);
		var t = parseInt($(editedobject).css("top").split("px")[0]);
		if(shiftDown)
		{
			l = l-10;
			$(editedobject).css("left", l);
		}
		else
		{
			l = l-1;
			$(editedobject).css("left", l);
		}
		//$(editedobject).css("left", l);
		positionDeleteButton();
		positionSkewControls();

	}
}
function moveRight()
{
	$("#play").css("visibility", "hidden");

	if(editedobject != "")
	{
		var l = parseInt($(editedobject).css("left").split("px")[0]);
		var t = parseInt($(editedobject).css("top").split("px")[0]);
		if(shiftDown)
		{
			l = l+10;
			$(editedobject).css("left", l);
		}
		else
		{

			l = l+2;
			$(editedobject).css("left", l);
		}
		
		positionDeleteButton();
		positionSkewControls();


		
	}
}
function moveUp()
{
	$("#play").css("visibility", "hidden");

	if(editedobject != "")
	{
		var l = parseInt($(editedobject).css("left").split("px")[0]);
		var t = parseInt($(editedobject).css("top").split("px")[0]);
		if(shiftDown)
		{
			t = t-10;
			$(editedobject).css("top", t);

		}
		else
		{
			t = t-2;
			$(editedobject).css("top", t);

		}
		
		positionDeleteButton();
		positionSkewControls();


	}
}
function moveDown()
{
	$("#play").css("visibility", "hidden");

	if(editedobject != "")
	{
		var l = parseInt($(editedobject).css("left").split("px")[0]);
		var t = parseInt($(editedobject).css("top").split("px")[0]);
		if(shiftDown)
		{
			t = t+10;
			$(editedobject).css("top", t);

		}
		else if(!shiftDown)
		{
			t = t+2;
		    $(editedobject).css("top", t);

		}
		positionDeleteButton();
		positionSkewControls();
	}
}


//Add a image to the stage once the URL is entered.
function onURLEntered()
{
	if($("#urlinput").val() != "")
	{
		$("#previewimg").attr("src", $("#urlinput").val());
	}
}
//Add a slide to the presentation
function onThumbnailMouseOver(event)
{
	item  = $("#delete_btn_"+event.currentTarget.id);
	item.css("opacity", 1);

}
function onThumbnailMouseOut(event)
{
	item  = $("#delete_btn_"+event.currentTarget.id);
	item.css("opacity", 0);
	
}
function onSlideMouseUp(event)
{
	/*if(editorvisible && editedobject!="")
	{
		console.log("Commit bug fix")
		   if($("#editorBox").val()!="")
		   {
			$(editedobject).text($("#editorBox").val());
			hideEditorBox();
			resetEditedObject();
		   }
	}
	*/


	var target = (event.target.id).split("____slide");
	console.log("Mouse uping "+event.target.id);
	if(target.length > 1)
	{
	
		$("#contextbar").css("visibility", "hidden");
		$("#play").css("visibility", "hidden");


		$(editedobject).removeClass("itemselected");
		itemSelected = false;
		$("#deleteBtn").css("opacity", 0);
		toggleToolbarControls(false);
		if(editorvisible)
		{
			//$(editedobject).text($("#editorBox").val());
		}
		if(addObjectFlag == false)
			currentAddObject = "";
	}
	if(ismarkedforcut && editedobject!="")
	{
		$(editedobject).css("opacity", 1)
		ismarkedforcut = false;

	}
	if(ismarkedforcut)
	{
		cutobject.css("opacity", 1);
		ismarkedforcut = false;
	}
	addObjectFlag = false;
	console.log("Ammeda kindi: " +editor.getValue());
}
function calculateTextWidth()
{

}
//Set the edited object when an object is selected
function doObjectSelection(event)
{
	console.log("fontStyle "+fontStyle);
	//event.preventDefault();
	toggleToolbarControls(true);
	//$("#deleteBtn").css("visibility", "visible")

	$("#play").css("visibility", "hidden");
	//$("#play").css("z-index", 0);
	$("#deleteBtn").css("opacity", 0)
	$("#contextbar").css("visibility", "visible");

	var prevFont;
	if("#"+event.target.id != editedobject)
	{
		console.log("Inside eo change");
			//$(editedobject).text($("#editorBox").val());
		    $(editedobject).removeClass("itemselected");
		    prevFont = $(editedobject).css("font-family");
		    //$("#"+event.target.id).css("-webkit-transform","matrix(1,0,0,1,0,0)");
			//itemSelected = false;
			editedobjectchanged = true;
			currentAddObject =""
			//hideEditorBox();
	}
	else
	{
		editedobjectchanged = false;
	}
	editedobject = "#"+event.target.id;
	var x = parseInt($(editedobject).css("left").split("px")[0]);
	var y = parseInt($(editedobject).css("top").split("px")[0]);
	var w = $(editedobject).width()
	var h = parseInt($(editedobject).css("height").split("px")[0]);
	$("#play").css("left",x + 300)
	$("#play").css("top", y + 220);
	$("#play").css("width", w)
	$("#play").css("height", h)
	var wt = $(editedobject).css("-webkit-transform");
	console.log("WTEEE "+wt)
	$("#play").css("-webkit-transform",wt);
	console.log("prev font "+currentSelectedFont);
	$(editedobject).css("z-index", 20)
	$(editedobject).css("font-family", currentSelectedFont);
	console.log(x+"     --   "+y)
	var h = parseInt($(editedobject).css("height").split("px")[0])
	$("#contextbar").css("left", x+145)
	$("#contextbar").css("top", (y+h)+90);
	if($(editedobject).attr("data-pic") == "true")
	{
		console.log("picture boss")
		$("#mask").css("visibility", "visible")
	}
	else
	{
		$("#mask").css("visibility", "hidden")

	}

	if(!itemSelected)
	{
			$(editedobject).addClass("itemselected");
			//$(editedobject).css("-webkit-transform",$("#play").css("-webkit-transform"));
			itemSelected = true;
			$("#deleteBtn").css("left", $(editedobject).css("left"));
			$("#deleteBtn").css("top", $(editedobject).css("top"));
	}
	if($(editedobject).attr("data-pic") != "true")
	{
		setFontStyle($(editedobject).attr("data-font-size"));
		setFont($(editedobject).attr("data-font-face"));
		$("#colorSelector").css('backgroundColor', $(editedobject).attr("data-selected-color"));
	}
	else
	{
		setFontStyle("");
		setFont("");
	}
	//setupColorPicker((editedobject).attr("data-selected-color"))
	resetSkewValues();
}
function positionSkewControls()
{
	var x = parseInt($(editedobject).css("left").split("px")[0]);
	var y = parseInt($(editedobject).css("top").split("px")[0]);
	var w = $(editedobject).width()
	var h = parseInt($(editedobject).css("height").split("px")[0]);
	$("#play").css("left",x + 300)
	$("#play").css("top", y + 220);
	$("#play").css("width", w)
	$("#play").css("height", h)
	var wt = $(editedobject).css("-webkit-transform");
	$("#play").css("-webkit-transform",wt);
	$("#play").css("visibility", "visible");
}
function resetSkewValues()
{
	$("#knobit1").val($(editedobject).attr("data-skewx"));
	$("#knobit2").val($(editedobject).attr("data-skewy"));

}
//When mouse is clicked over the stage where a slide is added.
function triggerObjectAdd(event)
{

	if(editorvisible == true)
	{
		editorvisible = false;
		hideEditorBox();	
		resetEditedObject()
		return;
	}
	if("#"+event.target.id == addTarget)
	{
		if(itemSelected)
		{
			itemSelected = false;
			$(editedobject).removeClass("itemselected");
			
				$("#deleteBtn").css("opacity", 0);
				$("#deleteBtn").css("left", -30000);
				currentAddObject = "";
			
		}
	}
	var idcheck = (event.target.id).split("____picture");
	if(idcheck.length > 1)
	{
		bypasscondition = true;
	}
	else
	{
		bypasscondition = false;
	}
	if((currentAddObject == "text" && "#"+event.target.id == addTarget) || (currentAddObject == "text" && bypasscondition == true))
	{		
			$("#play").css("-webkit-transform","matrix(1,0,0,1,0,0)")
	    	if(colorboxopen)
	 		{
	 			colorboxopen = false;
	 			return;
	 		}
			if("#"+event.target.id == addTarget || bypasscondition == true)
			{
				objectcounter = Math.round(Math.random()*100000);
				var str = largetext.split("!ID!").join("____object"+objectcounter);
				str = str.split("!OBJECT_SIZE!").join(fontStyle);
				$(addTarget).append(str)	
				objectmap.push({index:objectcounter});
				console.log("Object id "+"#____object"+objectcounter)
				var obj = calculateOrchCoords(event.offsetX, event.offsetY);
				var offsetx = event.offsetX;
				var offsety = event.offsetY;

				$("#____object"+objectcounter).css("left", event.offsetX);
				$("#____object"+objectcounter).css("top", event.offsetY);
				$("#____object"+objectcounter).css("font-family", currentSelectedFont);
				$("#____object"+objectcounter).bind("mousedown", doObjectSelection)
				$("#____object"+objectcounter).bind("mouseup", onMouseUp)
				$("#____object"+objectcounter).bind("drag", onObjectDrag)
				$("#____object"+objectcounter).draggable(
						{
						   //appendTo: addTarget
						   cursor:"pointer"
						}
					 );
				$("#____object"+objectcounter).css("-webkit-transform","matrix(1,0,0,1,0,0)")
				if(editedobject!="")
				{
					$(editedobject).removeClass("itemselected");
					//$(editedobject).css("-webkit-transform","matrix(1,0,0,1,0,0)");
					itemSelected = false;
					$("#deleteBtn").css("opacity", 0)
					currentAddObject = "";


				}
				editedobject = ("#____object"+objectcounter);
				$(editedobject).css("font-family", selectedFont);
				console.log("Update previe call");
				isMoving = false;
				//updateSlidePreview();
				//$(editedobject).css("-webkit-transform","matrix(1,0,0,1,0,0)");
			objectcounter++;
			}
	}
	else
	{

		positionDeleteButton()
		colorboxopen = false;	

	}

}
function updateSlidePreview()
{
			var l = $(editedobject).css("left").split("px")[0];
			var t = $(editedobject).css("top").split("px")[0];
			var o = calculateOrchCoords(l, t);

			var object = $(editedobject);
			console.log("Edited object in slide or" + $(editedobject).attr("id"));
			var clonedobject;
			var coords = o
			if(!isMoving)
			{
				clonedobject = object.clone();
				clonedobject.css("left", coords.x);
				clonedobject.css("top", coords.y);
				clonedobject.attr("id", "slide_thumbnailof_"+clonedobject.attr("id"));
			}
			else
			{
				clonedobject = $("#slide_thumbnailof_"+object.attr("id"));
				clonedobject.css("left", coords.x);
				clonedobject.css("top", coords.y);
				console.log("-->"+clonedobject.attr("id"));
			}
			var clname = object.attr("class");
			if(clonedobject.hasClass("itemselected"))
			{
					clonedobject.removeClass("itemselected");
			}
			if(clonedobject.attr("src")!=undefined)
			{
				clonedobject.css("width","12%");
				clonedobject.css("height","12%");
			}
			if(clonedobject.hasClass("largeheader"))
			{
				
				clonedobject.removeClass("largeheader");
				clonedobject.css("font-size", 10);
				clonedobject.css("position", "absolute");
				//clonedobject.addClass("thumbnail_mediumheader");
			}
			else if(object.hasClass("mediumheader"))
			{
				clonedobject.css("font-size", 6);
				clonedobject.css("position", "absolute");
			}
			else if(object.hasClass("smallheader"))
			{
				clonedobject.css("font-size", 4);
				clonedobject.css("position", "absolute");
			}
			console.log("Slide thumb "+currentselectedslidethumb);
			$(currentselectedslidethumb).append(clonedobject);
			//$("#preview_"+input[i].id).append(clonedobject);
}
function onObjectDrag(event)
{
	var item = $("#"+event.target.id)
	var l = item.css("left").split("px")[0];
	var t = item.css("top").split("px")[0];
	if(l < 0)
	{
		item.css("left", 20)
	}
	if(t < 0)
	{
		item.css("top", 20)
	}
	isMoving = true;
	//updateSlidePreview();
	$("#contextbar").css("visibility", "hidden");
	$("#play").css("visibility", "hidden");

	
}
function onMouseUp(event)
{
	var item = $("#"+event.target.id)
	adjustObjectPositions(item)
	positionDeleteButton();
	var x = parseInt($(editedobject).css("left").split("px")[0]);
	var y = parseInt($(editedobject).css("top").split("px")[0]);
	var w = $(editedobject).width()
	var h = parseInt($(editedobject).css("height").split("px")[0]);
	$("#play").css("left",x + 300)
	$("#play").css("top", y + 220);
	$("#play").css("width", w)
	$("#play").css("height", h)
	//$("#play").css("z-index", 30)
	
}
function adjustObjectPositions(item)
{
	var l = parseInt(item.css("left").split("px")[0]);
	var t = parseInt(item.css("top").split("px")[0]);
	var h = parseInt(item.css("height").split("px")[0]);
	if(l < 0)
	{
		item.css("left", 20)
	}
	if(t < 0)
	{
		item.css("top", 20)
	}
	/*if(t > 400)
	{
		item.css("top", 400)
	}
	if(l > 600)
	{
		item.css("left", 600)
	}
	*/
	l = parseInt(item.css("left").split("px")[0]);
	t = parseInt(item.css("top").split("px")[0]);
	h = parseInt(item.css("height").split("px")[0]);
	$("#contextbar").css("visibility", "visible");
	$("#contextbar").css("left", l + 145);
	$("#contextbar").css("top", (t+h)+90);
	$("#play").css("visibility", "visible");
	/*$("#play").css("left", l);
	$("#play").css("top", t)*/
	adjustSubspanPositions()
}
function adjustSubspanPositions()
{
	//$("#spanrotate").css("top", 1)
}
function onThumbnailClick(event)
{
	//getAllChildren();
	$("#deleteBtn").css("left", -10000);
	$("#contextbar").css("visibility", "hidden");
	$("#play").css("visibility", "hidden");
	if("#"+event.currentTarget.id != currentSelected)
	{
		removePrevSelection();
	}
	if(!slideselected)
	{
		$("#"+event.currentTarget.id).addClass("thumbnailselected")
		currentSelected = "#"+event.currentTarget.id;
		slideselected = true;
		getCurrentSelectedSlide(currentSelected)
		hideInactiveSlides();
	}
	else
	{
		$("#"+event.currentTarget.id).removeClass("thumbnailselected")
		slideselected = false;
	}
	editedobject = "";
}
function getCurrentSelectedSlide(item)
{
	currentselectedslidethumb = item;
	var s = item.split("slidethumb")[1];
	addTarget = "#____slide"+s;
}
function removePrevSelection()
{
	if(currentSelected != "")
	{
		$(currentSelected).removeClass("thumbnailselected");
		slideselected = false;
		
	}
	$(editedobject).removeClass("itemselected");
}
function toastEditor(event)
{
	//hideToolBar();
	$("#deleteBtn").css("left", -30000)
	if(editedobject !="")
	{
		$(editedobject).css("opacity", 1);
	}
	var isSlide = (event.target.id).split("____slide");
	if(isSlide.length > 1)
	{
		editorToast = false;
	}
	else
	{
		editorToast = true;
	}
	if(event.target.id !="stage" && !editorvisible && editorToast)
	{
		editorvisible = true;
		var x = $("#"+event.target.id).css("left");
		var y = $("#"+event.target.id).css("top");
		var w = $("#"+event.target.id).css("width");
		var h = $("#"+event.target.id).css("height");
		editedobjecty = y;
		editedobjectx = x;
		var modifiedx = parseInt(x.split("px")[0])+150;
		var modifiedy = parseInt(y.split("px")[0])+78;
		//editedobject = "#"+event.target.id;
		//hideEditedObject();
		$(editedobject).css("visibility", "hidden");

		//$("#"+event.target.id).css("opacity", 0);
		var keyed = $(editedobject).html().split("<br>").join("\n");
		console.log("dabaaaa "+keyed);
		$("#editorBox").css("visibility","visible");
		$("#editorBox").attr("class", "largeeditor largeheader");
		$("#editorBox").css("left", modifiedx);
		$("#editorBox").css("top", modifiedy);
		$("#editorBox").css("width", $(editedobject).width() + 20);
		$("#editorBox").css("font-family", $(editedobject).css("font-family"));
		$("#editorBox").css("font-size", $(editedobject).css("font-size"));
		$("#editorBox").css("height", h*2);
		$("#editorBox").val(keyed)
		$("#editorBox").focus();

		
		
	}
	
}
function onKeyUp(event)
{
		if(event.keyCode == 13)
		{
			console.log("Enter key");
			 var keyed = $("#editorBox").val().replace(/\n/g, '<br/>');
			$(editedobject).html(keyed);
			
			/*$("#editorBox").val("");
			editorvisible = false
			resetEditedObject();
			positionDeleteButton()
			hideEditorBox();*/
			$("#play").css("visibility", "hidden")

		}
		else if(event.keyCode == 27)
		{
			editorvisible = false;
			resetEditedObject();
			positionDeleteButton();
			hideEditorBox();	
			$("#play").css("visibility", "hidden")

			
		}
}
function findAndArrangeSlides()
{

	var arr = $("#drawingboard").children();
	var childarray = new Array()
	for(var i=0; i<arr.length; i++)
	{
		if(arr[i].id !="deleteBtn")
		{
			for(var j=0; j<slidesArray.length; j++)
			{
				if(arr[i].id == "____slide"+slidesArray[j].id)
				{
					arr.splice(i,1);
				}
			}
			
		}
	}
	for(var k=0; k<arr.length; k++)
	{
		if(arr[k].id != "deleteBtn")
		{
			childarray.push({id:arr[k].id, canAdd:true});
		}
	}
	layoutOrchestrationThumbs(childarray)
}
function generateObjectTree(item)
{
	
		var arr = new Array();
		for(var x =0; x<item[0].children.length; x++)
		{
			var object = item[0].children[x];
			var l = $("#"+object.id).css("left").split("px")[0];
			var t = $("#"+object.id).css("top").split("px")[0];
			var o = calculateOrchCoords(l, t);
			var data = {object:object, coords:o};
			arr.push(data);
		}
	
	return arr;
}
function movePageLeft(event)
{
	if(currentOrchPage > 1)
	{
		$("#leftarrow").css("visibility", "visible")
		$("#rightarrow").css("visibility", "visible");

		hideOtherThumbs(--currentOrchPage);
	}
	if(currentOrchPage == 1)
	{
		$("#leftarrow").css("visibility", "hidden")
	}
}
function movePageRight(event)
{
	if(currentOrchPage <  orchpages)
	{
		//console.log("before sending out "+ ++currentOrchPage);
		$("#rightarrow").css("visibility", "visible");
		$("#leftarrow").css("visibility", "visible")
		hideOtherThumbs(++currentOrchPage);
	}
	if(currentOrchPage == orchpages)
	{
		$("#rightarrow").css("visibility", "hidden");
	}
}
function layoutPaginationBar(pages)
{
	orchpages = pages;
	if(pages > 1)
	{
		$("#leftarrow").css("visibility", "visible")
		$("#rightarrow").css("visibility", "visible")
	}
	else
	{
		$("#leftarrow").css("visibility", "hidden")
		$("#rightarrow").css("visibility", "hidden")
	}
	$("#paginationlist").html("");
	for(var i=0; i<pages; i++)
	{
		/*var str = paginationtemplate.split("!PAGECOUNT!").join("Page : " + (i+1));
		str = str.split("!PAGINATIONID!").join("pagination_"+(i+1));
		$("#paginationlist").append(str);
		$("#pagination_"+(i+1)).bind("click", onPageLinkClick)
		*/
	}
}
function onPageLinkClick(event)
{
	var item = (event.target.id).split("pagination_")[1];
	hideOtherThumbs(item);
}
function hideOtherThumbs(pageNumber)
{
	var begin = ((pageNumber - 1) * 5);
	var end = (begin) + 5;
	if(pageNumber == 1)
	{
		begin = 0;
		end = 5
	}
	if(end  > totalSlides)
	{
		end = totalSlides;
	}

	for(var i=0; i<slidemap.length; i++)
	{
		$("#orch_slide____slide"+slidemap[i].index).css("visibility", "hidden");
	}
	for(var j=begin; j<end; j++)
	{
		$("#orch_slide____slide"+slidemap[j].index).css("visibility", "visible")
	}
}
function layoutOrchestrationThumbs(input)
{

	totalSlides = input.length;
	var maxThumbCount = 5;
	/*if(totalSlides > maxThumbCount)
	{
		console.log("rese")
		thumbCounter = 0;
	}
	*/
	var numPages = Math.ceil(input.length/maxThumbCount);

	if(numPages == 0)
	{
		numPages = 1;
	}
	layoutPaginationBar(numPages);
	for(var i=0; i<input.length; i++)
	{

		var str = orchtemplate.split("!SLIDE_ID!").join("orch_slide"+input[i].id);
		str = str.split("!COUNT!").join(input[i].id.split("slide")[1]);
		str = str.split("!OROT!").join("data_rotation"+input[i].id);
		str = str.split("!THUMBCONTID!").join("preview_"+input[i].id)
		str = str.split("!XP!").join("data_x_p_"+input[i].id);
		str = str.split("!YP!").join("data_y_p_"+input[i].id);
		str = str.split("!ZP!").join("data_z_p_"+input[i].id)
		//console.log("Can add "+input[i].canAdd );
		if(input[i].canAdd == true)
		{
			
			var checkpt = $("#orch_slide"+input[i].id).attr("id")
			if(checkpt == undefined)
			{
				$("#orchestrationarea").append(str);
				if(thumbCounter >= maxThumbCount)
				{
					thumbCounter = 0;
				}
				$("#orch_slide"+input[i].id).css("left", (orchxpos*10) + (160*(thumbCounter)));
				thumbCounter++;
				$("#orch_slide"+input[i].id).css("top", "28%");
				$("#orch_slide"+input[i].id).bind("drag", onOrchThumbDrag);
				$("#orch_slide"+input[i].id).bind("click", onOrchThumbClick);
				$("#orch_slide"+input[i].id).bind("mousedown", onOrchThumbMouseDown);
				$("#orch_slide"+input[i].id).bind("mouseup", onOrchThumbMouseUp);
				$("#orch_slide"+input[i].id).draggable(
								{
								   cursor:"pointer"
								}
							 );
				var slide = $("#orch_slide"+input[i].id);
				//console.log("First run "+slide)
			}
			
			
		}
		var arr = generateObjectTree($("#"+input[i].id))
		var c = $("#preview_"+input[i].id);
		c.html("");
		for(var x=0; x<arr.length; x++)
		{
			var object = $("#"+arr[x].object.id);
			var coords = arr[x].coords;
			var clonedobject = object.clone();
			clonedobject.css("left", coords.x);
			clonedobject.css("top", coords.y);
			clonedobject.attr("id", "thumbnailof_"+clonedobject.attr("id"));
			var clname = object.attr("class");
			if(clonedobject.hasClass("itemselected"))
			{
					clonedobject.removeClass("itemselected");
			}
			if(clonedobject.attr("src")!=undefined)
			{
				clonedobject.css("width","12%");
				clonedobject.css("height","12%");
			}
			if(clonedobject.hasClass("largeheader"))
			{
				
				clonedobject.removeClass("largeheader");
				clonedobject.css("font-size", 10);
				clonedobject.css("position", "absolute");
				//clonedobject.addClass("thumbnail_mediumheader");
			}
			else if(object.hasClass("mediumheader"))
			{
				clonedobject.css("font-size", 6);
				clonedobject.css("position", "absolute");
			}
			else if(object.hasClass("smallheader"))
			{
				clonedobject.css("font-size", 4);
				clonedobject.css("position", "absolute");
			}
			$("#preview_"+input[i].id).append(clonedobject);
		
		}
		
	}
	slidesArray = input;
	if(firstRetrieve)
	{
		if(orchestrationdataarray.length > 0)
		{
			for(var i=0; i<orchestrationdataarray.length; i++)
			{
				var child = $("#orch_slide____slide"+orchestrationdataarray[i].id);
				var l = (orchestrationdataarray[i].left).split("px")[0];
				var t = (orchestrationdataarray[i].top).split("px")[0];
				child.css("left", l)
				child.css("top", t);
				child.css("-webkit-transform", "rotate("+orchestrationdataarray[i].rot+"deg) rotateX("+orchestrationdataarray[i].rotatex+"deg) rotateY("+orchestrationdataarray[i].rotatey+"deg)");
				child.attr("data-z",orchestrationdataarray[i].z );
				child.attr("data-scale",orchestrationdataarray[i].scale);
				child.attr("data-rotate",orchestrationdataarray[i].rot);
				child.attr("data-rotate-x", orchestrationdataarray[i].rotatex);
				child.attr("data-rotate-y", orchestrationdataarray[i].rotatey)

			}
		}
		firstRetrieve = false;
	}
	if(firstLayout)
	{
		currentOrchPage++;
		hideOtherThumbs(1)
		firstLayout = false;
	}
	doExport();
}
function onOrchThumbClick(event)
{
	if(selectedorchslide != "")
	{
		selectedorchslide.removeClass("orchestrationthumbnailselected");
	}
	selectedorchslide = $("#"+event.currentTarget.id);
	selectedorchslide.addClass("orchestrationthumbnailselected");
	$("#depthrange").val((selectedorchslide.attr("data-z"))*-1);
	$("#scalerange").val(selectedorchslide.attr("data-scale"));
	$("#slideknob").val(selectedorchslide.attr("data-rotate"));
	$("#rotationxknob").val(selectedorchslide.attr("data-rotate-x"));
	$("#rotationyknob").val(selectedorchslide.attr("data-rotate-y"));


}
function onOrchThumbMouseDown(event)
{
	var z = parseInt($("#"+event.currentTarget.id).css("z-index").split("px")[0]);
	if(!isNaN(z))
	{
		z = z+10000;
	}
	else
	{
		z = 10000;
	}

	$("#"+event.currentTarget.id).css("z-index", z);
	var spanid = (event.currentTarget.id).split("orch_slide")[1];
	$("#data_x_p_"+spanid).css("opacity", 1)
	$("#data_y_p_"+spanid).css("opacity", 1)
}
function onOrchThumbMouseUp(event)
{
	var z = parseInt($("#"+event.currentTarget.id).css("z-index").split("px")[0]);
	if(!isNaN(z))
	{
		z = z-10000;
	}
	else
	{
		z = 5000;
	}
	$("#"+event.currentTarget.id).css("z-index", z);
	var spanid = (event.currentTarget.id).split("orch_slide")[1];
	$("#data_x_p_"+spanid).css("opacity", 0)
	$("#data_y_p_"+spanid).css("opacity", 0)
}
function onOrchThumbDrag(event)
{
	doExport();
}
function doExport()
{
	prepositions = new Array();

	for (var i = 0; i < slidesArray.length; i++) 
	{
		var slide = $("#orch_slide"+slidesArray[i].id);
		var sliderot = slide.attr("data-rotate");
		var depth = slide.attr("data-z");
		var scale = slide.attr("data-scale");
		var datarotatex = slide.attr("data-rotate-x");
		var datarotatey = slide.attr("data-rotate-y");

		if(sliderot == undefined)
		{
			//console.log("The rotation : "+sliderot);
			sliderot = 0;
		}
		if(scale == undefined)
		{
			scale = 1;
		}
		if(depth == undefined)
		{
			depth = 0;
		}
		var x = slide.css("left").split("px")[0];
		var y = slide.css("top").split("px")[0];
		var o =calculateCoords(x - 300, y);
		$("#data_x_p_"+slidesArray[i].id).text("x = "+o.x);
		$("#data_y_p_"+slidesArray[i].id).text("y = "+o.y);
		$("#data_z_p_"+slidesArray[i].id).text("z "+depth+" | scale "+scale);
		$("#data_rotation"+slidesArray[i].id).html("rotation "+sliderot+"<sup>o</sup>");
		$("#"+slidesArray[i].id).attr("data-x", o.x);
		$("#"+slidesArray[i].id).attr("data-y", o.y);
		$("#"+slidesArray[i].id).attr("data-rotate", sliderot);
		$("#"+slidesArray[i].id).attr("data-z", depth);
		$("#"+slidesArray[i].id).attr("data-scale", scale);
		$("#"+slidesArray[i].id).attr("data-rotate-x", datarotatex);
		$("#"+slidesArray[i].id).attr("data-rotate-y", datarotatey);

		var o = {slide : slidesArray[i].id, x:x, y:y};
		prepositions.push(o);
	};

}
function calculateCoords(wx, wy)
{
	var vx = Math.round(((vxmax - vxmin)/(wxmax - wxmin) )*(wx - wxmin) + vxmin);
	var vy = Math.round(((vymax - vymin)/(wymax - wymin) )*(wy - wymin) + vymin);
	var object = {x:vx, y:vy};
	return object;

}
function calculateOrchCoords(wx, wy)
{
	var vx = Math.round(((o_vxmax - o_vxmin)/(o_wxmax - o_wxmin) )*(wx - o_wxmin) + o_vxmin);
	var vy = Math.round(((o_vymax - o_vymin)/(o_wymax - o_wymin) )*(wy - o_wymin) + o_vymin);
	var object = {x:vx, y:vy};
	return object;

}

function prepareDownload()
{
	markedfordownload = true;
	createMarkupForExport();
}
function preparePreview()
{
	markedfordownload = false;
	createMarkupForExport();
}
function createMarkupForExport()
{
	
	doExport();

	premodoutput = $("#drawingboard").html();
	replaceElementIDValues(premodoutput)
	reAdjustChildCoords();
}
function replaceElementIDValues(input)
{
	var str = input.toString();
	str = str.split("____slide").join("____slide____")
	str = str.split("____object").join("____object____");
	$("#outputconsole").html(str);
	createRevealJSMarkup();
}
function createRevealJSMarkup()
{
	var s = $("#outputconsole").html();
	var news = s.split("div").join("section");
	console.log("+++++++++++++++++++++++++++++++++++++++++");
	console.log(news)
}
function reAdjustChildCoords()
{
	for(var i=0; i<objectmap.length; i++)
	{
		
			if(objectmap[i].index != "" || !isNaN(objectmap[i].index))
			{
				var stubobject = $("#____object____"+objectmap[i].index);
				var l = parseInt(stubobject.css("left").split("px")[0]);
				var t = parseInt(stubobject.css("top").split("px")[0]);
				//adjust skew y
				var skewy = stubobject.attr("data-skewy")
				var skewx = stubobject.attr("data-skewx")
				var fontsize = stubobject.attr("data-font-size")
				var tdrotate = stubobject.attr("transform-data-rotate")

				l = l- (screen.width/2)
				t = t - (screen.height/2) + 100
				//console.log("l "+l+ "  "+screen.width/2)
				if(fontsize == "mediumheader")
				{
					t += (stubobject).height() 
					//l += 50;
				}
				if(tdrotate !=0 && tdrotate != 180 && tdrotate != undefined)
				{
					var factor = 0;
					console.log("Recalc for rot")
					if(tdrotate == 90|| tdrotate == -90)
					{
						factor = stubobject.height()/2;
					}
					l = Math.round(l - ((tdrotate * stubobject.width()/2)/90))
					t = Math.round(t - ((tdrotate * stubobject.width()/2)/90)) + 100 ;
				}
				if(skewy != undefined)
				{
					t = t - 160;
				} 
				if(skewx != undefined)
				{
					t = t + 40; 
				}
				
				stubobject.css("position", "absolute");
				stubobject.css("left", l)
				stubobject.css("top", t)
			}
	}
	for(var k =1; k<slidecounter; k++)
	{
		var stubobject = $("#____slide____"+k);
		stubobject.attr("style", "");
	}
	var injectstr = $("#outputconsole").html();
	injectstr = injectstr.split("x</a>")[1];
	var templstr = templatearray.join("");
	var outputstr = templstr.split("!____PLACEHOLDER____!").join(injectstr);
	previewoutputstring = outputstr;

	generatePreview(outputstr);
	if(markedfordownload)
	{
		createArchiveAndDownload();
	}
}

function generatePreview(str)
{
	$.ajax({
			type: 'POST',
			 url: "server/generatePreview.php",
			 data: {generateddata:str},
			 dataType: "html",
			 success: function(msg)
			 {
			 	if(!markedfordownload)
			 	{
			 		window.open("server/viewer.php", "_blank");
			 	}
			 }
	});
}

function showOrchestrationView()
{
	$("#contextbar").css("visibility","hidden");
	$("#play").css("visibility", "hidden");
	//$("#mask").css("visibility", "hidden")
	togglePaginator(true);
	hidePresentationView();
	findAndArrangeSlides();
}