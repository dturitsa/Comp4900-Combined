var toolFlag = false; // Crop tools flag for main canvas
var wandFlag = false; // Magic wand tools flag for main canvas
var colorElimFlag = false; // Color selection flag for main canvas
var colourFlag = false; // RGB maniplation flag for main canvas
var tieMessage = true; // Flag that enbales the Reqiurments for the tie template
var leftPercent = 0.5;
var rightPercent = 0.5;
var dragOrclick = true;
var draggedElement; // global that holds the element that is being draggedd
var allowDraw;
var font;
var brightness = 0;
var erasing = false; // Flag that allows erasing on the main canvas
var erasing2 = false; // Flag that allows erasing on the Edit popup window canvas
var ElementsFull = [false, false, false, false, false];
var whichElement;
var font;
var Selected;
var shirtLayouts = ["Customize Your Own", "nothing", "nothing", "nothing"];
var scarfLayouts = ["Customize Your Own", "One Image Both Sides", "One Image Across", "One Picture Repeated"];
var tieLayouts = ["Customize Your Own", "One Large Image", "Few Medium Images", "Repeated Small Images"];
var hatLayouts = ["Customize Your Own", "One Picture Covering", "One Image Left Side", "Few Images Around Brim"];
var leggingLayouts = ["Customize Your Own", "One Picture Covering", "One Image Left Leg", "Repeated Image All Over"];

