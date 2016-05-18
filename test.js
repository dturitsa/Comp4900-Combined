var toolFlag = false;
var wandFlag = false;
var colorElimFlag = false;
var colourFlag = false;
var leftPercent = 0.5;
var rightPercent = 0.5;
var dragOrclick = true;
var draggedElement;
var allowDraw;
var font;
var brightness = 0;
var erasing = false;
var erasing2 = false;
var ElementsFull = [false, false, false, false, false];
var whichElement;
var font;
$(document).ready(function() {
	var item = 0;
	var item2 = 0;
	// this is the mouse position within the drag element
	var startOffsetX, startOffsetY;
	
	$('[data-toggle="tooltip"]').tooltip();   
	
	$("#leftButton").click(function() {
		if (item == 0) {
			item2 = 1; item = 2;
			rightPercent = 0.8; leftPercent = 0.2;
		} else if (item == 1) {
			item2 = 0; item = 0;
			rightPercent = 0.5; leftPercent = 0.5;
		}
		dragOrclick = false;
		$(window).trigger('resize');
	});
	
	$("#rightButton").click(function() {
		if (item2 == 0) {
			item = 1;item2 = 2;
			rightPercent = 0.2; leftPercent = 0.8;
		} else if (item2 == 1) {
			item = 0; item2 = 0;
			rightPercent = 0.5; leftPercent = 0.5;
		}
		dragOrclick = false;
		$(window).trigger('resize');
	});
	
	$("#ExitButton").click(function() {
		$("#ElementDisplay").fadeOut();
		whichElement = null;
	});
	
	$("#toolButton").click(function() {
		toolFlag = true;
		$(this).fadeOut();
		$("#content").stop().animate({paddingLeft: 60},
			{step: function() {
				$(window).trigger('resize');
			}
		})
		.promise().done(function() {
			$("#toolBar").slideDown();
		});
	});
	
	$("#hideToolButton").click(function() {
		toolFlag = false;
		$('#tool2, #tool1, #tool4').css({"backgroundColor":"black"});
		$("#toolBar").slideUp( function() {
			$("#toolButton").fadeIn();
			$("#content").stop().animate({paddingLeft: 0},
				{step: function() {
					$(window).trigger('resize');
				}
			});
		});
		
	});
	
	$(".Elements").hover(function() {
			$(this.id).css({borderColor:"#0000ff"});
		}, function() {
			$(this.id).css({borderColor:"#000000"});
	});
	
	$(".Elements").click(function() {
		switch(this.id) {
			case "Element1":
				if (ElementsFull[0]) {
					ShowEditCanvas(whichElement = this);
				}
				break;
			case "Element2":
				if (ElementsFull[1]) {
					ShowEditCanvas(whichElement = this);
				}
				break;
			case "Element3":
				if (ElementsFull[2]) {
					ShowEditCanvas(whichElement = this);
				}
				break;
			case "Element4":
				if (ElementsFull[3]) {
					ShowEditCanvas(whichElement = this);
				}
				break;
			case "Element5":
				if (ElementsFull[4]) {
					ShowEditCanvas(whichElement = this);
				}
				break;
		}
		
	});
	
	$("#tool1").click(function() {
		wandFlag = false;
		colorElimFlag = false;
		colourFlag = false;
		erasing = false;
		$('#uploadedImage').imgAreaSelect({onSelectChange: preview });
		$("#previewCanvas").attr("draggable", "true");
		$('#thresSlider')
			.slideUp()
			.promise().done(function() {
				$('#cropOut').slideUp();
		});
		$('#thresSlider2')
			.slideUp()
			.promise().done(function() {
				$('#cropOut2').slideUp();
		});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
		$('#brightLabel').css({display: 'none'});
		$('#brightnessSlider').css({display: 'none'});
		$('#greyScaleLabel').css({display: 'none'});
		$('#greyScaleButton').css({display: 'none'});
		$('#eraserSlider').css({display: 'none'});
	});
	
	$("#tool2").click(function() {
		wandFlag = true;
		colorElimFlag = false;
		colourFlag = false;
		erasing = false;
		$('#uploadedImage').imgAreaSelect({remove:true});
		$("#previewCanvas").attr("draggable", "false");
		$('#cropOut')
			.slideDown()
			.promise().done(function() {
				$('#thresSlider').slideDown();
		});
		$('#thresSlider2')
			.slideUp()
			.promise().done(function() {
				$('#cropOut2').slideUp();
		});
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
		$('#brightLabel').css({display: 'none'});
		$('#brightnessSlider').css({display: 'none'});
		$('#greyScaleLabel').css({display: 'none'});
		$('#greyScaleButton').css({display: 'none'});
		$('#eraserSlider').css({display: 'none'});
	});
	
	$("#tool3").click(function() {
		colourFlag = true;
		colorElimFlag = false;
		wandFlag = false;
		erasing = false;
		copyColourData();
		$('#uploadedImage').imgAreaSelect({remove:true});
		$("#previewCanvas").attr("draggable", "false");
		$('#thresSlider')
			.slideUp()
			.promise().done(function() {
				$('#cropOut').slideUp();
		});
		$('#thresSlider2')
			.slideUp()
			.promise().done(function() {
				$('#cropOut2').slideUp();
		});
		$('#brightLabel').css({display: ''});
		$('#brightnessSlider').css({display: ''});
		$('#greyScaleLabel').css({display: ''});
		$('#greyScaleButton').css({display: ''});
		$('#eraserSlider').css({display: 'none'});
		$('#redLabel').css({display: ''});
		$('#greenLabel').css({display: ''});
		$('#blueLabel').css({display: ''});
		$('#redSlider').css({display: ''});
		$('#greenSlider').css({display: ''});
		$('#blueSlider').css({display: ''});
	});

	$('#tool5').click(function () {
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$('#cropOut').css({display: 'none'});
		$('#thresSlider').css({display: 'none'});
		$('#cropOut2').css({display: 'none'});
		$('#thresSlider2').css({display: 'none'});
		var image = {
	        data: imageInfo.data.data,
	        width: imageInfo.width,
	        height: imageInfo.height,
	        bytes: 4
	    };
		mask = eliminateWhite(image, 64);
		//console.log(mask);
		cropOut();
	});
	
	$("#cropOut").click(function() {
		cropOut();

	});
	$("#cropOut2").click(function() {
		cropOut();
		
	});
	$("#tool4").click(function() {
		wandFlag = false;
		colorElimFlag = true;
		colourFlag = false;
		erasing = false;
		$('#uploadedImage').imgAreaSelect({remove:true});
		$("#previewCanvas").attr("draggable", "false");
		$('#thresSlider')
			.slideUp()
			.promise().done(function() {
				$('#cropOut').slideUp();
		});
		$('#cropOut2')
			.slideDown()
			.promise().done(function() {
				$('#thresSlider2').slideDown();
		});
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
		$('#brightLabel').css({display: 'none'});
		$('#brightnessSlider').css({display: 'none'});
		$('#greyScaleLabel').css({display: 'none'});
		$('#greyScaleButton').css({display: 'none'});
		$('#eraserSlider').css({display: 'none'});
	});
	
	$('#undoButton').click(function() {
		undo();
	});
	
	$('#greyScaleButton').click(function() {
		greyScale();
	});
	
	$('#eraserButton').click(function() {
		colourFlag = false;
		colorElimFlag = false;
		wandFlag = false;
		erasing = true;
		$('#uploadedImage').imgAreaSelect({remove:true});
		$("#previewCanvas").attr("draggable", "false");
		$('#cropOut').css({display: 'none'});
		$('#thresSlider').css({display: 'none'});
		$('#cropOut2').css({display: 'none'});
		$('#thresSlider2').css({display: 'none'});
		$('#brightLabel').css({display: 'none'});
		$('#brightnessSlider').css({display: 'none'});
		$('#greyScaleLabel').css({display: 'none'});
		$('#greyScaleButton').css({display: 'none'});
		$('#eraserSlider').css({display: ''});
	});
	
	$('#erase').click(function() {
		colourFlag = false;
		colorElimFlag = false;
		wandFlag = false;
		erasing = false;
		erasing2 = true;
		console.log("clicked");
	});

	$(".dragSource").each(function() {
		this.onmousedown = mousedown;
		this.ondragstart = dragstart;
	});
	  
	$(".dragDest").each(function() {
		this.ondrop = drop;
		this.ondragover = allowDrop;
	});

	$(".freeDropZone").each(function() {
		this.ondrop = freeDrop;
		this.ondragover = allowDrop;
	});
	
	
	$("#imgInp").change(function(){ readURL(this); });

	//make elements resizable
  	$( ".resizable" ).resizable({
  		//locks the aspect ratio when resizing
  		aspectRatio:true,
  		//containment: ".templateBackground",
  		//sets the resize handle in the bottom right corner
  		//handles: {'se': $(".resizeGrip")},

  		//forces resizable height and width to use % instead of px 
  		stop: function( event, ui ) {
   		$(this).css("width",parseInt($(this).css("width")) / ($(this).parent().width() / 100)+"%");
   		$(this).css("height",parseInt($(this).css("height")) / ($(this).parent().height() / 100)+"%");
  		},
  		
	});

   //makes element draggable in the template div (uses % instead of px to scale when template is resized)
   $( ".draggable" ).draggable({
		stop: function( event, ui ) {
		   $(this).css("left",parseInt($(this).css("left")) / ($(this).parent().width() / 100)+"%");
		   $(this).css("top",parseInt($(this).css("top")) / ($(this).parent().height() / 100)+"%");
		}
	});

   $(".templateBackground").mouseout(function() {
   		$( '.draggable' ).draggable().trigger( 'mouseup' );
	});

 	//textBox stuff
	$( "#fontStyleButtons" ).buttonset();
	$( "#fontSelect" ).change(function(){
		updateFont();
	});

	$("#fontSelect").find("option").each(function(){
		$(this).css('fontFamily', $(this).val());
	});

    $( "#signature" ).keyup(function() {
		updateFont();  
     });

    $("#fontStyleButtons").change(function(){
    	updateFont();  
    }); 

    //switch between templates
    $('.templateButtons').click(function(){
       	$( ".templateDiv" ).each(function() {
  			$( this ).css('display', 'none');
		});
		var currentTemplate =  $(this).attr("value");
		$(".templateDiv").css({"backgroundColor":$(this).css("backgroundColor")});
		$("#templateTitle").text($("#" + currentTemplate).attr("value"));
		$('#' + currentTemplate ).css('display', 'block');
    });
	
	$('.buttonDiv')
	.mouseenter(function() {
		$(this).css({"backgroundColor":"#444444"})
	})
	.mouseleave(function() {
		$(this).css({"backgroundColor":"#5555555"})
	});
	
	
	$("#shirtButton").hover(function() {
		$('.dropdown-content').stop().slideDown();
	});
	
	$('.dropdown-content').click(function() {
		$(this).stop().slideUp();
	});
	
	$('.dropdown-content').mouseleave(function() {
		$(this).stop().slideUp();
	});
    
    
}); //document.ready function closing tag

