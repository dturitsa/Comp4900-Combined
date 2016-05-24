var scarf, tie, hat, leggings;
var activeTemplate;
var productId

$( document ).ready(function() {
    jQuery.getJSON('/products/test-product2.js', function(product) {
        productId = product.variants[0].id;
	} );


    scarf = new Template();
    scarf.image = $("#template2Background").find('img')[0]
    scarf.width = 1000;
    scarf.height = parseInt((scarf.width / scarf.image.naturalWidth) * scarf.image.naturalHeight);
    scarf.variantId = 123;
    scarf.templateDiv = $("#template2")[0];
    scarf.handle = "scarf";

   	tie = new Template();
    tie.image = $("#template3Background").find('img')[0]
    tie.width = 1000;
    tie.height = parseInt((tie.width / tie.image.naturalWidth) * tie.image.naturalHeight);
    scarf.templateDiv = $("#template3")[0];
    tie.variantId = 123;
    tie.handle = "tie";


    hat = new Template();
    hat.image = $("#template4Background").find('img')[0]
    hat.width = 2000;
    hat.height = parseInt((hat.width / hat.image.naturalWidth) * hat.image.naturalHeight);
    scarf.templateDiv = $("#template4")[0];
    hat.variantId = 123;
    hat.handle = "hat";


    leggings = new Template();
    leggings.image = $("#template5Background").find('img')[0]
    leggings.width = 2000;
    leggings.height = parseInt((leggings.width / leggings.image.naturalWidth) * leggings.image.naturalHeight);
    scarf.templateDiv = $("#template5")[0];
    leggings.variantId = 123;
    leggings.handle = "leggings";
 	
 	    // Listener for the checkoutButton gets the current template and layout and call the checkout function
    $(".checkoutBut").click(function(){
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
    	checkout(ElementsDiv, layout);
    });
});

function checkout(templateDiv, layout){
		if($(templateDiv).attr('id') == 'template2Background'){
			activeTemplate = scarf;
		} else if($(templateDiv).attr('id') == 'template3Background'){
			activeTemplate = tie;
		} else if($(templateDiv).attr('id') == 'template4Background'){
			activeTemplate = hat;
		} else if($(templateDiv).attr('id') == 'template5Background'){
			activeTemplate = leggings;
		}
		
		var canvas = collapseLayout(templateDiv, layout);
  /*
    var img = $("#template2Background").find('img')[0];
    img.crossOrigin = "Anonymous";
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 5000, 500);
    */
		sendToCart(canvas);
}


function collapseLayout(template, layout){
	var canvas = document.createElement('canvas');
	//var canvas = $('#uploadedImage')[0];
	canvas.width = activeTemplate.width;
	canvas.height = parseInt((activeTemplate.width / activeTemplate.image.naturalWidth) * activeTemplate.image.naturalHeight);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = template.parent().css('background-color');
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	console.log(canvas.width);
	console.log(canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$(layout).find(".wrapper").each(function(){
		var width = $(this).width() * (canvas.width / template.width());
		var height = $(this).height() * (canvas.height / template.height());
		var leftOffset = $(this).position().left * (canvas.width / template.width());
		var topOffset = $(this).position().top * (canvas.height / template.height());


		if(getRotationDegrees($(this)) != 0){
    		ctx.save();
    		ctx.translate(leftOffset, topOffset);
    		ctx.translate(width / 2, height / 2);
    		ctx.rotate(getRotationDegrees($(this)) * Math.PI/180);
			ctx.drawImage($(this).find("canvas")[0], -(width/2), -(height/2), width, height);
			ctx.restore();
    	} else{
    		ctx.drawImage($(this).find("canvas")[0], leftOffset, topOffset, width, height);
    	}
	});
	ctx.drawImage($(template).find('img')[0], 0, 0, canvas.width, canvas.height);
	return canvas;
}

function sendToCart(canvas){
  //var data = new Image();
  //data.crossOrigin = 'Anonymous';
  var data = canvas.toDataURL("image/png");


 //localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );

	var blob = dataURItoBlob(data);

  var fd = new FormData();
	fd.append('id', productId);
	fd.append('properties[interceptCanvas]', blob, "intercepted_file.png");
            
	$.ajax({
    	type: 'POST',
    	url: '/cart/add.js',
    	data: fd,
    	processData: false,
    	contentType: false,
         mimeType: "multipart/form-data"
	}).done(function(data) {
       		console.log(data);
	});

}

        //converts dataURI to blob
        function dataURItoBlob(dataURI) {
    		// convert base64/URLEncoded data component to raw binary data held in a string
    		var byteString;
    		if (dataURI.split(',')[0].indexOf('base64') >= 0)
        		byteString = atob(dataURI.split(',')[1]);
    		else
        		byteString = unescape(dataURI.split(',')[1]);

   		 	// separate out the mime component
    		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    		// write the bytes of the string to a typed array
    		var ia = new Uint8Array(byteString.length);
    		for (var i = 0; i < byteString.length; i++) {
        		ia[i] = byteString.charCodeAt(i);
    		}

    		return new Blob([ia], {type:mimeString});
		}

var Template = function () {
	//name of the template
  	this.templateName;

  	//the background image
  	this.image;

  	//templateDiv
  	this.templateDiv;

  	//the desired width in pixels when uploading to the cart 
  	this.width;

  	//the desired height in pixels when uploading to the cart 
  	this.height;

  	//thed default variant id to be used when uploading to the cart
  	this.variantId;

  	//shopify's handle for the product this template is associated with
  	//by default this is the product name with spaces replaced with -
  	this.handle;
};


Template.prototype.isActive = function() {
	if($(this.templateDiv).is(":visible")){
		return true;
	} else{
		return false;
	}
};