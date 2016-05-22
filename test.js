var toolFlag = false;
var wandFlag = false;
var colorElimFlag = false;
var colourFlag = false;
var tieMessage = true;
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
var Selected;
var shirtLayouts = ["Customize Yourself", "nothing", "nothing", "nothing"];
var scarfLayouts = ["Customize Yourself", "One Image Both Sides", "One Image Across", "One Picture Repeated"];
var tieLayouts = ["Customize Yourself", "One Large Image", "Few Medium Images", "Repeated Small Images"];
var hatLayouts = ["Customize Yourself", "One Image Covering", "One Image Left Side", "Few Images Around Brim"];
var leggingLayouts = ["Customize Yourself", "One Picture Covering", "One Image Left Leg", "Repeated Image All Over"];
$(document).ready(function() {
	var item = 0;
	var item2 = 0;
	// this is the mouse position within the drag element
	var startOffsetX, startOffsetY;
	
	$('[data-toggle="tooltip"]').tooltip();   
	
	var value;
	$(".templateBackground").each(function() {
		if ($(this).is(":visible")) {
			var str = $(this).parent().attr("value");
			value = str.split(" ")[1];
		}
	});
	makeLabels(value);
	
	$("#leftButton").click(function() {
		$('#uploadedImage').imgAreaSelect({remove:true});
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
		$('#uploadedImage').imgAreaSelect({remove:true});
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
		var tmp = document.getElementById('ElementCanvas');
		var ctx = OrigCanvas.getContext('2d');
		ctx.clearRect(0,0, OrigCanvas.width, OrigCanvas.height);
		ctx.drawImage(tmp, 0, 0);
		$("#ElementDisplay").stop().slideUp();
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
		$('#eraserButton').css({"backgroundColor":"black"});
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
		$('#eraserButton').css({"backgroundColor":"black"});
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
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$('#eraserButton').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
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
		colourFlag = false;
		colorElimFlag = false;
		wandFlag = false;
		erasing = false;
		$('#uploadedImage').imgAreaSelect({remove:true});
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool3').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$('#eraserButton').css({"backgroundColor":"black"});
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
		$('#tool3').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool5').css({"backgroundColor":"black"});
		$('#eraserButton').css({"backgroundColor":"black"});
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
		$('#tool1').css({"backgroundColor":"black"});
		$('#tool3').css({"backgroundColor":"black"});
		$('#tool2').css({"backgroundColor":"black"});
		$('#tool4').css({"backgroundColor":"black"});
		$('#tool5').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
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
		$('#editCrop').css({display: 'none'});
		$('#editCrop2').css({display: 'none'});
		$('#thresSlider4').css({display: 'none'});
		$('#thresSlider3').css({display: 'none'});
		$('#eraseSlider').css({display: 'inline'});
		$('#wand').css({"backgroundColor":"black"});
		$('#colorElim').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
	});

	$('#wand').click(function() {
		colourFlag = false;
		colorElimFlag = false;
		wandFlag = true;
		erasing = false;
		erasing2 = false;
		$('#editCrop').css({display: ''});
		$('#thresSlider4').css({display: 'none'});
		$('#editCrop2').css({display: 'none'});
		$('#erase').css({"backgroundColor":"black"});
		$('#colorElim').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
		$('#thresSlider3').css({display: 'inline'});
		$('#eraseSlider').css({display: 'none'});
	});

	$('#colorElim').click(function() {
		colourFlag = false;
		colorElimFlag = true;
		wandFlag = false;
		erasing = false;
		erasing2 = false;
		$('#editCrop2').css({display: ''});
		$('#thresSlider3').css({display: 'none'});
		$('#editCrop').css({display: 'none'});
		$('#wand').css({"backgroundColor":"black"});
		$('#erase').css({"backgroundColor":"black"});
		$(this).css({"backgroundColor":"#444444"});
		$('#thresSlider4').css({display: 'inline'});
		$('#eraseSlider').css({display: 'none'});
	});

	$('#editCrop').click(function() {
		cropOut2();
	});
	$('#editCrop2').click(function() {
		cropOut2();
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


    $(".previewBut").click(function(){
    	$( "#finalPreviewDiv" ).dialog();
		var layout;
    	var ElementsDiv = $(this).parent().find(".templateBackground")[0];
		$(ElementsDiv).children(".layouts").each(function() {
			if ($(this).is(":visible")) {
				layout = this;
			}
		});
    	previewClothing(ElementsDiv, layout);
    });

    $("#fontStyleButtons").change(function(){
    	updateFont();  
    }); 

    //switch between templates
    $('.templateButtons, .buttonDiv').click(function(evt){
		evt.stopPropagation();
		if ($(this).attr('class') == 'buttonDiv') {
			
			var child = $(this).children()[0];
			$( ".templateDiv" ).each(function() {
				$(this).css('display', 'none');
			});
			var currentTemplate =  $(child).attr("value");
			$("#templateTitle").text($("#" + currentTemplate).attr("value"));
			$('#' + currentTemplate ).css('display', 'block');
			$(".clothESpot").each(function(){
				fitSize(this);
			});
			if(tieMessage == true && currentTemplate == "template3"){
				//alert("Tie's cannot have white!");
				popup('popUpDiv');
				tieMessage = !tieMessage;
			}
		} else {	
			$( ".templateDiv" ).each(function() {
				$( this ).css('display', 'none');
			});
			var currentTemplate =  $(this).attr("value");
			$("#templateTitle").text($("#" + currentTemplate).attr("value"));
			$('#' + currentTemplate ).css('display', 'block');
			$(".clothESpot").each(function(){
				fitSize(this);
			});
			if(tieMessage == true && currentTemplate == "template3"){
				//alert("Tie's cannot have white!");
				popup('popUpDiv');
				tieMessage = !tieMessage;
			}
		}
    });
	
	$(".buttonDiv").mouseenter(function() {
		var value = $(this).attr("value");
		$(".layouts").each(function() {
			$(this).hide();
			$(".clothESpot").each(function(){
				fitSize(this);
			});

		});
		$(".templateDiv").each(function() {
			$(this).hide();
			$(".clothESpot").each(function(){
				fitSize(this);
			});
		});
		var child = $(this).children()[0];
		var currentTemplate =  $(child).attr("value");
		$("#templateTitle").text($("#" + currentTemplate).attr("value"));
		$("#" + value + "layoutPreview").show();
		$("#" + value + "layoutPreview").closest(".templateDiv").show();
		makeLabels(value);
	});
	
	$("#layoutsMenu")
		.mouseenter(function() {
			$(".LayoutNames").stop().slideDown();
		})
		.mouseleave(function() {
			$(".LayoutNames").stop().slideUp();
	});
	
	$(".LayoutNames")
		.click(function() {
			var value = $(this).attr("value");
			$(".layouts").each(function() {
				$(this).hide();
			});
			$("#" + value).show();
			$(".LayoutNames").slideUp();
		})
		.mouseenter(function() {
			var value = $(this).attr("value");
			$(".layouts").each(function() {
				$(this).hide();
			});
			$("#" + value).show();
	});
	
	$('.buttonDiv:odd, .LayoutNames:odd')
	.mouseenter(function() {
		$(this).css({"backgroundColor":"#444444"})
	})
	.mouseleave(function() {
		$(this).css({"backgroundColor":"#888888"})
	});
	
	$('.buttonDiv:even, .LayoutNames:even')
	.mouseenter(function() {
		$(this).css({"backgroundColor":"#444444"})
	})
	.mouseleave(function() {
		$(this).css({"backgroundColor":"#555555"})
	});
	
	$(".dropdown, .dropdown-content").mouseenter(function() {
		$('.dropdown-content').stop().slideDown();
	});
	
	$('.dropdown, .dropdown-content').click(function() {
		$('.dropdown-content').stop().slideUp();
	});
	
	$('.dropdown').mouseleave(function() {
		$('.dropdown-content').stop().slideUp();
	});
    
    $(".closeButton").click(function(){
    });
	
	$(".colorSelection").click(function(evt) {
		$(this).stop().animate({
			'width': '125px',
			'height': '270px'
		}, 200);
		$("#colorTable").show();
		$(".colorSwatch").each(function() {
			$( this ).css('display', 'block');
		});
		$("#ExitButton2").show();
		$(this).css("cursor", "auto");
	});
    
	$("#ExitButton2").click(function(evt) {
		evt.stopPropagation();
		$(this).hide();
		$(".colorSelection").stop().animate({
			'width': '60px',
			'height': '40px'
		}, 200);
		$("#colorTable").hide();
		$(".colorSwatch").each(function() {
			$( this ).css('display', 'none');
		});
		$(".colorSelection").css("cursor", "pointer");
	});
	
	$(".colorSwatch")
		.hover(function() {
			$(this).css("box-shadow", "2px 1px 8px black");
		}, function() {
			if (this == Selected) {
				$(this).css("box-shadow", "2px 1px 8px black");
			} else {
				$(this).css("box-shadow", "none");
			}
			
		})
		.click(function(evt) {
			evt.stopPropagation();
			Selected = this;
			$(".colorSwatch").each(function() {
				$(this).css("box-shadow", "none");
			});
			$(this).css("box-shadow", "2px 1px 8px black");
			var color = $(this).css("backgroundColor");
			$(".templateDiv").css("backgroundColor", color);
		});
}); //document.ready function closing tag

//create elements dynamically
    function freeDrop(ev) {
    	ev.preventDefault();
		
    	var newElement = $(
    		'<div class="draggable resizable wrapper dynamicElement">\
    			<canvas class="clothESpot dragDest"></canvas>\
    			<img src="img/close_icon.png" class="closeButton"/>\
    		</div>');


    	
    	// checks if there isn't already another element in the drop position
    	if(!$(ev.target).hasClass("clothESpot")){
    		$(ev.target).append(newElement);

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

  			$(".closeButton").click(function(){
    			$(this).parent().remove();
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
  $(canvas).parent().data("used", true);
  fitSize(canvas)
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

function makeLabels(value) {
	var i = 0;
	var item = value;
	switch(value) {
		case "Shirt":
			item = "Shirts";
		case "Shirts":
			$(".LayoutNames").each(function() {
				$(this).attr("value", item + "layout" + i);
				$(this).text(shirtLayouts[i]);
				i++;
			});
			break;
		case "Scarf":
			item = "Scarves";
		case "Scarves":
			$(".LayoutNames").each(function() {
				$(this).attr("value", item + "layout" + i);
				$(this).text(scarfLayouts[i]);
				i++;
			});
			break;
		case "Tie":
			item = "Ties";
		case "Ties":
			$(".LayoutNames").each(function() {
				$(this).attr("value", item + "layout" + i);
				$(this).text(tieLayouts[i]);
				i++;
			});
			break;
		case "Hat":
			item = "Hats";
		case "Hats":
			$(".LayoutNames").each(function() {
				$(this).attr("value", item + "layout" + i);
				$(this).text(hatLayouts[i]);
				i++;
			});
			break;
		case "Legging":
			item = "Leggings";
		case "Leggings":
			$(".LayoutNames").each(function() {
				$(this).attr("value", item + "layout" + i);
				$(this).text(leggingLayouts[i]);
				i++;
			});
			break;
		default:
			$(".LayoutNames").each(function() {
				$(this).attr("value","layout" + i);
				$(this).text('');
				i++;
			});
			break;
	}
	
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
    EditInfo = null;
    cacheInd = null;
    mask = null;
    editMask = null;
    downPoint = null;
    img = null;
	currentCanvas = null;
    allowDraw = false;
    OrigCanvas = null;
	/*
	brightnessSlider = document.getElementById("brightnessSlider");
	
	brightnessSlider.addEventListener("change", greyScale());
	*/
    slider = document.getElementById("thresSlider");

    slider.addEventListener("change", function() {
    	currentThreshold = slider2.value = slider3.value = slider4.value = slider.value;
    	//showThreshold();
    });

    slider2 = document.getElementById("thresSlider2");
	
    slider2.addEventListener("change", function() {
    	currentThreshold = slider.value = slider3.value = slider4.value = slider2.value;
    	//showThreshold();
    });
	
	slider3 = document.getElementById("thresSlider3");
	
    slider3.addEventListener("change", function() {
    	currentThreshold = slider.value = slider2.value = slider4.value = slider3.value;
    	//showThreshold();
    });

    slider4 = document.getElementById("thresSlider4");
	
    slider4.addEventListener("change", function() {
    	currentThreshold = slider.value = slider2.value = slider3.value = slider4.value;
    	//showThreshold();
    });

    colorThreshold = slider.value = slider2.value = slider3.value = slider4.value = 50;
    currentThreshold = colorThreshold;
    //showThreshold();
    setInterval(function () { hatchTick(); }, 300);
	
	var red = document.getElementById("redSlider");
	var green = document.getElementById("greenSlider");
	var blue = document.getElementById("blueSlider");
	
	red.value = blue.value = green.value = 0;
	
	
}

// Onclick event for the window. allows user to deselect when clicking off the canvas
window.onclick = function(e) {
	if(e.target.id != "uploadedImage" && e.target.id != "ElementCanvas") {
		mask = null;
		mask2 = null;	
		var ctx = document.getElementById("uploadedImage").getContext('2d');
		if(imageInfo != null) {
			ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
			ctx.putImageData(imageInfo.data, 0, 0);
		}
		var ctx2 = document.getElementById("ElementCanvas").getContext('2d');
		if(EditInfo != null) {
			ctx2.clearRect(0, 0, EditInfo.width, EditInfo.height);
			ctx2.putImageData(EditInfo.data, 0, 0);
		}
	}
};

// Opens an Edit window for croped elements
function ShowEditCanvas(element) {
	var scaleSize = 4;
	OrigCanvas = document.getElementById($(element).children()[0].id);
	var canvas = document.getElementById("ElementCanvas");
	var ctx = canvas.getContext('2d');
	var pos = $(element).offset();
	var width = OrigCanvas.width;
	var height = OrigCanvas.height;
	canvas.width = width;
	canvas.height = height;
	var elmWidth = width, elmHeight = height;
	if(elmWidth != 300) {
		elmWidth = 300;
	} 
	if(elmHeight > 300) {
		elmHeight = 300;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('#uploadedImage').imgAreaSelect({remove:true});
	$("#ElementCanvas").css({"max-width": "100%" ,
					"max-height":300 });
	$("#ElementDisplay").stop().animate({
				width: elmWidth + 150,
				height: elmHeight + 85,
				left: pos.left - elmWidth - 150, 
				top: pos.top,
				}).slideDown();

	ctx.drawImage(OrigCanvas, 0, 0, OrigCanvas.width, OrigCanvas.height);

	EditInfo = {
        width: OrigCanvas.width,
        height: OrigCanvas.height,
        context: ctx
    };
    EditInfo.data = ctx.getImageData(0, 0, EditInfo.width, EditInfo.height);
    mask2 = null;
    setInterval(function() { editTick(); }, 300);
    //console.log(EditInfo);
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
	//console.log(ev.target);
	//console.log(draggedElement);
	//console.log(draggedElement.id);
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

	if($(canvas).hasClass('tileDropCanvas')){
		//console.log("tiles be dropping yo");
			tileImage(draggedElement, $(".tileCanvas")[0]);
		}

	//loops through multipaste elements and draws image on all of them
	var multiPasteClasses = ["multiPaste1", "multiPaste2", "multiPaste3", "multiPaste4", "multiPaste5", "signatureCanvas"];
	for (var i = 0; i < multiPasteClasses.length; i++) {
	   
		if($(canvas).hasClass(multiPasteClasses[i])){
			$("." + multiPasteClasses[i]).each(function() {
				drawCopiedImage(this, ev);
			});
		}  
	}
}

//collapse canvas and create preview
function previewClothing(template, curLayout, previewCanvas = $("#clothingPreviewCanvas")[0]){
	template = $(template);
	var templateValue = template.parent().attr("value");
	var backgroundImage = template.parent().find(".previewBackground")[0];
	previewCanvas.width = backgroundImage.naturalWidth;
	previewCanvas.height = backgroundImage.naturalHeight;
	var ctx = previewCanvas.getContext("2d");
	ctx.fillStyle = template.parent().css('background-color');
	ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
	
	var leftOffset, topOffset, width, height;
	var leftOffsetRatio;
	$(curLayout).find(".wrapper").each(function(){
		leftOffsetRatio = $(this).position().left / template.width();

		if(templateValue == 'Customized Scarf'){
			leftOffset = leftOffsetRatio * 1.2;
			topOffset = $(this).position().top / template.height() * 1.2 - .25;
			width = $(this).width() * 1.1 * previewCanvas.width / template.width();
			height = $(this).height() * 1.1 * previewCanvas.width / template.width();
			ctx.globalAlpha = 1;
		}else if(templateValue == 'Customized Tie'){
			leftOffset = leftOffsetRatio * .8 + .25;
			topOffset = $(this).position().top / template.height() * .8 + .2;
			width = $(this).width() * .9 * previewCanvas.width / template.width();
			height = $(this).height() * .9 * previewCanvas.width / template.width();
			ctx.globalAlpha = .9;
		}else if(templateValue == 'Customized Hat'){
			leftOffset = leftOffsetRatio * 2 - .8;
			topOffset = $(this).position().top / template.height() - .4;
			width = $(this).width() * 2 * previewCanvas.width / template.width();
			height = $(this).height() * 2 * previewCanvas.width / template.width();
			ctx.globalAlpha = 0.9;
		}else if(templateValue == 'Customized Leggings'){
			if(leftOffsetRatio < .5){
				leftOffset = leftOffsetRatio * 1 -.057;
			} else{
				leftOffset = leftOffsetRatio * 1 -.15;
			}
			
			topOffset = $(this).position().top / template.height() * 1 + 0;
			width = $(this).width() * 1 * previewCanvas.height / template.height();
			height = $(this).height() * 1 * previewCanvas.height / template.height();
			ctx.globalAlpha = .9;
		}

    	if(getRotationDegrees($(this)) != 0){
    		ctx.save();
    		ctx.translate(leftOffset * $(previewCanvas).width(), topOffset * $(previewCanvas).height());
    		ctx.translate(width / 2, height / 2);
    		ctx.rotate(getRotationDegrees($(this)) * Math.PI/180);
    		//ctx.drawImage($(this).find("canvas")[0], -width / 2, -height / 2, width, height);
			ctx.drawImage($(this).find("canvas")[0], -(width/2), -(height/2), width, height);
			ctx.restore();
    	} else{
    		ctx.drawImage($(this).find("canvas")[0], leftOffset * $(previewCanvas).width(), topOffset * $(previewCanvas).height(), width, height);
    	}
	});
	ctx.globalAlpha = 1;
	ctx.drawImage(backgroundImage, 0, 0, previewCanvas.width, previewCanvas.height);
}

//gets the element rotation in degrees
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }

    if(angle < 0) angle +=360;
    return angle;
}

function fitSize(content, wrap = $(content).parent()){
	//sets default element size, if it hasn't already been set
	if (typeof $(wrap).data('defaultWidthRatio') == 'undefined')
	{
		if($(wrap).parent().width() == 0){
			$(wrap).data("defaultWidthRatio", parseFloat($(wrap).css("width")) / 100.0);
			$(wrap).data("defaultHeightRatio", parseFloat($(wrap).css("height")) / 100.0);
		} else{
			$(wrap).data("defaultWidthRatio", $(wrap).width() / $(wrap).parent().width());
			$(wrap).data("defaultHeightRatio", $(wrap).height() / $(wrap).parent().height());
		}
	}

	//return if no image has been dropped into the element yet
 	if($(wrap).data("used") !== true){
 		return;
 	}

 	//resize the wrapping div to fit the canvas aspect ratio
 	var scale;
 	if(content.width > content.height){
 		scale = ($(wrap).data("defaultWidthRatio") *  $(wrap).parent().width()) / content.width;
 	}else{
 		scale = ($(wrap).data("defaultHeightRatio") *  $(wrap).parent().height()) / content.height;
 	}
 	$(wrap).css('width', (content.width * scale) / ($(wrap).parent().width() / 100) + '%');
 	$(wrap).css('height', (content.height * scale) / ($(wrap).parent().height() / 100)+ '%');

 	$(wrap).css('background', 'transparent');
}

//draw tiled image
function tileImage(sourceImage, destCanvas){
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = 100;
	tempCanvas.height = 100;
	destCanvas.width = 1000; //width of tiled canvas
	destCanvas.height = ($(destCanvas).parent().height() / $(destCanvas).parent().width()) * destCanvas.width
	console.log(destCanvas.width, destCanvas.height);

    tCtx = tempCanvas.getContext("2d");
    tCtx.drawImage(sourceImage, 0 , 0, tempCanvas.width, tempCanvas.height)

	var ctx=destCanvas.getContext("2d");
	var pat=ctx.createPattern(tempCanvas,"repeat");
	ctx.rect(0,0,destCanvas.width, destCanvas.height);
	ctx.fillStyle=pat;
	ctx.fill();
}

//draws copied image on the canvas
function drawCopiedImage(canvas, ev){
	ev.preventDefault();
	
	//If the target and source are the same canvas, do nothing
	if(canvas.id == draggedElement.id) {
		return;
	}
	$(canvas).parent().data("used", true);
	fitSize(draggedElement, $(canvas).parent());
	canvas.width = draggedElement.width;
	canvas.height = draggedElement.height;
	var ctx = canvas.getContext("2d");
	if($(canvas).hasClass("tieClass")) {
		var tmp = draggedElement.getContext('2d');
		var data = tmp.getImageData(0,0,draggedElement.width,draggedElement.height);
		var image = {
	        data: data.data,
	        width: draggedElement.width,
	        height: draggedElement.height,
	        bytes: 4
	    };
	    //console.log(image.data.data);
		var mask = eliminateWhite(image, 64);
		//console.log(mask.data);
		cropOut3(mask, data, ctx);
		//console.log("done Tie class");
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(draggedElement, 0, 0, canvas.width, canvas.height);
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
		var red = document.getElementById("redSlider");
		var green = document.getElementById("greenSlider");
		var blue = document.getElementById("blueSlider");
		
		red.value = blue.value = green.value = 0;
		
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
    	widthScale = document.getElementById('ElementCanvas').offsetWidth / document.getElementById('ElementCanvas').width,
    	heightScale = document.getElementById('ElementCanvas').offsetHeight / document.getElementById('ElementCanvas').height,
        x = Math.round(((e.clientX || e.pageX) - p.left) / widthScale),
        y = Math.round(((e.pageY || e.clientY) - p.top) / heightScale);
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
		copyImageData();
		allowDraw = true;
		downPoint = getMousePosition2(e);
		ctx = document.getElementById("ElementCanvas").getContext("2d");
		//ctx = imageInfo.context;
		//radius = document.getElementById("eraserSlider").value * (imageInfo.height / 250);
		radius = document.getElementById("eraseSlider").value;;
		ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = "red";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.globalCompositeOperation = "source-atop";
		ctx.closePath();
	} else if(wandFlag || colorElimFlag) {
	    if (e.button == 0) {
	        allowDraw = true;
	        downPoint = getMousePosition2(e);
	        drawEditMask(downPoint.x, downPoint.y);
	        //console.log(mask);
	        //console.log(mask.data.length);
	    }
	    else allowDraw = false;
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

	if(erasing2) {
		var ctx2 = document.getElementById("ElementCanvas").getContext("2d");
		EditInfo.data = ctx2.getImageData(0, 0, EditInfo.width, EditInfo.height);
	}
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

function drawEditMask(x, y) {
    if (!EditInfo) return;
    
   // showThreshold();
    //console.log("EditMask");
    var image = {
        data: EditInfo.data.data,
        width: EditInfo.width,
        height: EditInfo.height,
        bytes: 4
    };
    if(wandFlag) {
    	mask2 = MagicWand.floodFill(image, x, y, currentThreshold);
	} else if(colorElimFlag) {
    	mask2 = colorElimination(image, x, y, currentThreshold);
	}
    mask2 = MagicWand.gaussBlurOnlyBorder(mask2, blurRadius);
    drawEditBorder();
}

// Function that animates the border around the seleceted pixels
function hatchTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawBorder(true);
}

function editTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawEditBorder(true);
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

function drawEditBorder(noBorder) {
    if (!mask2) return;
    
    var x,y,i,j,
        w = EditInfo.width,
        h = EditInfo.height,
        ctx = EditInfo.context,
        imgData = ctx.createImageData(w, h);
    imgData.data.set(new Uint8ClampedArray(EditInfo.data.data));
    var res = imgData.data;
    
    if (!noBorder) cacheInd = MagicWand.getBorderIndices(mask2);
    
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

function cropOut3(mask, image, ctx) {
	//console.log(mask);
	if(mask == null) return;
	var tmpMask = mask;
	mask = null;

		for(i = 0; i < tmpMask.data.length; i++) {
			if(tmpMask.data[i] != 0) {
				var tmp = i * 4;
				image.data[tmp] = 0;
				image.data[tmp + 1] = 0;
				image.data[tmp + 2] = 0;
				image.data[tmp + 3] = 0;
			}
		}
		//mask = null;
		//var ctx = document.getElementById("uploadedImage").getContext('2d');
		ctx.clearRect(0, 0, image.width, image.height);
		ctx.putImageData(image, 0, 0);
};

function cropOut2() {

	if(mask2 == null) return;
	var tmpMask = mask2;
	mask2 = null;

	//setTimeout(function() {
	//	copyImageData();

		for(i = 0; i < tmpMask.data.length; i++) {
			if(tmpMask.data[i] != 0) {
				var tmp = i * 4;
				EditInfo.data.data[tmp] = 0;
				EditInfo.data.data[tmp + 1] = 0;
				EditInfo.data.data[tmp + 2] = 0;
				EditInfo.data.data[tmp + 3] = 0;
			}
		}
		//mask = null;
		var ctx = document.getElementById("ElementCanvas").getContext('2d');
		ctx.clearRect(0, 0, EditInfo.width, EditInfo.height);
		ctx.putImageData(EditInfo.data, 0, 0);
	//}, 300);
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
	//console.log(image.data);
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
		
		
		//console.log(originalImageInfo.data.data.length);
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
