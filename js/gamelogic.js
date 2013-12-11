
    window.onload = function () {
			  var canvas = document.getElementById('canvas'); 
			  var context = canvas.getContext('2d'); 
			  var lander = new Lander(); 
			  var rotate = 0; 
			  var velocityInTheXDirection = 0; 
			  var velocityInTheYDirection = 0; 
			  var thrust = 0;
			  var landingpad = new LandingPad();
			  var arrow = new Arrow();
	//Gamespace Boundaries
			var leftBoundary = 0;
			var rightBoundary = canvas.width;
			var topBoundary = 0;
			var bottomBoundary = canvas.height;
	//landingPad Boundaries
			
	//Lander starting conditions
			  lander.x = canvas.width / 2;
			  lander.y = canvas.height / 2;
			  lander.rotation = 0;
			  var gravity = 0.02;//adjusted by visual inspection
			  var elasticity = -.5;//this value seems to give just enough bounce to seem reasonable
			  var frictionCoefficient = .1;
	//statusWindow
			  var statusWindow = document.getElementById('statusWindow');

	//This sets up to read for arrow key presses so it can react to input
			  window.addEventListener('keydown', 
									  function (event) {
											switch (event.keyCode) {
												case 37://rotate left
													rotate = -1;
													lander.rightThruster = true;													
													break;
												case 39://rotate right
													rotate = 1;
													lander.leftThruster = true;
													break;
												case 38://thrust up
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
	
	//The ability to block in the screen canvas so that the lander just bounces off the walls follows:	
				//make the lander bounce off the left and right limits of the walls
				if (lander.x + lander.landerCollisionWidth > rightBoundary) {
					lander.x = rightBoundary - lander.landerCollisionWidth;           
					velocityInTheXDirection *= elasticity;//to just bounce off multiply times -1 to change the direction;
				} else if (lander.x - lander.landerCollisionWidth < leftBoundary) {
					lander.x = leftBoundary + lander.landerCollisionWidth;
					velocityInTheXDirection *= elasticity;//to just bounce off multiply times -1 to change the direction;
				}
				//make the lander bounce off the upper and lower limits of the walls
				if (lander.y + lander.landerCollisionHeight > bottomBoundary) {
					lander.y = bottomBoundary - lander.landerCollisionHeight;
					velocityInTheYDirection *= elasticity;//to just bounce off multiply times -1 to change the direction;
					if (velocityInTheXDirection > 0) {
						velocityInTheXDirection = velocityInTheXDirection.toFixed(1);
						velocityInTheXDirection -= frictionCoefficient;
					}
					if (velocityInTheXDirection < 0) {
						velocityInTheXDirection += frictionCoefficient;
					}
				} else if (lander.y - lander.landerCollisionHeight < topBoundary) {
					lander.y = topBoundary + lander.landerCollisionHeight;
					velocityInTheYDirection *= elasticity;//to just bounce off multiply times -1 to change the direction;
				} 
				statusWindow.value = 'xxxxxx';
	//First landinPad==========================================================================================================================working	
				if (lander.x > 600 && lander.x < 690 && Math.round(lander.y) == 280) { // || 670 < lander.x || lander.y + lander.height < 290 || 300 < lander.y
					statusWindow.value = "Bang!";
					//now working==============================================================================================================working
					lander.y = 280;//0 - lander.landerCollisionHeight;// at 292 it slips thru
					velocityInTheYDirection *= elasticity;//-1 seems to work;//elasticity;//to just bounce off multiply times -1 to change the direction;
					
					if (velocityInTheXDirection > 0) {
						velocityInTheXDirection = velocityInTheXDirection.toFixed(1);
						velocityInTheXDirection -= frictionCoefficient;
					}
					if (velocityInTheXDirection < 0) {
						velocityInTheXDirection += frictionCoefficient;
					}
				} else {
					statusWindow.value = "-------";
				}
	
	//The dynamics of the lander follow: velocity, angle, acceleration, and gravity
				velocityInTheXDirection += accelerationInTheXDirection;
				velocityInTheYDirection = velocityInTheYDirection + accelerationInTheYDirection + gravity;
				lander.x += velocityInTheXDirection;
				lander.y += velocityInTheYDirection;
				document.getElementById('yposition').innerHTML = "Y Position: " + lander.y.toFixed(2);
				document.getElementById('xposition').innerHTML = "X Position: " + lander.x.toFixed(2);	
				document.getElementById('vacceleration').innerHTML = "Y Acceleration: " + accelerationInTheYDirection.toFixed(2);
				document.getElementById('hacceleration').innerHTML = "X Acceleration: " + accelerationInTheXDirection.toFixed(2);
				document.getElementById('vvelocity').innerHTML = "Y Velocity: " + velocityInTheYDirection.toFixed(2);
				document.getElementById('hvelocity').innerHTML = "X Velocity: " + velocityInTheXDirection.toFixed(2);
				document.getElementById('angle').innerHTML = "Angle: " + lander.rotation.toFixed(2);
				lander.draw(context);
				landingpad.draw(context);
				//arrow.draw(context);
			  }
			  ()
			);
    };
	
	//azimuth guage
	function Arrow () {
		  this.width = 30;
		  this.height = 150;
	}
	
	//azimuth guage
	Arrow.prototype.draw = function (context) {
		  context.save();
		  context.lineWidth = 1;
		  context.strokeStyle = "#ffffff"; //white
		  context.beginPath();
		  context.moveTo(0, 40);
		  context.lineTo(5, 0);
		  context.lineTo(15, 40);
		  context.lineTo(10, 40);
		  context.lineTo(10, 150);
		  context.lineTo(5, 150);		  
		  context.lineTo(5, 40);
		  context.lineTo(0, 40);
		  context.stroke();
		  context.restore();
	}
	
	//sets up more scenery
	function LandingPad () {
		  this.width = 40;
		  this.height = 10;
	}
	
	//this draws out the landing pad
	LandingPad.prototype.draw = function (context) {
		  context.save();
		  context.lineWidth = 1;
		  context.strokeStyle = "#ffffff"; //white
		  context.beginPath();
		  context.moveTo(500, 300);
		  context.lineTo(550, 240);
		  context.lineTo(600, 290);
		  context.lineTo(670, 290);
		  context.lineTo(720, 180);
		  context.lineTo(790, 300);		  
		  context.lineTo(500, 300);
		  context.stroke();
		  context.restore();
	}
	
	//sets up the Lander layout box
	function Lander () {
		  this.x = 0;
		  this.y = 0;
		  this.width = 22;
		  this.height = 25;
		  this.landerCollisionWidth = 10;
		  this.landerCollisionHeight = 10;
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