//create elements dynamically
    function freeDrop(ev) {
    	ev.preventDefault();
		
    	var newElement = $(
    		'<div class="draggable resizable clothESpot1wrap">\
    			<canvas class="clothESpot dragDest"></canvas>\
    		</div>');


    	
    	// checks if there isn't already another element in the drop position
    	if(!$(ev.target).hasClass("clothESpot")){
    		$(this).append(newElement);

    		//sets the width and height of the new element as % of parent
    		var widthPercent = 20 //percent of the parents width the new element should be
    		var widthHeightRatio = newElement.parent().width() / newElement.parent().height();
    		newElement.css("width", widthPercent + "%");
    		newElement.css("height", widthPercent * widthHeightRatio + "%");

    		//sets position of new element
    		
    		var xPos = ev.pageX - $(ev.target).offset().left - newElement.width() / 2;
    		var yPos = ev.pageY - $(ev.target).offset().top - newElement.width() / 2;
    		var leftPercent = xPos / ($(this).width() / 100);
    		var topPercent = yPos / ($(this).height() / 100);
    		newElement.css("left", leftPercent + "%");
   			newElement.css("top", topPercent +"%");

   			//flips upside down if in top part of a flipTop class
   			if($(this).hasClass("flipTop") && topPercent < 50){
   				newElement.css('-ms-transform', 'rotate(180deg)'); //IE9
   				newElement.css('-webkit-transform', 'rotate(180deg)'); //Safari
   				newElement.css('transform', 'rotate(180deg)');
  			}

    		//enable drop on new element
    		$(newElement).find(".dragDest").each(function() {
				this.ondrop = drop;
				this.ondragover = allowDrop;
			});

    		//makes new element draggable
   			newElement.draggable({
  				stop: function( event, ui ) {
   				$(this).css("left",parseInt($(this).css("left")) / ($(this).parent().width() / 100)+"%");
   				$(this).css("top",parseInt($(this).css("top")) / ($(this).parent().height() / 100)+"%");
  				}
			});

			//make new element resizable
  			$(newElement).resizable({
  				//locks the aspect ratio when resizing
  				aspectRatio:true,
  				//forces resizable height and width to use % instead of px 
  				stop: function( event, ui ) {
   					$(this).css("width",parseInt($(this).css("width")) / ($(this).parent().width() / 100)+"%");
   					$(this).css("height",parseInt($(this).css("height")) / ($(this).parent().height() / 100)+"%");
  				}
  			});

  			
  			//draws image in the newly created canvas
  			drawCopiedImage($(newElement).find(".dragDest")[0], ev);
    	}
    	ev.stopPropagation();
    	 return false;
    }