// JQuery Style onload initialization function
$(document).ready(function() {
	var item = 0;
	var item2 = 0;
	// this is the mouse position within the drag element
	var startOffsetX, startOffsetY;
	
	$('[data-toggle="tooltip"]').tooltip();   
	
	var value;
	// Fills layouts of shown template
	$(".templateBackground").each(function() {
		if ($(this).is(":visible")) {
			var str = $(this).parent().attr("value");
			value = str.split(" ")[1];
		}
	});
	makeLabels(value);
	
	// Listener for the button that expands the left side of the
	// document and shrinks the right side
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
	
	// Listener for the button that expand the right side of the
	// document and shrinks the left side
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
	
	// Listener for the button on the Edit popup that closes the Edit popup
	$("#ExitButton").click(function() {
		var tmp = document.getElementById('ElementCanvas');
		var ctx = OrigCanvas.getContext('2d');
		ctx.clearRect(0,0, OrigCanvas.width, OrigCanvas.height);
		ctx.drawImage(tmp, 0, 0);
		$("#ElementDisplay").stop().slideUp();
		whichElement = null;
	});
	
	// Listener for toolbar button for the main canvas, show the toolbar when clicked
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
	
	// Listener for the hide button on the toolbar for the main canvas
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
	
	// hover listener for the element boxes in the center column
	$(".Elements").hover(function() {
			$(this.id).css({borderColor:"#0000ff"});
		}, function() {
			$(this.id).css({borderColor:"#000000"});
	});
	
	// onClick listener for the element boxes
	// Shows the Edit popup for the clicked element
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
	
	// Listener for the crop button on the main canvas's toolbar
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
	
	// Listener for the magic wand tool on the main canvas's toolbar
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
	
	// Listeners for the RGB color maninpuation for the main canvas
	// Displays the RGB sliders as well as the convert to Greyscale button
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

	// Listener for the white elimnation tool on the main 
	// canvas's toolbar
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
	
	// listener for the cut button for the magic wand on the 
	// main canvas's toolbar
	$("#cropOut").click(function() {
		cropOut();

	});
	// listener for the cut button for the color selector on the 
	// main canvas's toolbar
	$("#cropOut2").click(function() {
		cropOut();
		
	});
	// Listener for the color selector on the main canvas's toolbar
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
	// Listener for the undo button on the main canvas's
	// toolbar
	$('#undoButton').click(function() {
		undo();
	});
	
	// Listener for the converting to greyscale button on the
	// main canvas's toolbar
	$('#greyScaleButton').click(function() {
		greyScale();
	});
	
	// Listener for the erase button on the main canva's
	// toolbar
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
	
	// Listener for the erase button on the Edit popup
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
		$('#wand').css({"backgroundColor":"black","bottom": "0px"});
		$('#color').css({"backgroundColor":"black","bottom": "0px"});
		$('#colorElim').css({"backgroundColor":"black","bottom": "0px"});
		$(this).css({"backgroundColor":"#444444", "bottom": "0px"});
		$('#editRedSlider').css({display: 'none'});
		$('#editGreenSlider').css({display: 'none'});
		$('#editBlueSlider').css({display: 'none'});
		$('#editRedLabel').css({display: 'none'});
		$('#editGreenLabel').css({display: 'none'});
		$('#editBlueLabel').css({display: 'none'});
	});

	// Listener for RGB manipulation button on the Edit popup,
	// displays the RGB sliders
	$('#color').click(function() {
		colourFlag = true;
		colorElimFlag = false;
		wandFlag = false;
		erasing = false;
		erasing2 = false;
		$('#editCrop').css({display: 'none'});
		$('#editCrop2').css({display: 'none'});
		$('#thresSlider4').css({display: 'none'});
		$('#thresSlider3').css({display: 'none'});
		$('#eraseSlider').css({display: 'none'});
		$('#wand').css({"backgroundColor":"black", "position":"relative",
	"bottom": "14px"});
		$('#colorElim').css({"backgroundColor":"black", "position":"relative",
	"bottom": "14px"});
		$('#erase').css({"backgroundColor":"black", "position":"relative",
	"bottom": "14px"});
		$(this).css({"backgroundColor":"#444444", "position":"relative",
	"bottom": "14px"});
		$('#editRedSlider').css({display: 'inline'});
		$('#editGreenSlider').css({display: 'inline'});
		$('#editBlueSlider').css({display: 'inline'});
		$('#editRedLabel').css({display: ''});
		$('#editGreenLabel').css({display: ''});
		$('#editBlueLabel').css({display: ''});
	});

	// Listener for the magic wand tool on the Edit popup
	$('#wand').click(function() {
		colourFlag = false;
		colorElimFlag = false;
		wandFlag = true;
		erasing = false;
		erasing2 = false;
		$('#editCrop').css({display: ''});
		$('#thresSlider4').css({display: 'none'});
		$('#editCrop2').css({display: 'none'});
		$('#erase').css({"backgroundColor":"black","bottom": "0px"});
		$('#colorElim').css({"backgroundColor":"black","bottom": "0px"});
		$('#color').css({"backgroundColor":"black","bottom": "0px"});
		$(this).css({"backgroundColor":"#444444","bottom": "0px"});
		$('#thresSlider3').css({display: 'inline'});
		$('#eraseSlider').css({display: 'none'});
		$('#editRedSlider').css({display: 'none'});
		$('#editGreenSlider').css({display: 'none'});
		$('#editBlueSlider').css({display: 'none'});
		$('#editRedLabel').css({display: 'none'});
		$('#editGreenLabel').css({display: 'none'});
		$('#editBlueLabel').css({display: 'none'});
	});

	// Listener for the color selector tool on the Edit popup
	$('#colorElim').click(function() {
		colourFlag = false;
		colorElimFlag = true;
		wandFlag = false;
		erasing = false;
		erasing2 = false;
		$('#editCrop2').css({display: ''});
		$('#thresSlider3').css({display: 'none'});
		$('#editCrop').css({display: 'none'});
		$('#wand').css({"backgroundColor":"black","bottom": "0px"});
		$('#erase').css({"backgroundColor":"black","bottom": "0px"});
		$('#color').css({"backgroundColor":"black","bottom": "0px"});
		$(this).css({"backgroundColor":"#444444","bottom": "0px"});
		$('#thresSlider4').css({display: 'inline'});
		$('#eraseSlider').css({display: 'none'});
		$('#editRedSlider').css({display: 'none'});
		$('#editGreenSlider').css({display: 'none'});
		$('#editBlueSlider').css({display: 'none'});
		$('#editRedLabel').css({display: 'none'});
		$('#editGreenLabel').css({display: 'none'});
		$('#editBlueLabel').css({display: 'none'});
	});

	// Listener for the cut button for the magic wand on
	// the Edit popup
	$('#editCrop').click(function() {
		cropOut2();
	});
	// Listener for the cut button for the color selection
	// on the Edit popup
	$('#editCrop2').click(function() {
		cropOut2();
	});
	// Listener that enable the dragging function for the Elements
	$(".dragSource").each(function() {
		this.onmousedown = mousedown;
		this.ondragstart = dragstart;
	});
	// Listeners that enables the dropping function into elements on 
	// the Template
	$(".dragDest").each(function() {
		this.ondrop = drop;
		this.ondragover = allowDrop;
	});
	// Listener that enables free drop on the Template
	$(".freeDropZone").each(function() {
		this.ondrop = freeDrop;
		this.ondragover = allowDrop;
	});

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

   // mouseOut Listener for Templates background
   $(".templateBackground").mouseout(function() {
   		$( '.draggable' ).draggable().trigger( 'mouseup' );
	});

 	//textBox stuff
	$( "#fontStyleButtons" ).buttonset();
	$( "#fontSelect" ).change(function(){
		updateFont();
	});
	// Sets the font for the font selection dropdown
	$("#fontSelect").find("option").each(function(){
		$(this).css('fontFamily', $(this).val());
	});
	// Keyup listener for the signature text input
    $( "#signature" ).keyup(function() {
		updateFont();  
    });
    // Listener for th preview button for the Template,
    // displays a preview of what the item may look like
    $(".previewBut").click(function(){
    	$( "#finalPreviewDiv" ).dialog();
		var layout;
		var ElementsDiv;
		$(this).siblings(".templateDiv").each(function() {
			if ($(this).is(":visible")) {
				ElementsDiv = $(this).children(".templateBackground");
			}	
		});
		$(ElementsDiv).children(".layouts").each(function() {
			if ($(this).is(":visible")) {
				layout = this;
			}
		});
    	previewClothing(ElementsDiv, layout);
    });

    // onChange Listener for the font style buttons
    $("#fontStyleButtons").change(function(){
    	updateFont();  
    }); 

    //switch between templates
    $('.templateButtons, .buttonDiv').click(function(evt){
		evt.stopPropagation();
		var currentTemplate;
		var child;
		if ($(this).attr('class') == 'buttonDiv') {
			child = $(this).children()[0];
			currentTemplate =  $(child).attr("value");
		} else {	
			currentTemplate =  $(this).attr("value");
		}
		$( ".templateDiv" ).each(function() {
			$(this).css('display', 'none');
		});
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
		$(".dropdown-content").slideUp();
    });
	// mouseOver listner for the Clothing drop down menu,
	// displaying the drop down menu when hovered over
	$(".buttonDiv").mouseenter(function() {
		var value = $(this).attr("value");
		$(".layouts").each(function() {
			$(this).hide();
		});
		$(".templateDiv").each(function() {
			$(this).hide();
		});
		var child = $(this).children()[0];
		var currentTemplate =  $(child).attr("value");
		$("#templateTitle").text($("#" + currentTemplate).attr("value"));
		$("#" + value + "layoutPreview").show();
		$("#" + value + "layoutPreview").closest(".templateDiv").show();
		makeLabels(value);
	});
	
	// mouseOver Listener for the default layout,
	// displays the drop down when moused over and hides otherwise
	$("#layoutsMenu")
		.mouseenter(function() {
			$(".LayoutNames").stop().slideDown();
		})
		.mouseleave(function() {
			$(".LayoutNames").stop().slideUp();
	});
	
	// Listener for the Layouts dropdown menu,
	// Shows a preview of the layout when moused over
	// and sets it on click
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
	
	// mouseOver Listeners for the buttons in the Clothing
	// selection drop down, Applys CSS styling to each of the
	// elements based on even/odd position when moused over
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
	
	// mouseOver Listener for the Clothing selection drop down,
	// animateds the drop downs display
	$(".dropdown, .dropdown-content").mouseenter(function() {
		$('.dropdown-content').stop().slideDown();
	});
	// click Listener for the Clothing selection drop down,
	// animateds the drop downs hide
	$('.dropdown, .dropdown-content').click(function() {
		$('.dropdown-content').stop().slideUp();
	});
	// mouseOver Listener for the Clothing selection drop down,
	// animateds the drop downs hide
	$('.dropdown').mouseleave(function() {
		$('.dropdown-content').stop().slideUp();
	});
	
	// Listener for the color selection menu button,
	// displays the list of selectable colors and
	// adds a new listener that will hide the menu
	// when the button is clicked again
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
    // Listener for the color selection menu button,
    // This hides the menu of colors and restores the
    // default listener
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
	// Listener for the selectable colors of the color menu,
	// gives some animation and visual changes to indicate
	// selection
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

