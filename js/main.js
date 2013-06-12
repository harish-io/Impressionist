/**
* Client id - 813346482484.apps.googleusercontent.com
*/ 
Impressionist = function()
{

	this.slidecounter = 0;

	this.menuopen = false;
	this.currentview = "mainarea";
	this.colorpickeropen = false;
	this.selectedElement;
	this.clonedElement;
	this.selectedSlide;
	this.lasttextaddedcoords = {};
	this.orchestrationcoords = [];
	this.selectedOrchElement;
	this.lastslideleftpos = 0;
	this.saveKey = "impressionist_decks";
	this.lastSaved = "impressionist_lastsaved"
	this.currentPresentation;
	this.mypresentations = [];
	this.mode = "create";
	this.theme = "montserrat";
	this.loggedinstate = false;

	this.dropdownopen = false;

	this.selectedforedit = false;


	this.isBold = false;
	this.isItalic = false;
	this.isUnderlined = false;

	 this.vxmax = 6000;
	//Viewport x min
	this.vxmin = -6000;
	//Viewport y max
	this.vymax = 6000;
	//Viewport y min
	this.vymin = -6000;
	//Window x max
	this.wxmax = 960;
	//Window x min
	this.wxmin = 0;
	//Window y max
	this.wymax = 630;
	//Window y min
	this.wymin = 0;

 	this.slidewxmax = 960;
 	this.slidewxmin = 0;
 	this.slidewymax = 630;
 	this.slidewymin = 0;
}
Impressionist.prototype =
{
	initialize  : function()
	{
		me = this;
		me.continueInit();

		
		//me.openNewPresentationWindow();
	},
	continueInit : function()
	{

			me.positionOrchestrationPanel()
			me.setupColorpickerPopup();
			me.setupMenuItemEvents();
			me.enableSort();
			me.setupPopover();
			me.setupDials();	
			me.setupKeyboardShortcuts();	
			me.hideTransformControl();
			presentations = me.getSavedPresentations();
			me.renderPresentations( presentations );
			me.openLastSavedPresentation();
			me.switchView("right");
		
	},
	openLastSavedPresentation : function()
	{
		presentation = JSON.parse(me.getItem(me.lastSaved));
		console.log("lastsaved", presentation);
		if(!presentation)
		{
			savedpresos = JSON.parse(me.getItem(me.saveKey))
			console.log("savedpresos", savedpresos)
			if(savedpresos && savedpresos.length > 0)
			{
				$("#savedpresentationsmodal").modal("show");
			}
			else
			{
				me.openNewPresentationWindow();
			}
			
		}
		else
		{
			me.currentPresentation = presentation;
			console.log("Retrieved id: ", me.currentPresentation);
			me.theme = presentation.theme;
			me.openPresentationForEdit( me.currentPresentation.id );
			me.applyStyle();

		}
	},
	openNewPresentationWindow : function()
	{
		$("#newpresentationmodal").modal();
	},
	renderPresentations : function ( presentations )
	{	
		me.mypresentations = presentations;
		$("#savedpresentations").html("<h3 style='display:inline-block; color:#2980B9; font-size:120%'> You don't have any saved presentations. </h3>");
		if(presentations.length > 0)
		{
			$("#savedpresentations").html("");
		}
		for(var i=0; i<presentations.length; i++)
		{
			presentation = presentations[i]
			templ = saved_presentations;
			templ = templ.split("__presotitle__").join(presentation.title)
			templ = templ.split("__presodescription__").join(presentation.description)
			templ = templ.split("__presoid__").join(presentation.id)
			$("#savedpresentations").append(templ);
		}
		$(".savedpresos").on("mouseover", function( e )
		{
			$(this).find(".presothumb").removeClass("idle");

		}).on("mouseout", function( e )
		{
			$(this).find(".presothumb").addClass("idle");
		})
		$(".deletepresobtn").on("click", function( e )
		{
			msg = confirm("Are you sure? You will lose your deck forever.")
			if(msg == true)
			{
				me.deleteSavedPresentation( $(this).attr("data-id") );
			}
			else
			{
				console.log("do nothing");
			}
			
		})
		//$("#savedpresentationsmodal").modal("show");
	},
	hideTransformControl : function()
	{
		$("#play").css("display", "none");
	},
	setupKeyboardShortcuts : function()
	{
			
			key('⌘+c, ctrl+c', function(event, handler)
			{
				//console.log("hey there...")
  				console.log(handler.shortcut, handler.scope);
  				me.cloneElement();
			});
			key('⌘+v, ctrl+v', function(event, handler)
			{
				//console.log("hey there...")
  				console.log(handler.shortcut, handler.scope);
  				me.appendClonedElement();
			});
			key.setScope("issues");
	},
	cloneElement : function()
	{
		if(me.selectedElement)
		{
			clone = me.selectedElement.clone();
			clone.attr("id", "slideelement_"+me.generateUID());
			clone.css("left", me.selectedElement.position().left + 20+"px")
			clone.css("top", me.selectedElement.position().top + 20+"px")
			me.clonedElement = clone;
		}
		else
		{
			console.log("Nothing is selected");
		}
	},
	appendClonedElement : function()
	{
		console.log(me.clonedElement, "clonedelement")
		me.selectedSlide.append(me.clonedElement);
		me.enableDrag();
	},
	setupMenuItemEvents : function()
	{
		$("#makebold").on("click", function( e )
		{
			e.stopPropagation()
			if(!me.isBold && me.selectedElement)
			{
				me.selectedElement.css("fontWeight", "bold")
				me.selectedElement.attr("data-isbold", true);
				$(this).addClass("active");
				me.isBold = true;
			}
			else if(me.isBold && me.selectedElement)
			{
				me.selectedElement.css("fontWeight", "normal")
				me.selectedElement.attr("data-isbold", false);
				me.isBold = false;
				$(this).removeClass("active");
			}
		});
		$("#makeitalic").on("click", function( e )
		{
			e.stopPropagation()
			$(this).removeClass("active");
			if(!me.isItalic && me.selectedElement)
			{
				me.selectedElement.css("fontStyle", "italic")
				me.selectedElement.attr("data-isitalic", true);
				$(this).addClass("active");
				me.isItalic = true;
			}
			else if(me.isItalic && me.selectedElement)
			{
				me.selectedElement.css("fontStyle", "normal")
				me.selectedElement.attr("data-isitalic", false);
				me.isItalic = false;
				$(this).removeClass("active");
			}
		});
		$("#makeunderline").on("click", function( e )
		{
			e.stopPropagation()
			$(this).removeClass("active");
			if(!me.isUnderlined && me.selectedElement)
			{
				me.selectedElement.css("text-decoration", "underline")
				me.selectedElement.attr("data-isunderline", true);
				$(this).addClass("active");
				me.isUnderlined = true;
			}
			else if(me.isUnderlined && me.selectedElement)
			{
				me.selectedElement.css("text-decoration", "none")
				me.selectedElement.attr("data-isunderline", false);
				me.isUnderlined = false;
				$(this).removeClass("active");
			}
		});
	},
	enableSort : function()
	{
		$(".slidethumbholder").sortable( { update : function( event, ui)
			{
				console.log("sort updated", event, ui);
				me.assignSlideNumbers();
				me.reArrangeImpressSlides();
			}} );
		//$(".slidethumbholder").disableSelection();
	},
	displaySelectedSlide : function( id )
	{
		
	},
	reArrangeImpressSlides : function()
	{
		children = $(".slidethumbholder").children();
		var clonedElements = [];
		for(var i=0; i<children.length; i++)
		{
			child = children[i];
			console.log("Rearrange child", child.id);
			id = (child.id).split("_")[1];
			el = $("#impress_slide_"+id);
			clonedElements.push( el );
		}
		$(".impress-slide-container").html("");
		for(var j=0; j< clonedElements.length; j++)
		{
			console.log("el", clonedElements[j]);
			$(".impress-slide-container").append(clonedElements[j]);
		}
		me.enableDrag();
	},
	setupDials : function()
	{
		$("#rotationknob").knob({change : function( v )
		{
			//me.rotateElement( v );
			me.rotateElement( v )
		}});
		$("#skewxknob").knob({change : function( v )
		{
			me.rotateElementX( v );
		}});
		$("#skewyknob").knob({change : function( v )
		{
			me.rotateElementY( v );
		}});
		$("#scalerange").on("change", function( e )
		{
			console.log("moving scale", $(this).val());
			me.selectedOrchElement.attr("data-scale", $(this).val());
			id = me.selectedOrchElement.attr("id").split("_")[1];
			$("#slidethumb_"+id).attr("data-scale", $(this).val());
		});
		$("#depthrange").on("change", function( e )
		{
			me.selectedOrchElement.attr("data-z", $(this).val());
			id = me.selectedOrchElement.attr("id").split("_")[1];
			$("#slidethumb_"+id).attr("data-z", $(this).val());
		});
		$(".transformlabel").css("vertical-align", "top")

	},
	rotateElement : function( value )
	{
		//me.selectedOrchElement.css("transform-origin", "0 0");
		
		rotx = me.selectedOrchElement.attr("data-rotate-x");
		roty = me.selectedOrchElement.attr("data-rotate-y")
		s = ""
		if(rotx != undefined)
		{
			s += "rotateX("+rotx+"deg)";
		}
		if(roty != undefined)
		{
			s += "rotateY("+roty+"deg)";
		}
		str = s + " rotate("+value+"deg)"
		me.selectedOrchElement.css("transform", str);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate", value)

		id = me.selectedOrchElement.attr("id").split("_")[1];
		console.log("Updating slidethumb", $("#slidethumb_"+id));

		$("#slidethumb_"+id).attr("data-rotate-x", rotx);
		$("#slidethumb_"+id).attr("data-rotate-y", roty);
		$("#slidethumb_"+id).attr("data-rotate", value);

		$("#slidethumb_"+id).attr("data-transform-string", str)
	},
	rotateElementX : function( value )
	{
		rot = me.selectedOrchElement.attr("data-rotate");
		roty = me.selectedOrchElement.attr("data-rotate-y")
		s = ""
		if(rot != undefined)
		{
			console.log("rotated already", rot)
			s += "rotate("+rot+"deg)";
		}
		if(roty != undefined)
		{
			s += "rotateY("+roty+"deg)";
		}
		str = s + " rotateX("+value+"deg)"
		console.log("Transform string before writing", str);
		me.selectedOrchElement.css("transform", str);
		me.selectedOrchElement.attr("data-rotate", value);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate-x", value)

		id = me.selectedOrchElement.attr("id").split("_")[1];

		console.log("Updating slidethumb", $("#slidethumb_"+id));
		$("#slidethumb_"+id).attr("data-rotate-x", value);
		$("#slidethumb_"+id).attr("data-rotate-y", roty);
		$("#slidethumb_"+id).attr("data-rotate", rot);
		$("#slidethumb_"+id).attr("data-transform-string", str)
	},
	rotateElementY : function( value )
	{
		rot = me.selectedOrchElement.attr("data-rotate");
		rotx = me.selectedOrchElement.attr("data-rotate-x")
		s = ""
		if(rot != undefined)
		{
			console.log("rotated already", rot)
			s += "rotate("+rot+"deg)";
		}
		if(rotx != undefined)
		{
			s += "rotateX("+rotx+"deg)";
		}
		str = s + " rotateY("+value+"deg)"
		console.log("Transform string before writing y", str);
		me.selectedOrchElement.css("transform", str);
		me.selectedOrchElement.attr("data-rotate", value);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate-y", value)

		id = me.selectedOrchElement.attr("id").split("_")[1];
		console.log("Updating slidethumb", $("#slidethumb_"+id));

		$("#slidethumb_"+id).attr("data-rotate-x", rotx);
		$("#slidethumb_"+id).attr("data-rotate-y", value);
		$("#slidethumb_"+id).attr("data-rotate", rot);
		$("#slidethumb_"+id).attr("data-transform-string", str)
	},
	setupPopover : function()
	{
		$(".slidelement").popover({html:"hello world",placement:"bottom", trigger:"click"})
	},
	enableDrag : function()
	{

		//$(".slidelement").drags();
		$(".slidelement").draggable().on("dblclick", function( e )
		{
			e.stopPropagation();
			$(this).draggable({disabled : false})
			//$(this).attr("contentEditable", true);
			$("#play").css("display", "none");
			$(this).removeClass("movecursor");
			

		}).on("click", function ( e )
		{
			console.log("click firing....")
			e.stopPropagation();
			$(this).draggable({disabled : true})
			//$(this).attr("contentEditable", true);
			$(".slidelement").removeClass("elementselected");
			//$(this).addClass("elementselected")
			me.selectElement( $(this));
			me.selectedforedit = true;
			me.setTransformValues( $(this) );
			me.setMenuControlValues ( $(this) );
			me.positionTransformControl()
			
			
		}).on("mousedown mouseover", function( e )
		{
			$(this).addClass("movecursor")
		}).on("mouseup", function( e )
		{
			console.log("mouse upping", me.selectedSlide );
			me.generateScaledSlide( me.selectedSlide );
		})
		
		
	},
	positionTransformControl : function( )
	{
		_transform = me.selectedElement.css("-webkit-transform");
		$("#play").css("-webkit-transform", _transform);
		$("#play").css("display", "block");
		$("#play").width ( me.selectedElement.width());
		//$("#play").height( me.selectedElement.height());
		$("#play").css("left",   me.selectedElement.position().left+"px");
		$("#play").css("top", 	 me.selectedElement.position().top+"px");
		$("#spandelete").on("click", function(e)
		{
			e.stopPropagation();
			me.selectedElement.remove();
			$("#play").css("display", "none");
		})
	},
	setMenuControlValues : function( el )
	{
		var isbold = el.attr("data-isbold");
		var isitalic = el.attr("data-isitalic");
		var isunderline = el.attr("data-isunderline");
		if(isbold)
		{
			$("#makebold").addClass("active")
		}
		else
		{
			$("#makebold").removeClass("active")
		}

		if(isitalic)
		{
			$("#makeitalic").addClass("active")
		}
		else
		{
			$("#makeitalic").removeClass("active")
		}

		if(isunderline)
		{
			$("#makeunderline").addClass("active")
		}
		else
		{
			$("#makeunderline").removeClass("active")
		}
	},
	resetMenuControlValues : function()
	{
		$(".menubtn").removeClass("active");
	},
	setTransformValues : function( el )
	{
		/*rotation = el.attr("data-rotate");
		skewx = el.attr("data-skewx");
		skewy = el.attr("data-skewy");
		$("#rotationknob").val( rotation || 0 )
		$("#skewxknob").val( skewx  || 0)
		$("#skewyknob").val( skewy || 0)
		*/
	},
	selectElement : function( el )
	{
		me.selectedElement = el;
	},
	calculateFontSize : function( type )
	{
		size = "";
		switch( type )
		{
			case "h3" :
				size = "4.5px";
				break;
			case "h2" :
				size = "5.5px";
				break;
		}
		console.log("size", size)
		return size;
	},
	setupColorpickerPopup : function()
	{
		$("#colorpickerbtn").popover("hide")
		$("#colorpickerbtn").on("click", function(e)
		{
			console.log("Inside click");
			e.stopPropagation();
			if(me.colorpickeropen)
			{
				$("#colorpickerbtn").colorpicker("hide");
				me.colorpickeropen = false;
			}
			else
			{
				$("#colorpickerbtn").colorpicker("show").on("changeColor", function( e )
				{
					console.log("color", e.color.toHex(), $(this))
					me.colorSelectedElement( e.color.toHex());
					//$(this).colorpicker("hide");

				});
				me.colorpickeropen = true;
			}
			
		})
	},
	positionOrchestrationPanel : function()
	{
		ypos = $(".mainfooter").position().top;
		ht = $(".mainfooter").height();
		orchestrationareapos = ypos + ht;
		console.log("ypos", ypos)
		//$(".orchgreyarea").css("top", orchestrationareapos+"px" );
	},
	addSettingsPanel : function( type )
	{
		$(".settingsbox").html(newpresotemplate);
		//this.addSlide();
		this.removelisteners();
		this.attachListeners();
	},
	manageGlobalClick : function(e)
	{
		$("#colorpickerbtn").colorpicker("hide");
		$(".slidelement").draggable({disabled : false})
		//console.log("in globel ",e.target);
		//$(".dropdownpopup").css("display", "none");
		$("#play").css("display", "none");
		me.generateScaledSlide(me.selectedSlide);
		me.selectedforedit = false;
		me.colorpickeropen = false;
		me.resetMenuControlValues();
		//me.clearElementSelections()
	},
	clearElementSelections : function()
	{
		$(".slidelement").removeClass("elementhover")
		$(".slidelement").removeClass("elementselected")
		//me.selectedElement = "";;
	},
	colorSelectedElement : function( color )
	{
		if(me.selectedElement)
		{
			me.selectedElement.css("color", color);
		}
		
	},
	addSlide : function()
	{
		thumb = slidethumb;
		uid = me.generateUID()
		thumb = thumb.split("slidethumb_^UID^").join("slidethumb_"+uid)
		$(".slidethumbholder").append( thumb );
		$("#slidethumb_"+uid).animate({opacity:1}, 200);


		$("#slidethumb_"+uid).attr("data-left", me.lastslideleftpos+"px");
		$("#slidethumb_"+uid).attr("data-top", "0px");
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			})
		})
		$(".slidemask").on("click", function( e )
		{
			e.stopPropagation();
			id = (e.target.id).split("_")[1];
			console.log("slidemask", id);
			me.selectSlide( "#impress_slide_"+id );
			$(".slidethumb").removeClass("currentselection");
			$("#slidethumb_"+id).addClass("currentselection");
			me.hideTransformControl();
			me.switchView("right");
		})
		//me.orchestrationcoords.push({left:"0px", top:"0px"});
		me.lastslideleftpos += 200;
		me.assignSlideNumbers();
		me.addImpressSlide( uid );
		me.switchView( "right" );
		$("#presentationmetatitle").html($("#titleinput").val());

	},
	addImpressSlide : function( id )
	{
		islide = impress_slide;
		islide = islide.split("__slidenumber__").join("_"+id);
		islide = islide.split("slidelement_id").join("slidelement_"+me.generateUID());
		$(".impress-slide-container").append( islide );
		$("#impress_slide_"+id).addClass("impress-slide-element")
		me.removeAllStyles($("#impress_slide_"+id));
		//$("#impress_slide_"+id).addClass(me.theme);
		me.applyStyle();
		me.selectSlide("#impress_slide_"+id);
		me.enableDrag();
		me.generateScaledSlide("#impress_slide_"+id);
	},
	addImpressSlideItem : function ( el )
	{
		console.log("adding the new item....")
		item = text_snippet;
		item = item.split("slidelement_id").join("slidelement_"+me.generateUID());
		$(el).append( item );
		me.enableDrag();
		me.generateScaledSlide( me.selectedSlide );
	},
	generateScaledSlide : function( el )
	{
		tempel = el;
		newel = $(el).clone();
		try
		{
			id = newel.attr("id").split("_")[2];
		}
		catch( e )
		{
			//error.
		}
		console.log("aideeee", id);
		//console.log("element id", id);
		//$("clonethumb_"+id).remove();
		newel.attr("id", "clonethumb_"+id);
		newel.attr("data-clone", true);
		newel.css("-webkit-transform", "scale(0.18, 0.18)");
		newel.removeClass("impress-slide-element")
		//newel.css("border", "1px solid #999");
		newel.css("left", "-110px");
		newel.css("top", "-75px");
		children = $("#slidethumb_"+id).children();
		//console.log("children", children)
		for(var i=0; i<children.length; i++)
		{
			
			child = children[i];
			if($(child).attr("data-clone") == "true")
			{
				$(child).remove();
			}
		}


		$("#slidethumb_"+id).append( newel );
		//$(".orchestrationviewport").append( orchel );
		//$(".impress-slide").append( newel );
		

	},
	selectSlide : function( id )
	{

		children = $(".impress-slide-container").children();
		//console.log("I am in selection", children)
		for(var i=0; i< children.length; i++)
		{
			child = children[i];
			childid = "#"+child.id;
			if(childid == id)
			{
				//console.log("found", childid);
				$(childid).css("z-index", 1)
				me.selectedSlide = $(childid);
			}
			else
			{
				console.log("did not find", childid);
				$(childid).css("z-index", -200 + (-(Math.round(Math.random()*1000))))
			}
		}
	},
	assignSlideNumbers : function()
	{
		children = $(".slidethumbholder").children();
		//console.log("children", children);
		for(var i = 0; i< children.length; i++)
		{
			child = $(children[i]);
			count = i;
			//console.log("child", $("#"+child[0].id).find(".slidedisplay").html())
			$("#"+child[0].id).find(".slidedisplay").html("Slide "+(++count))
			//slidenumber = $("#"+child[0].id).find(".slidedisplay").html();
			//child.innerText = child.innerText.split("__text__").join("Slide "+(++count));
		}
	},
	generateUID: function ()
	{
		return Math.round(Math.random()*10000);
	},
	animateSettingsPanel : function ( direction )
	{
		if(direction == "left")
		{
			$(".settingsbox").animate({"left": "-500px", "opacity": 0}, { duration: 300, easing: "linear" })
			me.menuopen = false;
		}
		if(direction == "right")
		{
			$(".settingsbox").animate({"left": "230px", "opacity":1}, {duration: 300, easing: "linear" });
			me.menuopen = true;

		}
	},
	assembleOrchestrationTiles : function()
	{
		$(".orchestrationviewport").html("");
		orchestrationElements = [];

		var children = $(".slidethumbholder").children();

		l = 10;

		for(var i=0 ; i<children.length; i++)
		{
			console.log("looping children")
			child = children[i];
			clone = $(child).clone();
			clone.removeClass("slidethumb");
			clone.addClass("orchthumb");
			console.log("clone", clone);
			clone.attr("id", "orchestrationelement_"+$(child).attr("id").split("_")[1]);
			clone.css("opacity", 1);
			clone.css("position", "absolute");
			clone.css("transform", clone.attr("data-transform-string"));
			console.log("Pre check: ", clone.attr("data-left"));



			clone.find(".deletebtn").remove();
			clone.draggable().on("mouseup", function()
			{
					$(this).attr("data-left",$(this).css("left"));
					$(this).attr("data-top",$(this).css("top"));
					console.log("accessing ", $(this).attr("id"));
					id = $(this).attr("id").split("_")[1];

					$("#slidethumb_"+id).attr("data-left",$(this).css("left"));
					$("#slidethumb_"+id).attr("data-top",$(this).css("top"));

			});
			clone.on("click", function(e)
			{
				$(".orchthumb").removeClass("currentselection");
				$(this).addClass("currentselection");
				me.selectedOrchElement = $(this);

				rot = me.selectedOrchElement.attr("data-rotate");
				rotx = me.selectedOrchElement.attr("data-rotate-x");
				roty = me.selectedOrchElement.attr("data-rotate-y");
				scale = me.selectedOrchElement.attr("data-scale");
				depth = me.selectedOrchElement.attr("data-z");

				$("#rotationknob").val(rot || 0).trigger("change");
				$("#skewxknob").val(rotx || 0).trigger("change");
				$("#skewyknob").val(roty || 0).trigger("change");
				$("#scalerange").val( scale || 1 );
				$("#depthrange").val( depth || 1000 );
			})
			$(".orchestrationviewport").append(clone);
			orchestrationElements.push( clone );

			l+= 200;
		}
		me.repositionOrchestrationElements( orchestrationElements );
	},
	repositionOrchestrationElements : function( arr )
	{
		var children = $(".slidethumbholder").children();
		console.log("Current slide count", children.length, "Orchestration el count", arr.length)
		for(var i=0 ; i < arr.length; i++)
		{
			console.log("Props", $(children[i]).attr("data-left"), $(children[i]).attr("data-top"))
			arr[i].css("left", $(children[i]).attr("data-left"));
			arr[i].css("top", $(children[i]).attr("data-top"));
		}
	},
	switchView : function( direction )
	{
		if(direction == "left")
		{
			//me.animatePanel( ".mainviewport", "-730px" )
			$(".maingreyarea").css("display", "none");
			$(".orchgreyarea").css("display", "block");
			$("#viewtoggleicon").removeClass("icon-th-large")
			$("#viewtoggleicon").addClass("fui-cross-24");
			me.currentview = "orchestration"
			me.assembleOrchestrationTiles();
			
		}
		else
		{
			//me.animatePanel( ".mainviewport", "0px" );
			$(".maingreyarea").css("display", "block");
			$(".orchgreyarea").css("display", "none");
			$("#viewtoggleicon").removeClass("fui-cross-24");
			$("#viewtoggleicon").addClass("icon-th-large")
			me.currentview = "mainarea"
			me.persistOrchestrationCoordinates();

		}
	},
	persistOrchestrationCoordinates : function()
	{
		var children = $(".orchestrationviewport").children();
		me.orchestrationcoords = [];
		for(var i=0; i<children.length; i++)
		{
			child = $(children[i]);
			l = child.attr("data-left");
			t = child.attr("data-top");
			console.log("Child", i, l, t);
			me.orchestrationcoords.push( {left: l, top: t});
		}
	},
	onViewToggled : function ( e )
	{
		if(me.currentview == "mainarea")
		{
			me.switchView( "left")
		}
		else
		{
			me.switchView( "right")
		}
	},
	animatePanel : function( panel, amount )
	{
		$(".maskedcontainer").animate({"top": amount, "opacity":1}, {duration: 300, easing: "linear" })
	},
	changeTextFormat : function( classname )
	{
		if(me.selectedforedit)
		{
			me.removeTextFormatting()
			me.selectedElement.addClass( classname );
		}
		
	},
	removeTextFormatting : function()
	{
		me.selectedElement.removeClass("slidelementh1");
		me.selectedElement.removeClass("slidelementh3");
	},
	openCodeExportWindow : function()
	{
		me.generateExportMarkup();
		//hljs.tabReplace = '    '; // 4 spaces
		$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
		//me.autoFormat();
		$("#exportcodemodal").modal("show");
	},
	attachListeners : function()
	{
		$("html").on("click", me.manageGlobalClick)
		$(".settingsCancelBtn").on("click", me.onSettingsCancelClicked);
		$(".menuItemBtn").on("click", me.onMenuItemClicked)
		$(".viewtogglebtn").on("click", me.onViewToggled);
		$(".slidelement").on("click", me.triggetElementEdit)
		$(".slidelement").on("mouseup", me.createEditor)
		$("#newstylepanel").on("click", me.openStyleSelector);
		$("#exportpresopanel").on("click", me.openCodeExportWindow)
		$("#editpresonamebtn").on("click", function( e )
		{
			$("#newpresentationmodal").modal("show");
			$("#newpresoheader").html("Save Presentation As");
			me.mode = "save";
		})
		$(".previewpresobtn").on("click", function( e )
		{
			console.log("data parent id", $(this).attr("data-id"));
			me.fetchAndPreview( $(this).attr("data-id") )
		})
		$(".openpresobtn").on("click", function( e )
		{
			console.log("Edit presentation");
			me.mode = "save";
			me.openPresentationForEdit( $(this).attr("data-id") );
			
		})
		$("#createpresentation").on("click", function( e )
		{
			console.log("Mode", me.mode);
			if(me.mode == "create")
			{
				me.createNewPresentation();
			}
			else
			{
				console.log("saving now")
				me.savePresentation();
			}
			
			
		})
		$("#savepresentationbtn").on("click", function( e )
		{
			if(me.currentPresentation)
			{
				console.log("Has access to current presentation");
				$("#titleinput").val( me.currentPresentation.title)
				$("textarea#descriptioninput").val( me.currentPresentation.description);
			}
			//$("#newpresentationmodal").modal("show");
			me.mode = "save";
			me.savePresentation();
		})
		$("#openpreviewbtn").on("click", function(e)
		{
			window.open("http://harish.io/impressionist/viewer.php", "_blank");
			$("#previewmodal").modal("hide");
		});
		$(".dropdownitem").on("click", function( e )
		{
				console.log("Dd value: " , $(e.target).attr("data-dk-dropdown-value"))
				me.changeTextFormat( $(e.target).attr("data-dk-dropdown-value")  )
				$(".dropdownpopup").css("display", "block");
				$(".pulldownmenu").html($(e.target).html());
			//$(".dropdownpopup").css("display", "none");
				me.dropdownopen = true;
				me.hideTransformControl();	
		})
		$("#addtextbtn").on("click", function ( e )
		{
			console.log("add btn clicked...")
			me.addImpressSlideItem( me.selectedSlide );
		})
		$("#addimagebtn").on("click", function( e )
		{
			console.log("open image modal...");
			$("#imagemodal").modal("show");
		})
		$("#imageinput").on("blur keyup", function(e)
		{
			image = $(this).val();
			$("#previewimg").attr("src", image);
		})
		$("#addslidebtn").on("click", function( e )
		{
			me.addSlide();
		});
		$("#appendimagebtn").on("click", function( e )
		{
			console.log("append image to stage");
			image = $("#previewimg").attr("src");
			me.addImageToSlide( image );
			$("#imagemodal").modal("hide");
		})
		$("#openpresentationsbtn").on("click", function( e )
		{
			$(".previewpresobtn").on("click", function( e )
			{
				console.log("data parent id", $(this).attr("data-id"));
				me.fetchAndPreview( $(this).attr("data-id") )
			})
			$(".openpresobtn").on("click", function( e )
			{
				console.log("Edit presentation");
				me.mode = "save";
				me.openPresentationForEdit( $(this).attr("data-id") );
			})
			$("#savedpresentationsmodal").modal("show");
		})
		$("#exportcontentbtn").on("click", function( e )
		{
			me.generateExportMarkup( true );

		
		});
		$(".stylethumbnail").on("click", function(e )
		{
			$(".stylethumbnail").css("border-bottom", "1px dotted #DDD");
			$(this).css("border-bottom", "2px solid #1ABC9C")
			me.theme = $(this).attr("data-style");
		})
		$("#applystylebtn").on("click", function( e )
		{
			me.applyStyle();
			$("#styleselectionmodal").modal("hide");
		})


		
	},
	applyStyle : function()
	{
		$(".slidelement").each( function( i, object)
			{
				if($(this).hasClass("slidelementh1"))
				{
					console.log("Only change headings.")
					me.removeAllStyles( $(this));
					$(this).addClass(me.theme);
				}
			})
	},
	removeAllStyles : function( el )
	{
		el.removeClass("quicksand");
		el.removeClass("montserrat");
		el.removeClass("sketch");
		el.removeClass("miltonian");
	},
	openStyleSelector : function()
	{
		$("#styleselectionmodal").modal("show");
	},
	deleteSavedPresentation : function( id )
	{
		presentations = JSON.parse(me.getItem(me.saveKey));
		for(var i=0; i< presentations.length; i++)
		{
			presentation = presentations[i];
			if(id == presentation.id)
			{
				presentations.splice(i, 1);
				break;
			}
		}
		console.log("after delete", presentations);
		me.saveItem(me.saveKey, JSON.stringify(presentations));
		presentations = me.getSavedPresentations();
		me.renderPresentations( presentations );
		lastsaved =JSON.parse(me.getItem(me.lastSaved));
		if(lastsaved.id == id)
		{
			console.log("lastsaved", lastsaved.id);
			localStorage.removeItem(me.lastSaved);
		}
	},
	generateExportMarkup : function( isPreview )
	{
		var children = $(".slidethumbholder").children();
			for(var i=0; i<children.length; i++)
			{
				child = $(children[i]);
				id = child.attr("id").split("_")[1];
				l = child.attr("data-left").split("px")[0];
				t = child.attr("data-top").split("px")[0];

				coords = me.calculateSlideCoordinates(l,t);
				el = $("#impress_slide_"+id)
				el.attr("data-x", coords.x - 500);
				el.attr("data-y", coords.y);
				el.attr("data-rotate", child.attr("data-rotate"));
				el.attr("data-rotate-x", child.attr("data-rotate-x"));
				el.attr("data-rotate-y", child.attr("data-rotate-y"));
				el.attr("data-z", child.attr("data-z"));
				el.attr("data-scale", child.attr("data-scale"));
				el.addClass("step");
			}
			outputcontainer = $(".impress-slide-container").clone();
			console.log("output", $(".impress-slide-container").html().toString());
			outputcontainer.find(".impress-slide").each( function(i, object )
			{
				console.log("Physically adding sizing information");
				$(this).css("width", "1024px");
				$(this).css("height", "768px");
				

			})

			if(isPreview)
			{
				me.generatePreview( outputcontainer.html().toString() );
			}
			$("#exportedcode").text( outputcontainer.html().toString() );
	},
	createNewPresentation : function()
	{
		$(".slidethumbholder").html("");
		$(".impress-slide-container").html();
		me.addSlide();
		me.savePresentation();
	},
	openPresentationForEdit : function( id )
	{
		console.log("id", id)
		for(var i=0; i<me.mypresentations.length; i++)
		{
			presentation = me.mypresentations[i];
			if(id == presentation.id)
			{
				$(".impress-slide-container").html(presentation.contents);
				$(".slidethumbholder").html(presentation.thumbcontents);
				$(".slidethumbholder").each( function(i, object )
				{
					$(this).css("opacity", 1);
				});

				me.selectedSlide = $(".impress-slide-container").find(".impress-slide-element")
				me.currentPresentation = presentation;
				$("#presentationmetatitle").html(me.currentPresentation.title);
				console.log("rendered")
			}

			$("#savedpresentationsmodal").modal("hide");

		}
		$(".slidemask").on("click", function( e )
		{
				console.log("repopulated zone")
				e.stopPropagation();
				id = (e.target.id).split("_")[1];
				console.log("slidemask", id);
				me.selectSlide( "#impress_slide_"+id );
				$(".slidethumb").removeClass("currentselection");
				$("#slidethumb_"+id).addClass("currentselection");
				me.hideTransformControl();
				me.switchView("right");
		});
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			})
		})
		me.enableDrag();
	},
	fetchAndPreview : function( id )
	{
		for(var i=0; i<me.mypresentations.length; i++)
		{
			presentation = me.mypresentations[i];
			if(id == presentation.id)
			{
				console.log("content", presentation.contents);
				$(".placeholder").html( presentation.contents);
				$(".placeholder").find(".impress-slide").each( function(i, object )
				{
					console.log("Physically adding sizing information, again");
					$(this).css("width", "1024px");
					$(this).css("height", "768px");
					$(this).addClass("step");
				})
				me.generatePreview( $(".placeholder").html().toString());
				$("#savedpresentationsmodal").modal("hide");
				break;
			}
		}
	},
	savePresentation : function()
	{
			$("#savepresentationbtn").text("Saving...")
			item = me.getItem(me.saveKey);
			if(item)
			{
				arr = JSON.parse(item);
				if(this.mode == "save")
				{
					if(me.currentPresentation)
					{
						arr = me.removeReference( arr );
					}
					
				}
				
			}
			else
			{
				arr = [];
			}
			if(this.mode == "save")
			{
				if(me.currentPresentation)
				{
					tempid = me.currentPresentation.id
				}
				else
				{
					tempid = Math.round(Math.random() * 201020)
				}
				
			}
			else
			{
				tempid = Math.round(Math.random() * 201020)
			}
			
			var o = {
							id : tempid,
							title: $("#titleinput").val(), 
							description: $("textarea#descriptioninput").text(),
							contents : $(".impress-slide-container").html().toString(),
							thumbcontents : $(".slidethumbholder").html().toString(),
							theme : me.theme
					};
			me.currentPresentation = o;
			$("#presentationmetatitle").html(me.currentPresentation.title);
			arr.push( o );
			me.saveItem(me.saveKey, JSON.stringify(arr));
			me.saveItem(me.lastSaved, JSON.stringify(o));
			presentations = me.getSavedPresentations();
			presentations.reverse();
			me.renderPresentations( presentations );

			$(".previewpresobtn").on("click", function( e )
			{
				console.log("data parent id", $(this).attr("data-id"));
				me.fetchAndPreview( $(this).attr("data-id") )
			})
			$(".openpresobtn").on("click", function( e )
			{
				console.log("Edit presentation");
				me.mode = "save";
				me.openPresentationForEdit( $(this).attr("data-id") );
			})
			$("#newpresentationmodal").modal("hide");
			setTimeout(me.resetSaveButtonText, 1000)
	},
	resetSaveButtonText : function()
	{
		$("#savepresentationbtn").html('<i class="icon-ok-sign"></i>&nbsp;Save')
	},
	removeReference : function( arr )
	{
		
		for(var i=0; i<arr.length; i++ )
		{
			if(arr[i].id == me.currentPresentation.id)
			{
				arr.splice(i,1);
				break;
			}
		}

		return arr;
	},
	getSavedPresentations : function()
	{
			item = me.getItem(me.saveKey);
			arr = [];
			if(item)
			{
				 arr = JSON.parse(item);
			}
			return arr;
	},
	generatePreview : function ( str )
	{
		$("#previewmodal").modal("show");
		$("#openpreviewbtn").addClass("disabled");
		$("#openpreviewbtn").removeClass("btn-primary");
		$("#progressmeter").css("display", "block");
		$("#previewmessage").html("Please wait while we generate the preview.")
		$.ajax({
			type: 'POST',
			 url: "http://harish.io/impressionist/generatePreview.php",
			 data: {generateddata:str},
			 dataType: "html",
			 success: function(msg)
			 {
			 	console.log("Preview Generated");
			 	$("#openpreviewbtn").removeClass("disabled");
			 	$("#openpreviewbtn").addClass("btn-primary");
			 	$("#progressmeter").css("display", "none");
			 	$("#previewmessage").html("Slide preview successfully generated.");

			 }
		});
	},
	calculateSlideCoordinates : function(wx, wy)
	{
		var vx = Math.round(((me.vxmax - me.vxmin)/(me.wxmax - me.wxmin) )*(wx - me.wxmin) + me.vxmin);
		var vy = Math.round(((me.vymax - me.vymin)/(me.wymax - me.wymin) )*(wy - me.wymin) + me.vymin);
		var object = {x:vx, y:vy};
		console.log("object", object);
		return object;
	},
	addImageToSlide : function( src )
	{
		console.log("adding image", src);
		var img = new Image();
		$(img).attr("id", "slidelement_"+me.generateUID())
		$(img).css("left", "200px");
		$(img).css("top", "200px");
		$(img).addClass("slidelement");
		$(img).attr("src", src);
		console.log("selectedslide", me.selectedSlide);
		me.selectedSlide.append( $(img) );
		me.enableDrag();
	},
	removeSlide : function(el)
	{
		el.remove();
		clearInterval(me.deleteslideinterval);
	},
	createEditor : function( e )
	{
		editor = $(e.target).clone();
		editor.attr("contentEditable", "true");
	},
	triggetElementEdit : function( e )
	{
		$(e.target).attr("contentEditable", true);
	},
	removelisteners : function()
	{
		$(".settingsCancelBtn").off();
		$(".viewtogglebtn").off();
	},
	onSettingsCancelClicked : function( e )
	{
		console.log("clicked")
		me.animateSettingsPanel( "left" )

	},
	onMenuItemClicked : function( e )
	{
		$("#newpresentationmodal").modal("show");
		$("#newpresoheader").html("Create New Presentation");
		me.mode = "create";
	},
	calculateThumbnailCoords : function(wx, 
										wy, 
										vxmax, 
										vxmin, 
										vymax, 
										vymin, 
										wxmax, 
										wxmin, 
										wymax, 
										wymin
										)
	{
		var vx = Math.round(((vxmax - vxmin)/(wxmax - wxmin) )*(wx - wxmin) + vxmin);
		var vy = Math.round(((vymax - vymin)/(wymax - wymin) )*(wy - wymin) + vymin);
		var object = {x:vx, y:vy};
		return object;
	},
	saveItem : function(key, value)
	{
		if(me.isSupported())
		{
			localStorage.setItem(key, value);
		}

	},
    getItem : function(key)
	{
		return localStorage.getItem(key);
	},
	isSupported : function()
	{
		if(localStorage)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}