//update signature font style and family, then draw it on multiple canvases 
function updateFont(){
	var fontFamily = $("#fontSelect").val();
	var style = '';
	$('#signature').css('font-family', fontFamily)

	if($('#bCheck').is(":checked")){
        $('#signature').css('font-weight', 'bold')
        style += 'bold ';
    } else{
    	$('#signature').css('font-weight', 'normal')
    }

    if($('#iCheck').is(":checked")){
        $('#signature').css('font-style', 'italic')
        style += 'italic ';
    } else{
    	$('#signature').css('font-style', 'normal')
    }

	$(".signatureCanvas").each(function() {
		drawSignature(this, style, fontFamily);
	});
}

//draws the signature text on the specified canvas
function drawSignature(canvas, style, fontFamily){  
  canvas.width = 1500;
  canvas.height = 500;
  var maxFontSize = canvas.height;
  var fontSize;
  var text = $('#signature').val()
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = style + maxFontSize + "px " + fontFamily;
  var textSize = ctx.measureText(text);

  if(textSize.width > canvas.width){
    fontSize = Math.floor(maxFontSize * (canvas.width / textSize.width));
    ctx.font = style + fontSize + "px " + fontFamily;
  } else{
  	fontSize = maxFontSize;
  }
  ctx.fillText(text, 10, fontSize);
}

