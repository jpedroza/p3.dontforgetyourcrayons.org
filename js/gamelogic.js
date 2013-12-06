
    window.onload = function () {
			  var canvas = document.getElementById('canvas'); 
			  var context = canvas.getContext('2d'); 
			  var lander = new Lander(); 
			  var rotate = 0; 
			  var velocityInTheXDirection = 0; 
			  var velocityInTheYDirection = 0; 
			  var thrust = 0;
			  var landingpad = new LandingPad();
	//Lander starting conditions
			  landingpad.x = 760;
			  landingpad.y = 50;
			  lander.x = canvas.width / 2;
			  lander.y = canvas.height / 2;
			  lander.rotation = 0;
			  var gravity = 0.01;
	//I will add an element to the canvas
		//	  context.fillStyle = "#FFFF00";//yellow 
		//	  canvas.fillRect(760, 50, 40, 10);//canvas is 800px across by 570px down
	//This sets up to read for arrow key presses so it can react to input
			  window.addEventListener('keydown', 
									  function (event) {
											switch (event.keyCode) {
												case 37:      //rotate left
													rotate = -1;
													lander.rightThruster = true;													
													break;
												case 39:      //rotate right
													rotate = 1;
													lander.leftThruster = true;
													break;
												case 38:      //thrust up
													thrust = 0.05;
													gravity = -0.01;//this slowly couteract the effects of gravity 
													lander.mainThruster = true;
												break;
											}
									  }, 
									  false
			  );
	//When the key is actually released all rotations and all thrusters are turned off and gravity needs to resume pulling the Lander back down again
			  window.addEventListener('keyup', 
									  function () {
											rotate = 0;
											thrust = 0;
											gravity = 0.01;//this was a manual experiment and play until this seemed to be reasonable; however, on different computers and browsers it moves faster or slower
											lander.mainThruster = false;
											lander.rightThruster = false;
											lander.leftThruster = false;
									  }, 
									  false
			  );
	//This ensures compatibility across most browsers. I got this from page 20, Foundation HTML5 Animation with JavaScript By Billy Lamberta, Keith Peters from books.google.com
			if (!window.requestAnimationFrame) {
				  window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
												  window.mozRequestAnimationFrame ||
												  window.msRequestAnimationFrame ||
												  window.oRequestAnimationFrame ||
												  function (callback) {
													return window.setTimeout(callback, 17);
												  }
				  );
			}	  
	//This has all the main functionality of the mechanics - fidgeting with Stack Overflow, experimentation, relearning Sine, Cosine...
	//The most confusing thing about this whole project is accepting that the animation canvas is an upside down Cartesian Coordinate Plane (e.g., positive y values increase going down)
			(function drawFrame () {
				//this sets up the main animation loop that keeps calling itself, thereby executing the code over and over
				window.requestAnimationFrame(drawFrame, canvas);
				context.clearRect(0, 0, canvas.width, canvas.height);
				lander.rotation += rotate * Math.PI / 180;
				var angle = lander.rotation; 
				var accelerationInTheYDirection = -Math.cos(angle) * thrust;//this is negative to account for the orientation of the canvas 
				var accelerationInTheXDirection = Math.sin(angle) * thrust;
				velocityInTheXDirection += accelerationInTheXDirection;
				velocityInTheYDirection = velocityInTheYDirection + accelerationInTheYDirection + gravity;
				lander.x += velocityInTheXDirection;
				lander.y += velocityInTheYDirection;
				lander.draw(context);
			  }
			  ()
			);
    };

	//sets up the Target for the Lander to shoot for
	function LandingPad () {
		  this.x = 0;
		  this.y = 0;
		  this.width = 40;
		  this.height = 10;
	}
	
	//this draws out the landing pad
	LandingPad.prototype.draw = function (context) {
		  context.save();
		  context.lineWidth = 1;
		  context.strokeStyle = "#ffffff"; //white
		  context.beginPath();
		  context.moveTo(4, 5);
		  context.lineTo(4, 8);
		  context.lineTo(20, 8);
		  context.lineTo(20, 5);
		  context.lineTo(4, 5);
		  context.stroke();
		  context.restore();
	}
	
	//sets up the Lander layout box
	function Lander () {
		  this.x = 0;
		  this.y = 0;
		  this.width = 22;
		  this.height = 25;
		  this.rotation = 0;
		  this.mainThruster = false;
		  this.leftThruster = false;
		  this.rightThruster = false;		  
	}
	
	//this key piece of code then moves the lander as read by the key input or lets gravity take effect
	Lander.prototype.draw = function (context) {
		  context.save();
		  context.translate(this.x, this.y);
		  context.rotate(this.rotation);
		  context.lineWidth = 1;
		  context.strokeStyle = "#ffffff"; //white
		  
		  //upper capsule of the lander
		  context.beginPath();
		  context.moveTo(-4, -10);
		  context.lineTo(-7, -7);
		  context.lineTo(-7, -3);
		  context.lineTo(-4, 0);
		  context.lineTo(4, 0);
		  context.lineTo(7, -3);
		  context.lineTo(7, -7);
		  context.lineTo(4, -10);
		  context.lineTo(-4, -10);
		  context.stroke();
		  
		  //lower body of the lander
		  context.beginPath();
		  context.moveTo(7, 0);
		  context.lineTo(7, 4);
		  context.lineTo(-7, 4);
		  context.lineTo(-7, 0);
		  context.lineTo(7, 0);		  
		  context.stroke();
		  
		  //left leg of the lander
		  context.beginPath();
		  context.moveTo(-7, 1);
		  context.lineTo(-9, 7);
		  context.lineTo(-11, 8);
		  context.lineTo(-7, 8);
		  context.lineTo(-9, 7);
		  context.lineTo(-6, 4);		  
		  context.stroke();		  
		  
		  //right leg of the lander
		  context.beginPath();
		  context.moveTo(7, 1);
		  context.lineTo(9, 7);
		  context.lineTo(11, 8);
		  context.lineTo(7, 8);
		  context.lineTo(9, 7);
		  context.lineTo(6, 4);		  
		  context.stroke();		  
		  
		  //main booster of the lander
		  context.beginPath();
		  context.moveTo(-4, 4);
		  context.lineTo(-5, 6);
		  context.lineTo(5, 6);
		  context.lineTo(4, 4);
		  context.lineTo(-4, 4);		  
		  context.stroke();
	  
		  //main booster flame
		  if (this.mainThruster) {
				context.beginPath();
				context.moveTo(-4, 6);
				context.lineTo(0, 15);
				context.lineTo(4, 6);
				context.stroke();
		  }
		  
		  //fire right booster flame
		  if (this.rightThruster) {
				context.beginPath();
				context.moveTo(8, 8);
				context.lineTo(9, 12);
				context.lineTo(10, 8);
				context.stroke();
		  }		  

		  //fire left booster flame
		  if (this.leftThruster) {
				context.beginPath();
				context.moveTo(-10, 8);
				context.lineTo(-9, 12);
				context.lineTo(-8, 8);
				context.stroke();
		  }		  
		  context.restore();
	};