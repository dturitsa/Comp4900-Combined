var toolFlag = false;
var wandFlag = false;
var colorElimFlag = false;
var colourFlag = false;
var leftPercent = 0.5;
var rightPercent = 0.5;
var dragOrclick = true;
var draggedElement;
var font;
var brightness = 0;
var erasing = false;
var ElementsFull = [false, false, false, false, false];
var whichElement;
var font;
$(document).ready(function() {
	var item = 0;
	var item2 = 0;
	// this is the mouse position within the drag element
	var startOffsetX, startOffsetY;
	
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
		$('#tool2, #tool1').css({"backgroundColor":"black"});
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
					whichElement = this;
					ShowEditCanvas(whichElement);
				}
				break;
			case "Element2":
				if (ElementsFull[1]) {
					whichElement = this;
					ShowEditCanvas(whichElement);
				}
				break;
			case "Element3":
				if (ElementsFull[2]) {
					whichElement = this;
					ShowEditCanvas(whichElement);
				}
				break;
			case "Element4":
				if (ElementsFull[3]) {
					whichElement = this;
					ShowEditCanvas(whichElement);
				}
				break;
			case "Element5":
				if (ElementsFull[4]) {
					whichElement = this;
					ShowEditCanvas(whichElement);
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
		$('#cropOut').css({display: 'none'});
		$('#thresSlider').css({display: 'none'});
		$('#cropOut2').css({display: 'none'});
		$('#thresSlider2').css({display: 'none'});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool1').css({"backgroundColor":"black"});
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
		$('#cropOut').css({display: ''});
		$('#thresSlider').css({display: ''});
		$('#cropOut2').css({display: 'none'});
		$('#thresSlider2').css({display: 'none'});
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
		$('#uploadedImage').imgAreaSelect({remove:true});
		$("#previewCanvas").attr("draggable", "false");
		$('#cropOut').css({display: 'none'});
		$('#thresSlider').css({display: 'none'});
		$('#cropOut2').css({display: 'none'});
		$('#thresSlider2').css({display: 'none'});
		$('#brightLabel').css({display: ''});
		$('#brightnessSlider').css({display: ''});
		$('#greyScaleLabel').css({display: ''});
		$('#greyScaleButton').css({display: ''});
		$('#eraserSlider').css({display: 'none'});
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
		$('#cropOut').css({display: 'none'});
		$('#thresSlider').css({display: 'none'});
		$('#cropOut2').css({display: ''});
		$('#thresSlider2').css({display: ''});
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

	$(".dragSource").each(function() {
		this.onmousedown = mousedown;
		this.ondragstart = dragstart;
	});
	  
	$(".dragDest").each(function() {
		this.ondrop = drop;
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
		$("#templateTitle").text($("#" + currentTemplate).attr("value"));
		$('#' + currentTemplate ).css('display', 'block');
    });
	
	$("#shirtButton").hover(function() {
		$('.dropdown-content').slideDown();
	});
	
	$('.dropdown-content').click(function() {
		$(this).slideUp();
	});

	// allow dropping into background div (for dynamically creating elements)
     $("#template1Background").on("dragover", function(ev){
     	 ev.preventDefault();

     });

     //create element dynamically
    $("#template1Background").on("drop", function(ev) {
    	ev.preventDefault();
		
    	var newElement = $(
    		'<div class="draggable resizable clothESpot1wrap">\
    			<canvas class="clothESpot dragDest"></canvas>\
    		</div>');

    	
    	// checks if there isn't already another element in the drop position
    	if(!$(ev.target).hasClass("clothESpot")){
    		$(this).append(newElement);
    		var xPos = event.pageX - $(ev.target).offset().left - newElement.width() / 2;
    		var yPos = event.pageY - $(ev.target).offset().top - newElement.width() / 2;
    		newElement.css("left", xPos / ($(this).width() / 100)+"%");
   			newElement.css("top", yPos / ($(this).height() / 100)+"%");

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
    });
    
    
}); //document.ready function closing tag

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
    console.log(fontSize);
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

//uploading image function
function ShowEditCanvas(element) {
	var scaleSize = 4;
	var OrigCanvas = document.getElementById($(element).children()[0].id);
	var canvas = document.getElementById("ElementCanvas");
	var ctx = canvas.getContext('2d');
	var pos = $(element).offset();
	var width = $("#" + OrigCanvas.id).width();
	var height = $("#" + OrigCanvas.id).height();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('#uploadedImage').imgAreaSelect({remove:true});
	$("#ElementCanvas").css({"width":width * scaleSize,
					"height":height * scaleSize});
	$("#ElementDisplay").stop().animate({
				width: (width + 10) * scaleSize,
				height: (height + 30) * scaleSize,
				left: pos.left - (width + 10) * scaleSize, 
				top: pos.top,
				}).slideDown();
	ctx.drawImage(OrigCanvas, 0, 0, canvas.width, canvas.height);
	
	
	
}

//draw selection on a canvas
function preview(img2, selection) {
	var canvas = $('#previewCanvas')[0];
	var selectionSource = $('#uploadedImage')[0];
	var ctx = canvas.getContext("2d");  
	var maxSize = 200;
	var destX = 0;
	var destY = 0;
	var longestSide = Math.max(selection.width, selection.height);
	var scale = maxSize / longestSide;
	canvas.width =  selection.width * scale;
	canvas.height =  selection.height * scale;
	ctx.drawImage(img2,
			selection.x1 / (img2.offsetWidth / img.width),
			selection.y1 / (img2.offsetHeight / img.height),
			selection.width / (img2.offsetWidth / img.width),
			selection.height / (img2.offsetHeight / img.height),
			destX,
			destY, 
			selection.width * scale,
			selection.height * scale
			);               
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
	canvas.width = draggedElement.width;
	canvas.height = draggedElement.height;
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var longestSide = Math.max(draggedElement.width, draggedElement.height);
	console.log(canvas);
	if(draggedElement.width >= draggedElement.height){
	  ctx.drawImage(draggedElement, 0, 0, canvas.width, canvas.height * (draggedElement.height / draggedElement.width));
	} else{
	  ctx.drawImage(draggedElement, 0, 0, canvas.width * (draggedElement.width / draggedElement.height), canvas.height);
	}
}

// loads the image and draws it on the canvas.
function imgChange (inp) {
	
    if (inp.files && inp.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            //var img = document.getElementById("test-picture");
            //img.setAttribute('src', e.target.result);
            var ctx = document.getElementById("uploadedImage").getContext('2d');
            img = new Image;
            img.src = URL.createObjectURL(inp.files[0]);
            //console.log(img);
            img.onload = function() {
                window.initCanvas(img);
                ctx.drawImage(img, 0, 0);
            };
        }
        reader.readAsDataURL(inp.files[0]);
		
    }
};
// Initializes the canvas and image info
function initCanvas(img) {
    var cvs = document.getElementById("uploadedImage");
    cvs.width = img.width;
    cvs.height = img.height;
    //console.log(img);
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
	
};

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