$(window).resize(function() {
	var Size = parseFloat($("#content").width());
	if (dragOrclick) {
		if (whichElement != null) {
			var pos = $("#" + whichElement.id).offset();
			var size = $("#ElementDisplay").width();
			$("#ElementDisplay").stop().css({left: pos.left - size, top: pos.top});
		}
		$("#rightSection").stop().css({width:(Size * rightPercent) - 50.5});
		$("#leftSection").stop().css({width:(Size * leftPercent) - 50});
		$("#centerBeam").stop().css({left:(Size * leftPercent)});
	} else {
		$("#rightSection").stop().animate({width:(Size * rightPercent) - 50.5},
			{step: function() {
					if (whichElement != null) {
						var pos = $("#" + whichElement.id).offset();
						var size = $("#ElementDisplay").width();
						$("#ElementDisplay").stop().css({left: pos.left - size, top: pos.top});
					}
				}
			});
		$("#leftSection").stop().animate({width:(Size * leftPercent) - 50});
		$("#centerBeam").stop().animate({left:(Size * leftPercent)});
		dragOrclick = true;
	}
});

/*
    Onload function for the window. initializes the globals and listeners
    for the magic wand select.
*/
window.onload = function() {
    blurRadius = 5;
    simplifyTolerant = 0;
    simplifyCount = 30;
    hatchLength = 4;
    hatchOffset = 0;
	oldImageInfo = null;
	originalImageInfo = null;
    imageInfo = null;
    cacheInd = null;
    mask = null;
    downPoint = null;
    img = null;
	currentCanvas = null;
    allowDraw = false;
	/*
	brightnessSlider = document.getElementById("brightnessSlider");
	
	brightnessSlider.addEventListener("change", greyScale());
	*/
    slider = document.getElementById("thresSlider");

    slider.addEventListener("change", function() {
    	currentThreshold = slider2.value = slider.value;
    	//showThreshold();
    });

    slider2 = document.getElementById("thresSlider2");
	
    slider2.addEventListener("change", function() {
    	currentThreshold = slider.value = slider2.value;
    	//showThreshold();
    });
    colorThreshold = slider.value = slider2.value = 50;
    currentThreshold = colorThreshold;
    //showThreshold();
    setInterval(function () { hatchTick(); }, 300);
}

// Onclick event for the window. allows user to deselect when clicking off the canvas
window.onclick = function(e) {
	if(e.target.id != "uploadedImage") {
		mask = null;	
		var ctx = document.getElementById("uploadedImage").getContext('2d');
		if(imageInfo != null) {
			ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
			ctx.putImageData(imageInfo.data, 0, 0);
		}
	}
};

