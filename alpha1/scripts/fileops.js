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
function createArchiveAndDownload()
{
	var filename = currentSaveName+"_"+new Date().getTime();
	$.ajax({
			type: 'POST',
			 url: "server/generateArchive.php",
			 data: {data:previewoutputstring, filename:filename},
			 success: function(msg)
			 {
			 	window.open("server/download.php?filename="+filename, "_blank");
			 }
	});
}
function createOrOpen(project)
{
	if(oldpresoselected)
	{
		var projdata = getItem(project);
	}
}
function saveAndCreate()
{
	markedforcreate = true;
	doSave()
}
function writeToLocalStore(key)
{
		replacepreso = false;
		var savedObject = getItem("saved");
		var savedObjectString = "";
		var arr = [];
		if(savedObject != undefined)
		{
			arr = savedObject.split("**|**");
		}
		savedObjects = new Array()
		if(arr.length > 0)
		{
			for(var i =0; i<arr.length; i++)
			{
				if(key == arr[i])
				{
					replacepreso = true;
				}
				savedObjects.push(arr[i]);
			}
		}
		if(!replacepreso)
		{
			savedObjects.push(key);
		}
		var presolist = savedObjects.join("**|**");
		saveItem("saved", presolist);

	
		var slidemapstr = getSlidemapString();
		var objectmapstr = getObjectMapString();
		var htmlstr = $("#drawingboard").html();
		var orchstr = getOrchestrationData();
		var savestr = slidemapstr +"{|||}"+objectmapstr+"{|||}"+htmlstr+"{|||}"+orchstr;
		saveItem(key, savestr);
		if(markedforcreate)
		{
			createNewPresentation();

		}
}
function checkForSavedPresentations()
{
   var savedPresos =   getItem("saved");
   if(savedPresos != undefined)
   {
   		savedPresentations = savedPresos.split("**|**");
   		
   }
   showOpenDialog();
}
function setSaveName()
{
	var n = $("#saveInput").val();
	if(n == "")
	{
		n = "untitled"+Math.round(Math.random()*10000);
	}
	currentSaveName = n.split(" ").join("_");
	writeToLocalStore(currentSaveName);
}
function doSaveAs()
{
	openSaveDialog();
}
function doSave()
{
	if(currentSaveName == "")
	{
		openSaveDialog();
	}
	else
	{
		writeToLocalStore(currentSaveName);
	}
}
function openSaveDialog()
{
	if(markedforcreate)
	{
		//$("#savepresoheader").html("Save Current Presentation.")
	}
	$("#saveModal").modal();

}