// Function dynamically builds the Layout drop down menu,
// based on value input
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

// Listener for window resize, adjusts the styling of the elements 
// when the window is scaled
$(window).resize(function() {
	var Size = parseFloat($("#content").width());
	if (dragOrclick) {
		if (whichElement != null) {
			var pos = $("#" + whichElement.id).offset();
			var size = $("#ElementDisplay").width();
			$("#ElementDisplay").stop().css({left: pos.left - size, top: pos.top});
		}
		$("#rightSection").stop().css({width:(Size * rightPercent) - 50});
		$("#leftSection").stop().css({width:(Size * leftPercent) - 50});
		$("#centerBeam").stop().css({left:(Size * leftPercent)});
	} else {
		$("#rightSection").stop().animate({width:(Size * rightPercent) - 50},
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


// Pure JS style Onload function for the window. 
// initializes the globals and listeners
// for the magic wand select, Color select, and related sliders,
// as well as the RGB sliders
window.onload = function() {
	// Pure JS Globals
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

    slider = document.getElementById("thresSlider");
    slider.addEventListener("change", function() {
    	currentThreshold = slider2.value = slider3.value = slider4.value = slider.value;
    });

    slider2 = document.getElementById("thresSlider2");
    slider2.addEventListener("change", function() {
    	currentThreshold = slider.value = slider3.value = slider4.value = slider2.value;
    });
	
	slider3 = document.getElementById("thresSlider3");
    slider3.addEventListener("change", function() {
    	currentThreshold = slider.value = slider2.value = slider4.value = slider3.value;
    });

    slider4 = document.getElementById("thresSlider4");
    slider4.addEventListener("change", function() {
    	currentThreshold = slider.value = slider2.value = slider3.value = slider4.value;
    });

    colorThreshold = slider.value = slider2.value = slider3.value = slider4.value = 50;
    currentThreshold = colorThreshold;

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
	if(elmWidth != 400) {
		elmWidth = 400;
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
    var red = document.getElementById("editRedSlider");
	var green = document.getElementById("editGreenSlider");
	var blue = document.getElementById("editBlueSlider");
	
	red.value = blue.value = green.value = 0; 
}

//draw selection on a canvas
function preview(img2, selection) {
	var canvas = $('#previewCanvas')[0];
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

// Allows Elements to be droped in to other elements
function allowDrop(ev) {
	ev.preventDefault();
}

// Gets the X and Y position for the mouse cursor, needed
// for drag and drop features
function mousedown(ev) {
	startOffsetX = ev.offsetX;
	startOffsetY = ev.offsetY;
}

// Gets currently dragged element and saves it in a global 
// for later use 
function dragstart(ev) {
	ev.dataTransfer.setData("Text", ev.target.id);
	draggedElement = ev.target;
}

// Take dragged element and paints it on the canvas
// that it was dropped into
function drop(ev, canvas = ev.target) {
	ev.preventDefault();
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
	var multiPasteClasses = ["multiPaste1", "multiPaste2", "multiPaste3", "multiPaste4", "multiPaste5", "signatureCanvas"];
	for (var i = 0; i < multiPasteClasses.length; i++) {
	   
		if($(canvas).hasClass(multiPasteClasses[i])){
			$("." + multiPasteClasses[i]).each(function() {
				drawCopiedImage(this, ev);
			});
		}  
	}
}

// collapse canvas and create preview
function previewClothing(template, curLayout, previewCanvas = $("#clothingPreviewCanvas")[0]){
	template = $(template);
	var templateValue = template.parent().attr("value");
	var backgroundImage = template.parent().find(".previewBackground")[0];
	if (backgroundImage == null) {
		$("#paragraph").text("No Image Available");
		return;
	}
	$("#paragraph").text("");
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
			width = $(this).width();
			height = $(this).height();
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
			ctx.drawImage($(this).find("canvas")[0], -(width/2), -(height/2), width, height);
			ctx.restore();
    	} else{
    		ctx.drawImage($(this).find("canvas")[0], leftOffset * $(previewCanvas).width(), topOffset * $(previewCanvas).height(), width, height);
    	}
	});
	ctx.globalAlpha = 1;
	ctx.drawImage(backgroundImage, 0, 0, previewCanvas.width, previewCanvas.height);
}

// gets the element rotation in degrees
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

//draws copied image on the canvas
function drawCopiedImage(canvas, ev){
	ev.preventDefault();
	
	//If the target and source are the same canvas, do nothing
	if(canvas.id == draggedElement.id) {
		return;
	}
	$(canvas).parent().data("used", true);
	fitSize(draggedElement, $(canvas).parent());
	canvas.fitSizewidth = draggedElement.width;
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
		var mask = eliminateWhite(image, 64);
		cropOut3(mask, data, ctx);
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
            var ctx = document.getElementById("uploadedImage").getContext('2d');
            img = new Image;
            img.src = URL.createObjectURL(inp.files[0]);
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
    return { x: x, y: y };
}

// Gets the current posision of the mouse on the Edit popup's canvas 
function getMousePosition2(e) { // NOTE*: These may need tweeking to work properly
    var p = $(e.target).offset(),
    	widthScale = document.getElementById('ElementCanvas').offsetWidth / document.getElementById('ElementCanvas').width,
    	heightScale = document.getElementById('ElementCanvas').offsetHeight / document.getElementById('ElementCanvas').height,
        x = Math.round(((e.clientX || e.pageX) - p.left) / widthScale),
        y = Math.round(((e.pageY || e.clientY) - p.top) / heightScale);
    return { x: x, y: y };
}


// listener for the mouseDown event.
// Checks if applicilable mode is in enabled
// and makes the selection
function onMouseDown(e) {
	if(wandFlag || colorElimFlag) {
	    if (e.button == 0) {
	        allowDraw = true;
	        downPoint = getMousePosition(e);
	        drawMask(downPoint.x, downPoint.y);
	    }
	    else allowDraw = false;
	} else if(erasing) {
		copyImageData();
		allowDraw = true;
		downPoint = getMousePosition(e);
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
// listener for the mouseDown event for the Edit popup.
// Checks if applicilable mode is in enabled
// and makes the selection
function editMouseDown(e) {
	if(erasing2) {
		copyImageData();
		allowDraw = true;
		downPoint = getMousePosition2(e);
		ctx = document.getElementById("ElementCanvas").getContext("2d");
		radius = document.getElementById("eraseSlider").value;;
		ctx.beginPath();
			ctx.globalCompositeOperation = "destination-out";
			ctx.arc(downPoint.x, downPoint.y, radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.globalCompositeOperation = "source-atop";
		ctx.closePath();
	} else if(wandFlag || colorElimFlag) {
	    if (e.button == 0) {
	        allowDraw = true;
	        downPoint = getMousePosition2(e);
	        drawEditMask(downPoint.x, downPoint.y);
	    }
	    else allowDraw = false;
	}
}
// listener for the mousecMove event, gets the current mouse position
// within the main canvas
function onMouseMove(e) {
	e.preventDefault();
    if (allowDraw) {
		if(erasing) {
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
			}
        }
    }
}
// listener for the mousecMove event, gets the current mouse position
// within the edit canvas
function editMouseMove(e) {
	if(allowDraw) {
		if(erasing2) {
			ctx = document.getElementById("ElementCanvas").getContext("2d");
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

// listner for the mouseUp event for the main canvas,
// saves the changes made during the mouseDown and 
// mouseMove Event
function onMouseUp(e) {
	if(allowDraw) {
		allowDraw = false;
		ctx = imageInfo.context;
		imageInfo.context.globalCompositeOperation = "source-atop";

		if(erasing) {
			imageInfo.data = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height);
		}
	}
}

// listner for the mouseUp event for the main canvas,
// saves the changes made during the mouseDown and 
// mouseMove Event
function editMouseUp(e) {
	allowDraw = false;

	if(erasing2) {
		var ctx2 = document.getElementById("ElementCanvas").getContext("2d");
		EditInfo.data = ctx2.getImageData(0, 0, EditInfo.width, EditInfo.height);
	}
}

// Finds the pixels and saves it in the mask, then draws 
// a border around the selection on the main canvas
function drawMask(x, y) {
    if (!imageInfo) return;
    
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
// Finds the pixels and saves it in the mask, then draws 
// a border around the selection on the Edit popup canvas
function drawEditMask(x, y) {
    if (!EditInfo) return;

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
// on the main canvas
function hatchTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawBorder(true);
}
// Function that animates the border around the seleceted pixels
// on the Edit popup's canvas
function editTick() {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    drawEditBorder(true);
}

// Draws a boarder around the selected pixels for the
// main canvas
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

// Draws a boarder around the selected pixels for the
// Edit popup's canvas
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

// Function crops the selected pixels form the image,
// for the main canvas
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
		var ctx = document.getElementById("uploadedImage").getContext('2d');
		ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
		ctx.putImageData(imageInfo.data, 0, 0);
	}, 300);
};

// Function crops the selected pixels form the image,
// used only when the user selects the Tie template and
// affects only the ties elements
function cropOut3(mask, image, ctx) {
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
		ctx.clearRect(0, 0, image.width, image.height);
		ctx.putImageData(image, 0, 0);
};

// Function crops the selected pixels form the image,
// for the Edit popup canvas
function cropOut2() {
	if(mask2 == null) return;
	var tmpMask = mask2;
	mask2 = null;

	for(i = 0; i < tmpMask.data.length; i++) {
		if(tmpMask.data[i] != 0) {
			var tmp = i * 4;
			EditInfo.data.data[tmp] = 0;
			EditInfo.data.data[tmp + 1] = 0;
			EditInfo.data.data[tmp + 2] = 0;
			EditInfo.data.data[tmp + 3] = 0;
		}
	}
	var ctx = document.getElementById("ElementCanvas").getContext('2d');
	ctx.clearRect(0, 0, EditInfo.width, EditInfo.height);
	ctx.putImageData(EditInfo.data, 0, 0);
};

// Fucntion finds the selected color (based on a threshold) from the image
function colorElimination(image, x, y, threshold) {
    var tmp, ipix = (y * image.width * 4) + x * 4,
        pixel = [image.data[ipix], image.data[ipix+1], image.data[ipix+2], image.data[ipix+3]];
    for(var i = 0, size = image.width*image.height,
        array = new Uint8Array(size); i < size; i++) {
        tmp = image.data[i*4] - pixel[0];
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+1] - pixel[1];
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+2] - pixel[2];
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+3] - pixel[3];
        if(tmp > threshold || tmp < -threshold) continue;

        array[i] = 1;
    }
    return {data: array, width:image.width,height:image.height,bounds:{minX:0,minY:0,maxX:image.width,maxY:image.height}};
};

// Function removes any pixel that is with in the
// white threshold from the image
function eliminateWhite(image, threshold) {
	var tmp;
    for(var i = 0, size = image.width*image.height,
        array = new Uint8Array(size); i < size; i++) {
        tmp = image.data[i*4] - 255;
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+1] - 255;
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+2] - 255;
        if(tmp > threshold || tmp < -threshold) continue;
        tmp = image.data[(i*4)+3] - 255;
        if(tmp > threshold || tmp < -threshold) continue;

        array[i] = 1;
    }
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

// Color changers, for the main canvas
function colorChange() {
	if(colourFlag) {
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

// Color changers, for the Edit popup's canvas
function colorChange2() {
	if(colourFlag) {

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

		for(var i = 0; i < EditInfo.data.data.length; i += 4)
		{
			red = EditInfo.data.data[i]>>>0;
			green = EditInfo.data.data[i + 1]>>>0;
			blue = EditInfo.data.data[i + 2]>>>0;
			alpha = EditInfo.data.data[i + 3];
			
			if(document.getElementById("editRedSlider").value < 0) {
				negRed = true;
				redChange = (document.getElementById("editRedSlider").value * -1)>>>0;
			} else {
				redChange = document.getElementById("editRedSlider").value>>>0;
			}
			if(document.getElementById("editGreenSlider").value < 0) {
				negGreen = true;
				greenChange = (document.getElementById("editGreenSlider").value * -1)>>>0;
			} else {
				greenChange = document.getElementById("editGreenSlider").value>>>0;
			}
			if(document.getElementById("editBlueSlider").value < 0) {
				negBlue = true;
				blueChange = (document.getElementById("editBlueSlider").value * -1)>>>0;
			} else {
				blueChange = document.getElementById("editBlueSlider").value>>>0;
			}
			
			if(negRed){
				EditInfo.data.data[i] = red - redChange;
			} else if(red + redChange > 255) {
				EditInfo.data.data[i] = 255>>>0;
			} else if(red - redChange < 0) {
				EditInfo.data.data[i] = 0>>>0;
			} else {
				EditInfo.data.data[i] += redChange>>>0;
			}
			
			if(negGreen){
				EditInfo.data.data[i + 1] -= greenChange;
			} else if(green + greenChange > 255) {
				EditInfo.data.data[i + 1] = 255>>>0;
			} else if(green - greenChange < 0) {
				EditInfo.data.data[i + 1] = 0>>>0;			
			} else {
				EditInfo.data.data[i + 1] += greenChange>>>0;
			}
			
			if(negBlue){
				EditInfo.data.data[i + 2] -= blueChange;
			} else if(blue + blueChange > 255) {
				EditInfo.data.data[i + 2] = 255>>>0;
			} else if(blue - blueChange < 0) {
				EditInfo.data.data[i + 2] = 0>>>0;			
			} else {
				EditInfo.data.data[i + 2] += blueChange>>>0;
			}
			negRed = false;
			negGreen = false;
			negBlue = false;
			EditInfo.data.data[i + 3] = alpha; // not changing the transparency
		}
	}
};

// Converts the image on the main canvas to greyscale
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