// Opens an Edit window for croped elements
function ShowEditCanvas(element) {
	var scaleSize = 4;
	var OrigCanvas = document.getElementById($(element).children()[0].id);
	var canvas = document.getElementById("ElementCanvas");
	var ctx = canvas.getContext('2d');
	var pos = $(element).offset();
	var width = OrigCanvas.width;
	var height = OrigCanvas.height;
	canvas.width = width;
	canvas.height = height;
	console.log(width, height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('#uploadedImage').imgAreaSelect({remove:true});
	$("#ElementCanvas").css({"max-width": "100%" ,
					"max-height":500 });
	$("#ElementDisplay").stop().animate({
				width: (1000 + 10),
				height: (1000 + 30),
				left: pos.left, 
				top: pos.top,
				}).slideDown();

	ctx.drawImage(OrigCanvas, 0, 0, OrigCanvas.width, OrigCanvas.height);
}

//draw selection on a canvas
function preview(img2, selection) {
	var canvas = $('#previewCanvas')[0];
	//console.log(selection.width);
	var ctx = canvas.getContext("2d");  
	var maxSize = 200;
	var destX = 0;
	var destY = 0;
	canvas.width =  selection.width;
	canvas.height =  selection.height;
	if(selection.width > 0 || selection.height > 0) {
		ctx.drawImage(img2,
				selection.x1 / (img2.offsetWidth / img.width),
				selection.y1 / (img2.offsetHeight / img.height),
				selection.width / (img2.offsetWidth / img.width),
				selection.height / (img2.offsetHeight / img.height),
				destX,
				destY, 
				selection.width,
				selection.height
				);   
	}         
}

//uploading image function
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		
		reader.onload = function (e) {
			$('#uploadedImage').attr('src', e.target.result);
		}           
		reader.readAsDataURL(input.files[0]); 
	}
}

function allowDrop(ev) {
	ev.preventDefault();
}

function mousedown(ev) {
	startOffsetX = ev.offsetX;
	startOffsetY = ev.offsetY;
}

function dragstart(ev) {

	ev.dataTransfer.setData("Text", ev.target.id);
	draggedElement = ev.target;
}


function drop(ev, canvas = ev.target) {
	ev.preventDefault();
	//var canvas = ev.target;
	switch (canvas.id) {
		case "pic1":
			ElementsFull[0] = true;
			break;
		case "pic2":
			ElementsFull[1] = true;
			break;
		case "pic3":
			ElementsFull[2] = true;
			break;
		case "pic4":
			ElementsFull[3] = true;
			break;
		case "pic5":
			ElementsFull[4] = true;
			break;
	}
	drawCopiedImage(canvas, ev); 
	//loops through multipaste elements and draws image on all of them
	var multiPasteClasses = ["multiPaste1", "multiPaste2", "multiPaste3", "multiPaste4", "multiPaste5"];
	for (var i = 0; i < multiPasteClasses.length; i++) {
	   
		if($(canvas).hasClass(multiPasteClasses[i])){
			$("." + multiPasteClasses[i]).each(function() {
				drawCopiedImage(this, ev);
			});
		}  
	}
}


//draws copied image on the canvas
function drawCopiedImage(canvas, ev){
	ev.preventDefault();
	
	canvas.width = draggedElement.width;
	canvas.height = draggedElement.height;
	//console.log(canvas);
	//console.log(canvas.width, canvas.height);
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(draggedElement);
	//var longestSide = Math.max(draggedElement.width, draggedElement.height);
	if(draggedElement.width >= draggedElement.height){
	  ctx.drawImage(draggedElement, 0, 0, canvas.width, canvas.height * (draggedElement.height / draggedElement.width));
	} else{
	  ctx.drawImage(draggedElement, 0, 0, canvas.width * (draggedElement.width / draggedElement.height), canvas.height);
	}
	//console.log(canvas.width, canvas.height);
}

// loads the image and draws it on the canvas.
function imgChange (inp) {
	
    if (inp.files && inp.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            //var img = document.getElementById("test-picture");
            //img.setAttribute('src', e.target.result);
            var ctx = document.getElementById("uploadedImage").getContext('2d');
			//ctx.globalCompositeOperation = "source-atop";
            img = new Image;
            img.src = URL.createObjectURL(inp.files[0]);
            //console.log(img);
            img.onload = function() {
                window.initCanvas(img);
                ctx.drawImage(img, 0, 0);
            };
        }
        reader.readAsDataURL(inp.files[0]);
		toolFlag = true;
		$("#toolButton").fadeOut();
		$("#content").stop().animate({paddingLeft: 60},
			{step: function() {
				$(window).trigger('resize');
			}
		})
		.promise().done(function() {
			$("#toolBar").slideDown();
		});
		
		
    }
};
// Initializes the canvas and image info
function initCanvas(img) {
    var cvs = document.getElementById("uploadedImage");
    cvs.width = img.width;
    cvs.height = img.height;
    //console.log(img);
	originalImageInfo = {
		width: img.width,
		height: img.height,
		context: cvs.getContext("2d")
	};
	oldImageInfo = {
		width: img.width,
        height: img.height,
        context: cvs.getContext("2d")
	};
    imageInfo = {
        width: img.width,
        height: img.height,
        context: cvs.getContext("2d")
    };
    mask = null;
    
    var tempCtx = document.createElement("canvas").getContext("2d");
    tempCtx.canvas.width = imageInfo.width;
    tempCtx.canvas.height = imageInfo.height;
    tempCtx.drawImage(img, 0, 0);
    imageInfo.data = tempCtx.getImageData(0, 0, imageInfo.width, imageInfo.height);
	oldImageInfo.data = tempCtx.getImageData(0, 0, imageInfo.width, imageInfo.height);
	originalImageInfo.data = tempCtx.getImageData(0, 0, imageInfo.width, imageInfo.height);
	
};
// Gets the current position of the mouse on  the canvas 'UpuloadedImage'
function getMousePosition(e) { // NOTE*: These may need tweeking to work properly

    var p = $(e.target).offset(),
    	widthScale = document.getElementById('uploadedImage').offsetWidth / img.width,
    	heightScale = document.getElementById('uploadedImage').offsetHeight / img.height,
        x = Math.round(((e.clientX || e.pageX) - p.left) / widthScale),
        y = Math.round(((e.pageY) - p.top) / heightScale);
        //console.log(x, y);
        //console.log(e.pageY);
    return { x: x, y: y };
}


