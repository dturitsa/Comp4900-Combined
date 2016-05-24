
        $( document ).ready(function() {
          var c=document.getElementById("testCanvas");
			var ctx=c.getContext("2d");
          ctx.fillRect(0,0,300,300);
          ctx.fillStyle="#FF0000";
          ctx.fillRect(50,50,200,200);
          
          var productId;
          jQuery.getJSON('/products/test-product2.js', function(product) {
           // console.log('title:' + product.title + " Id:" + product.id);
            productId = product.variants[0].id;
			} );
          
          console.log(jQuery.getJSON('/products/test-product2.js'));
          
          //makeNewOrder(productId);
          
          $("#testBut").click(function() {
            console.log("test Clicked: " + productId);
				makeNewOrder(productId)
          });
          
          
           $("#AddToCartForm").on("submit", function(e) {
				//appendToOrder(e);
			});
          
          
          
		});
          function makeNewOrder(productId){
            var canvas = $("#testCanvas")[0];
            var data = canvas.toDataURL("image/png");
			var blob = dataURItoBlob(data);
            /*
            jQuery.post('/cart/add.js', {
  				quantity: 1,
  				id: productId,
                properties: {
    			'newTextField': 'injected in js',
                  'newImage': blob
  				}
			});
            */
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
            /*
			var xhr = new XMLHttpRequest();
				xhr.open("POST", '/cart/add.js');
				xhr.send(fd);
                */
          
          }
          
          function appendToOrder(e){
            	e.preventDefault();
          		console.log("intercepted");
             
             	//create new formdata object from the interceped post
				var f = e.target,
				formData = new FormData(f);
				
             	//convert canvas to dataURL and then to blob
             	var canvas = $("#testCanvas")[0];
             	var data = canvas.toDataURL("image/png");
				var blob = dataURItoBlob(data);
             	
             	//append new fields to formdata
        		formData.append("properties[interceptField]", "added in js");
             	formData.append("properties[interceptCanvas]", blob, "intercepted_file.png");
          		
             	//send the updated post on its merry way
             	var xhr = new XMLHttpRequest();
				xhr.open("POST", f.action);
				xhr.send(formData);
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
/*
  <canvas id="testCanvas"  width="300" height="300"></canvas>
	<button id="testBut">test</button>button

     */  