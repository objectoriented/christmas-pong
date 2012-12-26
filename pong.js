function getWindowWidth() {
    var x = 0;
    if (self.innerHeight) {
          x = self.innerWidth;
    }
    else if (document.documentElement && document.documentElement.clientHeight) {
          x = document.documentElement.clientWidth;
    } else if (document.body) {
          x = document.body.clientWidth;
    }
    return x;
}

function getWindowHeight() {
    var y = 0;
    if (self.innerHeight) {
        y = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        y = document.documentElement.clientHeight;
    }
    else if (document.body) {
        y = document.body.clientHeight;
    }
    return y;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);



// Create canvas
var canvas = document.createElement("canvas");

canvas.width = getWindowWidth() - 25;
canvas.height = getWindowHeight() - 25;

// Get a 2D context with which to draw on canvas
var ctx = canvas.getContext("2d");

//ctx.globalCompositeOperation = 'destination-over';

// Append the canvas object onto the page
document.body.appendChild(canvas);


// Keep track of ball
var x = 0, y = 0, x_delta = 0, y_delta = 0;
var max = 6; // max movement

var randomDirection = function() {
    return (Math.round(Math.random()) == 0 ? -1 : 1);
}

var reset = function() {
    x = Math.floor((Math.random() * canvas.width) + 1);
    y = Math.floor((Math.random() * canvas.height) + 1);
    
    x_delta = randomDirection() * Math.floor((Math.random() * (max-1)) + 1);

    // use the pythagorean thm to find the y_delta that gives us a (near) constant hypotenuse (distance moved per frame)
    var s = Math.sqrt(Math.pow(max,2) - Math.pow(x_delta,2));

    //console.log("Sqrt: " + s);

    y_delta = randomDirection() * Math.floor(s);
    //y_delta = randomDirection() * (max^2 - x_delta);

    //console.log("X: " + x_delta + "; Y: " + y_delta);
    //console.log("Distance: " + (Math.pow(x_delta,2) + Math.pow(y_delta,2)));
}

// Function to move the ball
var moveBall = function() {

    // check if hit top or bottom wall

    if (y <= max || canvas.height - y <= max) {
        // bounce
        y_delta *= -1; // invert the y coordinate change
    }

    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
        // moved off screen
        reset();
    }

    if (leftPaddle.isTouchingBall() || rightPaddle.isTouchingBall()) {
        x_delta *= -1; // invert horizontal direction
    }

    // Draw background
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    x += x_delta;
    y += y_delta;
    
    // Draw ball
    //ctx.fillRect(x, y, 5, 5);
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2*Math.PI, 1);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fill();
    ctx.closePath();

    // Draw paddles

    leftPaddle.draw();
    rightPaddle.draw();



    setTimeout(moveBall, Ball.speed);
}

function Ball() {
    this.x = x;
    this.y = y;
}

Ball.speed = 8;


function Paddle(x, y) {
    this.x = x;
    this.y = y;
}

Paddle.width = 40;
Paddle.height = 160;
Paddle.distanceFromEdge = 20;
Paddle.speed = 10;

Paddle.prototype.draw = function() {

    if (this.y >= 0 && (this.y + Paddle.height) <= canvas.height) {
        if (38 in keysDown) { // Player holding up arrow
            this.y -= (this.y < Paddle.speed ? this.y : Paddle.speed);
        }

        if (40 in keysDown) { // Player holding down arrow
            var distanceFromEdge = (canvas.height - (this.y + Paddle.height));
            this.y += (distanceFromEdge < Paddle.speed ? distanceFromEdge : Paddle.speed);
        }
    }

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(this.x, this.y, Paddle.width, Paddle.height);
}

Paddle.prototype.isTouchingBall = function() {
    var touching = false;

    if (
            x >= this.x && x <= this.x + Paddle.width &&
            y >= this.y && y <= this.y + Paddle.height
        ) {
            //console.log("Ball: (" + x + ", " + y + ")");
            //console.log("Paddle: (" + this.x + ", " + this.y + ")");
            touching = true;
    }

    return touching;
}


reset();

setTimeout(moveBall, Ball.speed);


var leftPaddle = new Paddle(Paddle.distanceFromEdge, (canvas.height - Paddle.height) / 2);
var rightPaddle = new Paddle(canvas.width - (Paddle.width + Paddle.distanceFromEdge), (canvas.height - Paddle.height) / 2);