function getMousePosition2(e) { // NOTE*: These may need tweeking to work properly

    var p = $(e.target).offset(),
    	widthScale = document.getElementById('ElementCanvas').offsetWidth / img.width,
    	heightScale = document.getElementById('ElementCanvas').offsetHeight / img.height,
        x = Math.round(((e.clientX || e.pageX) - p.left) / widthScale),
        y = Math.round(((e.pageY || e.clientY) - p.top) / heightScale);
        console.log(x, y);
        //console.log(e.pageY);
    return { x: x, y: y };
}


// listener for the mouseDown event. Checks if applicilable mode is in enabled
// and makes the selection

function onMouseDown(e) {
	//console.log(erasing);
	if(wandFlag || colorElimFlag) {
	    if (e.button == 0) {
	        allowDraw = true;
	        downPoint = getMousePosition(e);
	        drawMask(downPoint.x, downPoint.y);
	        //console.log(mask);
	        //console.log(mask.data.length);
	    }
	    else allowDraw = false;
	} else if(erasing) {
		copyImageData();
		allowDraw = true;
		downPoint = getMousePosition(e);
		//ctx = document.getElementById("uploadedImage").getContext("2d");
		ctx = imageInfo.context;
		radius = document.getElementById("eraserSlider").value * (imageInfo.height / 250);
		ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.globalCompositeOperation = "source-atop";
		ctx.closePath();
	} 
}

function editMouseDown(e) {
	if(erasing2) {
		console.log("clicked again");
		copyImageData();
		allowDraw = true;
		downPoint = getMousePosition2(e);
		ctx = document.getElementById("ElementCanvas").getContext("2d");
		//ctx = imageInfo.context;
		//radius = document.getElementById("eraserSlider").value * (imageInfo.height / 250);
		radius = 3;
		ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.globalCompositeOperation = "source-atop";
		ctx.closePath();
	}
}
// listener for the mousecMove event, gets the current mouse position
function onMouseMove(e) {
    if (allowDraw) {
		if(erasing) {
			//ctx = document.getElementById("uploadedImage").getContext("2d");
			ctx = imageInfo.context;
			radius = document.getElementById("eraserSlider").value * (imageInfo.height / 250);
			downPoint = getMousePosition(e);
			ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.globalCompositeOperation = "source-atop";
			imageInfo.context = ctx;
			//ctx.fillRect(downPoint.x,downPoint.y,75,50);
			//console.log("Fill");
		} else {
			
			var p = getMousePosition(e);
			if (p.x != downPoint.x || p.y != downPoint.y) {
				var dx = p.x - downPoint.x,
					dy = p.y - downPoint.y,
					len = Math.sqrt(dx * dx + dy * dy),
					adx = Math.abs(dx),
					ady = Math.abs(dy),
					sign = adx > ady ? dx / adx : dy / ady;
				sign = sign < 0 ? sign / 5 : sign / 3;
				//var thres = Math.min(Math.max(colorThreshold + Math.floor(sign * len), 1), 255);
				//var thres = Math.min(colorThreshold + Math.floor(len / 3), 255);
			}
        }
    }
}

function editMouseMove(e) {
	if(allowDraw) {
		if(erasing2) {
			console.log("moved");
			ctx = document.getElementById("ElementCanvas").getContext("2d");
			//ctx = imageInfo.context;
			//radius = document.getElementById("eraserSlider").value * (imageInfo.height / 250);
			radius = 3;
			downPoint = getMousePosition2(e);
			ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		} 
	}
}