function onMouseDown(e) {
	//console.log('Test');
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
		allowDraw = true;
		downPoint = getMousePosition(e);
		//ctx = document.getElementById("uploadedImage").getContext("2d");
		ctx = imageInfo.context;
		radius = document.getElementById("eraserSlider").value;
		ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.globalCompositeOperation = "source-atop";
		ctx.closePath();
		
		//console.log("Click");
		
		//imageInfo.data.putImageData(cData, 0, 0);
	}
}

function onMouseMove(e) {
    if (allowDraw) {
		if(erasing) {
			//ctx = document.getElementById("uploadedImage").getContext("2d");
			ctx = imageInfo.context;
			radius = document.getElementById("eraserSlider").value;
			downPoint = getMousePosition(e);
			ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
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

function onMouseUp(e) {
    allowDraw = false;
	ctx = imageInfo.context;
	imageInfo.context.globalCompositeOperation = "source-atop";
	//console.log(imageInfo.data.data);
	imageInfo.data = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height);
	if(erasing) {
		//var ctx = document.getElementById("uploadedImage").getContext('2d');
		//ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
		//ctx.putImageData(imageInfo.data, 0, 0);
		
	}
    //currentThreshold = colorThreshold;
}

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

function hatchTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawBorder(true);
}

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

function colorElimination(image, x, y, threshold)
{
    // used for testing purposes
    /*for(var i = 0, value = 1, size = image.width*image.height,
         array = new Uint8Array(size); i < size; i++) array[i] = value;*/
    var tmp, f, ipix = (y * image.width * 4) + x * 4,
        pixel = [image.data[ipix], image.data[ipix+1], image.data[ipix+2], image.data[ipix+3]],
        b = image.bytes;
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

// Swaps the old data with the new, "undoing" their last action

function undo() {
	imageInfo.data.data.set(oldImageInfo.data.data);
};

// Copy the data before making a change in case the user needs to "undo" their action

function copyImageData() {
	oldImageInfo.data =  document.getElementById("uploadedImage").getContext("2d").getImageData(0, 0, imageInfo.width, imageInfo.height);
}

// Filters and colour manipulation

// Brightness Hook

function changeBrightness() {
	
};

function greyScale() {
	
	//imageInfo = imageInfo.context.getImageData(0, 0, image.width, image.height);
	//oldImageInfo = imageInfo;
	copyImageData();
	console.log(imageInfo.data.data.length);
	
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
	
	//ctx = document.getElementById("uploadedImage").getContext('2d');
	//ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
	//ctx.putImageData(dataArray, 0, 0);
	
	//console.log("Grey");
	
};

// Eraser tool

function erase() {
	
	
};