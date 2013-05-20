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
var isdisabled = false;
var rotateX = 0;
var rotateY = 0;
var rotateZ = 0;
var currentsliderotation = 0;
var display = 0;
//Set up UI
function setupUI()
{
    console.log("Setup UI "+screen.width+"  "+screen.height);
	$("#contextbar").css("visibility","hidden");
	$("#subnav2").css("z-index", -10000);
	$("#subnav").css("z-index", 10000);
	$("#subnav").css("visibility", "visible");
	$("#subnav2").css("visibility", "hidden");
	$("#editorBox").bind("keyup", onKeyUp);
	$("#urlinput").bind("blur", onURLEntered);
	$("#urlinput").bind("keyup", onURLEntered);
	$("#editorBox").bind("focusout", onFocusOut);
	bindTextInputEvents();
	
}
//Bind events on text inputs. At the moment, the text editor and the
//picture wizard.
function bindTextInputEvents()
{
	$("#contextbar").bind("mouseup", onContextMouseUp)
}
function onContextMouseUp(event)
{
	console.log("context "+event.target.id);
}
//Hide the toasted editor
function onFocusOut(event)
{
	var val = $("#editorBox").val();
	if(val != "")
	{
		var keyed = $("#editorBox").val().replace(/\n/g, '<br/>');
		$(editedobject).html(keyed);
		//$(editedobject).text(keyed);
	}
	$(editedobject).css("visibility", "visible");
	hideEditorBox();
	resetEditedObject();
}
//setup all the knobs that control the rotation params
//also bind the events to the depth and scale sliders.
function setupKnobs()
{
	/*$("#knobit1").knob
	(
		{
            "change":function(e)
            {
                    skewx = e;
                    $(editedobject).css("-webkit-transform", "rotate("+rot+"deg) skew("+skewx+"deg, "+skewy+"deg)");
                    $(editedobject).attr("data-skewx", skewx); 
                    $(editedobject).attr("data-skewy", skewy);                              
             }
         }
	);
*/
	$("#rotationxknob").knob
	(
		{
            "change":function(e)
            {
               rotateX = e;    
               selectedorchslide.css("-webkit-transform", " rotate("+currentsliderotation+"deg) rotateX("+rotateX+"deg) rotateY("+e+"deg)");
               selectedorchslide.attr("data-rotate-x", e);

                
            }
         }
	);
	$("#rotationyknob").knob
	(
		{
            "change":function(e)
            {
               rotateY= e;    
               selectedorchslide.css("-webkit-transform", "rotate("+currentsliderotation+"deg) rotateX("+rotateX+"deg) rotateY("+e+"deg)");
               selectedorchslide.attr("data-rotate-y", e);                           
             }
         }
	);
	/*
	$("#knobit2").knob
	(
		{
            "change":function(e)
            {
                    skewy = e
                    $(editedobject).css("-webkit-transform", "rotate("+rot+"deg) skew("+skewx+"deg, "+skewy+"deg)");
                    $(editedobject).attr("data-skewx", skewx); 
                    $(editedobject).attr("data-skewy", skewy);                                
            }
         }
	);
*/
	$("#slideknob").knob
	(
		{
            "change":function(e)
            {
                    currentsliderotation = e;
                    selectedorchslide.attr("data-rotate", e);
                    doExport();
                    selectedorchslide.css("-webkit-transform", "rotate("+e+"deg) rotateX("+rotateX+"deg) rotateY("+rotateY+"deg)");

            }
         }
	);
	$("#depthrange").bind("change", onDepthChange);
	$("#scalerange").bind("change", onScaleChange);

}
//Depth change event handler
function onDepthChange(event)
{
	var depth = parseInt(event.target.value)*-1;
	selectedorchslide.attr("data-z", depth);
	doExport();
}
//Scale change event handler
function onScaleChange(event)
{
	var scale = parseInt(event.target.value);
	selectedorchslide.attr("data-scale", scale);
	doExport();
}
//Setup colorpicker.
function setupColorPicker(color)
{

	$('#colorSelector').ColorPicker(
	{
		color: '#0000ff',
		onShow: function (colpkr)
		 {
		 	$(editedobject).css("z-index", 0)
		 	$("#deleteBtn").css("z-index", 0)
		 	//this.css("z-index", 200)

		 	if(!isdisabled)
		 	{
				$(colpkr).fadeIn(500);
			}
			return false;
		},
		onHide: function (colpkr) 
		{
			//$(editedobject).css("z-index", 20)
			$("#deleteBtn").css("z-index", 40)
			//this.css("z-index", 0)
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) 
		{
			if(!isdisabled)
			{
				colorboxopen = true;
				currentAddObject = "";
				$("#colorSelector").css('backgroundColor', '#' + hex);
				$(editedobject).attr("data-selected-color", "#"+hex);
				$(editedobject).css("color", "#"+hex);
			}
		}
	});
}
function setFontStyle(value)
{
	var dropdownlabel = "";
	fontStyle = value;

	if(fontStyle == "jumbo")
	{
		dropdownlabel = "Very Large"
	}
	else if(fontStyle == "largeheader")
	{
		dropdownlabel = "Large"
	}
	else if(fontStyle == "mediumheader")
	{
		dropdownlabel = "Medium"
	}
	else if(fontStyle == "smallheader")
	{
		dropdownlabel = "Small"
	}

	if(editedobject != "")
        {
		adjustObjectPositions(
			$(editedobject)
				.attr("data-font-size", value)
				.attr("class","ui-draggable slideobject itemselected "+value)

		);
		$("#play").css("visibility", "hidden");
	}
	$("#fontstyledropdown").html(dropdownlabel+'<b class="caret">');
}
function addUnorderedList()
{
	console.log("adding ul : "+editor.getValue())
}
function setFont(font)
{
	selectedFont = font;
	currentSelectedFont = font;
	$(editedobject).attr("data-font-face", currentSelectedFont)
	$("#play").css("visibility", "hidden");
	$("#fontdropdown").html(currentSelectedFont+'<b class="caret">');
	if(editedobject != "")
	{
		$(editedobject).css("font-family", selectedFont);
	}
}
function toggleBold()
{
	isBold = !isBold;
	if(isBold)
	{
		$("#boldButton").addClass("menuButtonSelected");
		$(editedobject).css("font-weight", "normal")

	}
	else
	{
		$("#boldButton").removeClass("menuButtonSelected");
		$(editedobject).css("font-weight", "bold")

	}
}
function toggleItalic()
{
	isItalic = !isItalic;
	if(isItalic)
	{
		$("#italicsButton").addClass("menuButtonSelected");
		$(editedobject).css("font-style", "italic")
	}
	else
	{
		$("#italicsButton").removeClass("menuButtonSelected");
		$(editedobject).css("font-style", "normal")
	}
}
function toggleUnderline()
{
	isUnderline = !isUnderline;
	if(isUnderline)
	{
		$("#italicsButton").addClass("menuButtonSelected");
		$(editedobject).css("text-decoration", "underline")
	}
	else
	{
		$("#italicsButton").removeClass("menuButtonSelected");
		$(editedobject).css("text-decoration", "none")
	}
}
function deleteObject()
{
	if(editedobject!="")
	{
		var id = $(editedobject).attr("id");
		var index = id.split("____object")[1];
		removeItemFromObjectMap(index);
		$(editedobject).remove();
		$("#deleteBtn").css("left", -30000)
		$("#contextbar").css("visibility", "hidden");
		$("#play").css("visibility", "hidden");
	}
}
function removeItemFromObjectMap(index)
{
	for(var i=0; i<objectmap.length; i++)
	{
		if(objectmap[i].index == index)
		{
			objectmap.splice(i, 1);
		}
	}

}
function deleteSlide()
{
	recount = 1;
	if($(currentSelected).attr("id") != undefined)
	{
		var index = $(currentSelected).attr("id").split("slidethumb")[1];
		$("#orch_slide____slide"+index).remove();
		removeChildObjects($(addTarget))
		$(currentSelected).remove();
		$(addTarget).remove();
		
		doReparenting(index);
	}
	else
	{
		//do nothing.
	}
}
function removeChildObjects(parent)
{
	var len = parent[0].childNodes.length;
	for(var i =0; i<objectmap.length; i++)
	{
		for(var j=0; j<len; j++)
		{
			var toremove = (parent[0].childNodes[j].id);
			var rm = toremove.split("____object")[1];
			if(objectmap[i].index == rm)
			{
				objectmap.splice(i, 1);
			}
		}
	}
}
function doReparenting(index)
{
	var len 
	for(var i =0; i<slidemap.length; i++)
	{
		if(slidemap[i].index == index)
		{
			slidemap.splice(i,1);
		}
	}
	console.log(slidemap)
	slidecounter--;
	var len = $("#slidethumbnailholder")[0].childNodes.length;
	for(var j=0; j<slidemap.length; j++)
	{
		var item = $("#slide_number_sliderthumb"+slidemap[j].index);
		item.text(j+1);
	}
}
function hideEditedObject()
{
	

}
function hideEditorBox()
{
	
		$("#editorBox").css("left", -3000);
		$("#editorBox").css("top", -3000);
		$("#editorBox").val("");
		$(editedobject).css("opacity",1);
}
function resetEditedObject()
{
	$(editedobject).css("left", editedobjectx);
	$(editedobject).css("top", editedobjecty);
	currentAddObject = "";
}
function hidePresentationView()
{
	isOrchestration = true;

	$("#orchestrationarea").css("left", 40);
	$("#drawingboard").css("visibility", "hidden")
	$("#leftarrow").css("visibility", "visible");
	$("#rightarrow").css("visibility", "visible");
	$("#slidethumbnailholder").css("visibility", "hidden")
	$("#subnav").css("z-index", -10000)
	$("#subnav2").css("z-index", 30000)
	$("#subnav").css("visibility", "hidden");
	$("#subnav2").css("visibility", "visible");
	$("#deleteBtn").css("left", -10000)

}
function showPresentationView()
{
	isOrchestration = false;
	togglePaginator(false);
	$("#drawingboard").css("visibility", "visible")
	$("#slidethumbnailholder").css("visibility", "visible")
	$("#leftarrow").css("visibility", "hidden");
	$("#rightarrow").css("visibility", "hidden");
	$("#orchestrationarea").css("left", -10000);
	$("#subnav").css("z-index", 30000);
	$("#subnav2").css("z-index", -10000);
	$("#subnav").css("visibility", "visible");
	$("#subnav2").css("visibility", "hidden");
}
function hideInactiveSlides()
{
	for(var i=0; i<slidemap.length; i++)
	{
		var s = "#____slide"+slidemap[i].index;
		if(s != addTarget)
		{

			$(s).css("opacity", 0);
			$(s).css("left", -10000);
		}
		else
		{
			$(s).css("opacity", 1);
			$(s).css("left", 0);

		}
	}
}
function showOpenDialog()
{
	$("#openModal").modal();
	showSavedPresentations();
}
function showEditorDialog()
{
	$("#editorModal").modal();
}
function setObjectType(type)
{

	addObjectFlag = true;
	currentAddObject = type;
	if(type == "pic")
	{
		picwindowopen = true;
		$("#myModal").modal();
	}
}
function positionDeleteButton()
{
	if(itemSelected)
	{
		$("#deleteBtn").css("opacity", 1)
		var x = parseInt($(editedobject).css("left").split("px")[0]) - 15;
		var y = parseInt($(editedobject).css("top").split("px")[0]) - 15;
		$("#deleteBtn").css("left", x);
		$("#deleteBtn").css("top", y);

	}
	else
	{
		editedobject = "";
	}
}
function toggleSelect(event)
{
	oldpresoselected = !oldpresoselected;
	currentSelectedProject = "#"+event.currentTarget;
}
function onSavedPresoLinkClicked(event)
{
	var projectdetails = getItem(event.target.id);
	currentSaveName = event.target.id;
	$("#openModal").modal("hide");
	restoreProject(projectdetails);
}
function showSavedPresentations()
{
	$("#savedpresolist").html("");
	if(savedPresentations.length > 0)
	{
		for(var i=0; i<savedPresentations.length; i++)
		{
			var str = presotemplate.split("!PRESOTITLE!").join("&nbsp;&nbsp;"+savedPresentations[i].split("_").join(" "));
			str = str.split("!LINKID!").join(savedPresentations[i]);
			str = str.split("!PRESOID!").join(savedPresentations[i]);
			$("#savedpresolist").append(str);
			$("#"+savedPresentations[i]).bind("dblclick", onSavedPresoLinkClicked);
		}
	}
}
function toggleToolbarControls(bool)
{
	if(!bool)
	{
		/*$("#knobit1").attr("readonly", "readonly");
		$("#knobit2").attr("readonly", "readonly");*/
		$("#colorSelector").fadeTo('slow',.3);
		$("#fontstyledropdown").fadeTo("slow",.5);
		$("#fontdropdown").fadeTo("slow",.5);
		//$("#mask").css("visibility", "visible")
	
		isdisabled = true;
	}
	else
	{
		/*$("#knobit1").removeAttr("readonly");
		$("#knobit2").removeAttr("readonly");*/
		$("#colorSelector").fadeTo('slow',1)
		$("#fontstyledropdown").fadeTo("slow",1);
		$("#fontdropdown").fadeTo("slow", 1)
		//$("#mask").css("visibility", "hidden")


		isdisabled = false;		
	}
}
function addPicture()
{
	var str = pictemplate.split("!IMG_ID!").join("____object"+objectcounter);
	str = str.split("!IMG_SRC!").join($("#previewimg").attr("src"));
	$(addTarget).append(str);
	$("#____object"+objectcounter).css("position","absolute");
	$("#____object"+objectcounter).bind("mousedown", doObjectSelection);
	$("#____object"+objectcounter).bind("mouseup", onMouseUp);
	$("#____object"+objectcounter).attr("data-pic", "true");
	$("#____object"+objectcounter).bind("drag", onObjectDrag)
	$("#____object"+objectcounter).draggable(
						{
						   cursor:"pointer"
						}
					 );
	objectmap.push({index:objectcounter});
	editedobject = $("#____object"+objectcounter)
	itemSelected = true;
	picwindowopen = false;
	objectcounter++;
}
function addThumbnailsFromStore(arr)
{
	$("#slidethumbnailholder").html("");
	for(var i=0; i<arr.length; i++)
	{
		var str = slidethumbtemplate.split("!SLIDE_ID!").join("slidethumb"+arr[i]);
		str = str.split("!THUMBDISPLAYNUMBER!").join("slide_number_sliderthumb"+arr[i]);
		str = str.split("!COUNT!").join(i+1);
		str = str.split("!THUMBDELETE!").join("delete_btn_slidethumb"+arr[i]);
		$("#slidethumbnailholder").append(str);
		$("#slidethumb"+arr[i]).bind("click", onThumbnailClick)
		$("#slidethumb"+arr[i]).bind("mouseover", onThumbnailMouseOver)
		$("#slidethumb"+arr[i]).bind("mouseout", onThumbnailMouseOut)
		$("#____slide"+arr[i]).bind("click", triggerObjectAdd)
		$("#____slide"+arr[i]).bind("dblclick", toastEditor)
		$("#____slide"+arr[i]).bind("mouseup", onSlideMouseUp)
	}
}
function addSlidesFromStore(item)
{
	$("#drawingboard").html(item);
	for(var i=0; i<objectmap.length; i++)
	{
		$("#____object"+objectmap[i].index).bind("mousedown", doObjectSelection)
		$("#____object"+objectmap[i].index).bind("mouseup", onMouseUp)
		$("#____object"+objectmap[i].index).bind("drag",onObjectDrag);
		$("#____object"+objectmap[i].index).draggable(
				{
				   cursor:"pointer"
				}
			 );
		objectcounter = i+1;
	}
}
function addSlide()
{
	$("#contextbar").css("visibility", "hidden")
	$("#play").css("visibility", "hidden")
	var str = slidethumbtemplate.split("!SLIDE_ID!").join("slidethumb"+slidecounter);
	str = str.split("!SLIDENUMBER!").join("slide_number_sliderthumb"+slidecounter);
	str = str.split("!THUMBDISPLAYNUMBER!").join("slide_number_sliderthumb"+slidecounter);
	str = str.split("!COUNT!").join(slidecounter);
	str = str.split("!THUMBDELETE!").join("delete_btn_slidethumb"+slidecounter);
	$("#slidethumbnailholder").append(str);
	$("#slidethumb"+slidecounter).bind("click", onThumbnailClick)
	$("#slidethumb"+slidecounter).bind("mouseover", onThumbnailMouseOver)
	$("#slidethumb"+slidecounter).bind("mouseout", onThumbnailMouseOut)

	removePrevSelection();
	$("#slidethumb"+slidecounter).addClass("thumbnailselected");

	currentSelected = "#slidethumb"+slidecounter;
	getCurrentSelectedSlide(currentSelected);
	hideInactiveSlides();
	var str1 = slidetemplate.split("!SLIDE_ID!").join("____slide"+slidecounter);
	$("#drawingboard").append(str1);
	$("#____slide"+slidecounter).bind("click", triggerObjectAdd)
	$("#____slide"+slidecounter).bind("dblclick", toastEditor)
	$("#____slide"+slidecounter).bind("mouseup", onSlideMouseUp)
	slidemap.push({index:slidecounter});
	editedobject = "";
	slidecounter++;
	$("#deleteBtn").css("left", -20000);

}
function cloneElement()
{
	console.log("Cloning now...")
	objectcounter = Math.round(Math.random()*100000);
	clonedelement = $(objecttocopy).clone();
	$(objecttocopy).removeClass("itemselected");
	//objectcounter++;
	clonedelement.attr("id", "____object"+objectcounter);
	clonedelement.css("position", "absolute");
	clonedelement.bind("mousedown", doObjectSelection);
	clonedelement.bind("mouseup", onMouseUp);
	clonedelement.bind("drag", onObjectDrag)
	clonedelement.draggable
		(
		)
	$(addTarget).append(clonedelement);
	objectmap.push({index:objectcounter});
	objectcounter++;
	removePrevSelection();
	isMoving = false;
	//updateSlidePreview();

}
function addOrchestrationThumbnailsFromStore(arr)
{
	orchestrationdataarray = new Array();
	for(var i=0; i<arr.length; i++)
	{
		var element = arr[i];
		var props = element.split("__");
		var id = props[0].split(":")[1];
		var left = props[1].split(":")[1];
		var top = props[2].split(":")[1];
		var rot = props[3].split(":")[1];
		var z = props[4].split(":")[1];
		var scale = props[5].split(":")[1];
		var rotatex = props[6].split(":")[1];
		var rotatey = props[7].split(":")[1]
		console.log("Green: "+rotatex+" and "+rotatey)
		orchestrationdataarray.push({id:id, left:left, top:top, z:z, rot:rot, scale:scale, rotatex:rotatex, rotatey:rotatey});

	}

}
function toggleDisplayView()
{
	if(display == 1)
	{
		showPresentationView();
		$("#rightBtn").text("Orchestration View")
		display = 0;
	}
	else
	{
		showOrchestrationView();
		$("#rightBtn").text("Presentation View")
		display = 1;
	}
}
function doLeftAlign()
{
	$(editedobject).css("text-align", "left");
}
function doCenterAlign()
{
	$(editedobject).css("text-align", "center");
}
function doRightAlign()
{
	$(editedobject).css("text-align", "right");
}