function onMouseUp(e) {
	if(allowDraw) {
		allowDraw = false;
		ctx = imageInfo.context;
		imageInfo.context.globalCompositeOperation = "source-atop";
		//console.log(imageInfo.data.data);
		
		if(erasing) {
			imageInfo.data = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height);
			//var ctx = document.getElementById("uploadedImage").getContext('2d');
			//ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
			//ctx.putImageData(imageInfo.data, 0, 0);
			
		}
		//currentThreshold = colorThreshold;
	}
}


function editMouseUp(e) {
	allowDraw = false;
}


// Finds the pixels and saves it in the mask, then draws a border around the selection

function drawMask(x, y) {
    if (!imageInfo) return;
    
   // showThreshold();
    
    var image = {
        data: imageInfo.data.data,
        width: imageInfo.width,
        height: imageInfo.height,
        bytes: 4
    };
    if(wandFlag) {
    	mask = MagicWand.floodFill(image, x, y, currentThreshold);
	} else if(colorElimFlag) {
    	mask = colorElimination(image, x, y, currentThreshold);
	}
    mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);
    drawBorder();
}

// Function that animates the border around the seleceted pixels
function hatchTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawBorder(true);
}

// Draws a boarder around the selected pixels 
function drawBorder(noBorder) {
    if (!mask) return;
    
    var x,y,i,j,
        w = imageInfo.width,
        h = imageInfo.height,
        ctx = imageInfo.context,
        imgData = ctx.createImageData(w, h);
    imgData.data.set(new Uint8ClampedArray(imageInfo.data.data));
    var res = imgData.data;
    
    if (!noBorder) cacheInd = MagicWand.getBorderIndices(mask);
    
    ctx.clearRect(0, 0, w, h);
    //ctx.drawImage(img, 0, 0);
    var len = cacheInd.length;
    for (j = 0; j < len; j++) {
        i = cacheInd[j];
        x = i % w; // calc x by index
        y = (i - x) / w; // calc y by index
        k = (y * w + x) * 4; 
        if ((x + y + hatchOffset) % (hatchLength * 2) < hatchLength) { // detect hatch color 
            res[k + 3] = 255; // black, change only alpha
        } else {
            res[k] = 255; // white
            res[k + 1] = 255;
            res[k + 2] = 255;
            res[k + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Function crops the selected pixels form the image
function cropOut() {

	if(mask == null) return;
	var tmpMask = mask;
	mask = null;

	setTimeout(function() {
		copyImageData();

		for(i = 0; i < tmpMask.data.length; i++) {
			if(tmpMask.data[i] != 0) {
				var tmp = i * 4;
				imageInfo.data.data[tmp] = 0;
				imageInfo.data.data[tmp + 1] = 0;
				imageInfo.data.data[tmp + 2] = 0;
				imageInfo.data.data[tmp + 3] = 0;
			}
		}
		//mask = null;
		var ctx = document.getElementById("uploadedImage").getContext('2d');
		ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
		ctx.putImageData(imageInfo.data, 0, 0);
	}, 300);
};

// Fucntion finds the selected color (based on a threshold) from the image
function colorElimination(image, x, y, threshold) {
    // used for testing purposes
    /*for(var i = 0, value = 1, size = image.width*image.height,
         array = new Uint8Array(size); i < size; i++) array[i] = value;*/
    var tmp, ipix = (y * image.width * 4) + x * 4,
        pixel = [image.data[ipix], image.data[ipix+1], image.data[ipix+2], image.data[ipix+3]];
    //console.log(x);
    //console.log(y);
    //console.log(ipix);
    //console.log(pixel);
    //console.log(image.data.length);
    //console.log(4 * image.width * image.height);
    for(var i = 0, size = image.width*image.height,
        array = new Uint8Array(size); i < size; i++) {
        
        //ipix = (y * i) + b;
        tmp = image.data[i*4] - pixel[0];
        //console.log(image.data[i*4]);
        //console.log(pixel[0]);
        //console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+1] - pixel[1];
        //console.log(image.data[(i*4)+1]);
        //console.log(pixel[1]);
        //console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+2] - pixel[2];
        //console.log(image.data[(i*4)+2]);
        //console.log(pixel[2]);
        //console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+3] - pixel[3];
        if(tmp > threshold || tmp < -threshold) continue;

        array[i] = 1;
    }
    //console.log('Done');
    return {data: array, width:image.width,height:image.height,bounds:{minX:0,minY:0,maxX:image.width,maxY:image.height}};
};

function eliminateWhite(image, threshold) {
	var tmp;
	//console.log(image);
    for(var i = 0, size = image.width*image.height,
        array = new Uint8Array(size); i < size; i++) {

        tmp = image.data[i*4] - 255;
    	//console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+1] - 255;
        //console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+2] - 255;
		//console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+3] - 255;
        //console.log(tmp);
        if(tmp > threshold || tmp < -threshold) continue;

        array[i] = 1;
    }
    //console.log("done");
    return {data: array, width:image.width,height:image.height,bounds:{minX:0,minY:0,maxX:image.width,maxY:image.height}};
};

// Swaps the old data with the new, "undoing" their last action

function undo() {
	if (imageInfo != null) {
		imageInfo.data.data.set(oldImageInfo.data.data);
	}
};

// Copy the data before making a change in case the user needs to "undo" their action

function copyImageData() {
	oldImageInfo.data =  document.getElementById("uploadedImage").getContext("2d").getImageData(0, 0, imageInfo.width, imageInfo.height);
}

// Copy the data before changing the colours 

function copyColourData() {
	console.log("hey");
	originalImageInfo.data = document.getElementById("uploadedImage").getContext("2d").getImageData(0, 0, imageInfo.width, imageInfo.height);
}

// Filters and colour manipulation

// Color changers

function colorChange() {
	if(colourFlag) {
	
		//copyColourData();
		//copyImageData();
		
		var red = null;
		var green = null;
		var blue = null;
		var alpha = null;
		var redChange = null;
		var greenChange = null;
		var blueChange = null;
		var negRed = false;
		var negBlue = false;
		var negGreen = false;
		
		
		console.log(originalImageInfo.data.data.length);
		for(var i = 0; i < originalImageInfo.data.data.length; i += 4)
		{
			red = originalImageInfo.data.data[i]>>>0;
			green = originalImageInfo.data.data[i + 1]>>>0;
			blue = originalImageInfo.data.data[i + 2]>>>0;
			alpha = originalImageInfo.data.data[i + 3];
			
			if(document.getElementById("redSlider").value < 0) {
				negRed = true;
				redChange = (document.getElementById("redSlider").value * -1)>>>0;
			} else {
				redChange = document.getElementById("redSlider").value>>>0;
			}
			if(document.getElementById("greenSlider").value < 0) {
				negGreen = true;
				greenChange = (document.getElementById("greenSlider").value * -1)>>>0;
			} else {
				greenChange = document.getElementById("greenSlider").value>>>0;
			}
			if(document.getElementById("blueSlider").value < 0) {
				negBlue = true;
				blueChange = (document.getElementById("blueSlider").value * -1)>>>0;
			} else {
				blueChange = document.getElementById("blueSlider").value>>>0;
			}
			
			if(negRed){
				imageInfo.data.data[i] = red - redChange;
			} else if(red + redChange > 255) {
				imageInfo.data.data[i] = 255>>>0;
			} else if(red - redChange < 0) {
				imageInfo.data.data[i] = 0>>>0;
			} else {
				imageInfo.data.data[i] += redChange>>>0;
			}
			
			if(negGreen){
				imageInfo.data.data[i + 1] -= greenChange;
			} else if(green + greenChange > 255) {
				imageInfo.data.data[i + 1] = 255>>>0;
			} else if(green - greenChange < 0) {
				imageInfo.data.data[i + 1] = 0>>>0;			
			} else {
				imageInfo.data.data[i + 1] += greenChange>>>0;
			}
			
			if(negBlue){
				imageInfo.data.data[i + 2] -= blueChange;
			} else if(blue + blueChange > 255) {
				imageInfo.data.data[i + 2] = 255>>>0;
			} else if(blue - blueChange < 0) {
				imageInfo.data.data[i + 2] = 0>>>0;			
			} else {
				imageInfo.data.data[i + 2] += blueChange>>>0;
			}
			negRed = false;
			negGreen = false;
			negBlue = false;
			imageInfo.data.data[i + 3] = alpha; // not changing the transparency
		}
	}
};

// Brightness Hook

function changeBrightness() {
	
};

function greyScale() {
	
	copyImageData();
	
	for(var i = 0; i < imageInfo.data.data.length; i += 4)
	{
        var red = imageInfo.data.data[i];
        var green = imageInfo.data.data[i + 1];
        var blue = imageInfo.data.data[i + 2];
        var alpha = imageInfo.data.data[i + 3];
            
        var gray = (red + green + blue) / 3;
            
        imageInfo.data.data[i] = gray;
        imageInfo.data.data[i + 1] = gray;
        imageInfo.data.data[i + 2] = gray;
        imageInfo.data.data[i + 3] = alpha; // not changing the transparency
	}
	
	
};
