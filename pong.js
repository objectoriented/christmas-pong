// Ball

function Ball() {
    this.x = 0;
    this.y = 0;
}

Ball.radius = 12;
Ball.speed = 16;

Paddle.prototype.getX = function() {
    return this.x;
}

Paddle.prototype.getY = function() {
    return this.y;
}

Paddle.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
}

// Paddle

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
            x >= this.x - Ball.radius && x <= this.x + Paddle.width + Ball.radius &&
            y >= this.y - Ball.radius && y <= this.y + Paddle.height + Ball.radius
        ) {
            touching = true;
    }

    return touching;
}

// Utility functions

// Window size functions (came from: http://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code)
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

// Handle keyboard controls (borrowed from: http://www.lostdecadegames.com/demos/simple_canvas_game/)
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var randomDirection = function() {
    return (Math.round(Math.random()) == 0 ? -1 : 1);
}

// Reset the ball's position and direction
var resetBall = function() {

    x = Math.floor((Math.random() * canvas.width) + 1);
    y = Math.floor((Math.random() * canvas.height) + 1);

    var step = Ball.radius / 6;
    
    x_delta = randomDirection() * Math.floor((Math.random() * (step-3)) + 2*step);

    // use the pythagorean thm to find the y_delta that gives us a (near) constant hypotenuse (distance moved per frame)
    var s = Math.sqrt(Math.pow(max,2) - Math.pow(x_delta,2));

    y_delta = randomDirection() * Math.floor(s);
}

// Move the ball (renders each frame)
var moveBall = function() {

    // check if hit top or bottom wall
    if (y <= max || canvas.height - y <= max) {
        // bounce
        y_delta *= -1; // invert the y coordinate (angle of incidence == angle of reflection)
    }

    // moved off screen?
    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
        resetBall();
    }

    // did the ball hit a paddle?
    if (leftPaddle.isTouchingBall() || rightPaddle.isTouchingBall()) {
        x_delta *= -1;

        // TODO: if the ball is inside the paddle, adjust the X coord so it moves outside of the boundary
    }

    // Draw background
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adjust the ball's position
    x += x_delta;
    y += y_delta;
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(x, y, Ball.radius, 0, 2*Math.PI, 1);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fill();
    ctx.closePath();

    // Draw paddles
    leftPaddle.draw();
    rightPaddle.draw();

    setTimeout(moveBall, Ball.speed);
}

// Create canvas
var canvas = document.createElement("canvas");

canvas.width = getWindowWidth() - 25;
canvas.height = getWindowHeight() - 25;

// Get a 2D context with which to draw on canvas
var ctx = canvas.getContext("2d");

// Global vars
var x = 0, y = 0; // ball position
var x_delta = 0, y_delta = 0; // how to move the ball
var max = Ball.radius; // approx. distance to move each frame

// Start things off

var leftPaddle = new Paddle(Paddle.distanceFromEdge, (canvas.height - Paddle.height) / 2);
var rightPaddle = new Paddle(canvas.width - (Paddle.width + Paddle.distanceFromEdge), (canvas.height - Paddle.height) / 2);

//var ball = new Ball();

// Append the canvas object onto the page
document.body.appendChild(canvas);

resetBall();

setTimeout(moveBall, Ball.speed);
