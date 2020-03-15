/** CONSTANTS **/
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR ="grey" ;
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOR = "red";

let button = document.getElementById("start");
var gameCanvas = document.getElementById("gameCanvas");//getting canvas html element
var ctx = gameCanvas.getContext("2d");//getting context to draw with

let dx=10;//movement setting values
let dy=0;
let lastDirection//remember what the last direction was since we dont want to allow 180's on the same line

let gameRunning=false;
let snake=[];
let game;
let food={};
let score=0;
button.addEventListener("click", function () {
    init();
});

/**
 *function to start the game
 **/
function init() {
    score=0;
    //declare starting snake array
    dy=0;
    dx=10;//start snake going right
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ]

    food = {x: Math.floor(Math.random() * 29) * 10, y: Math.floor(Math.random() * 29) * 10}
    console.log('the first food: ' + food.x, food.y);


    //  Select the colour to fill the canvas
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokestyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

    if(!gameRunning) {//boolean added here since if you press reset while already playing you dont want more
        //intervals set
        game = setInterval(function () {
                advanceSnake();
                draw();
            }
            , 100
        )
    }
    gameRunning=true;//
}

/**
 * Advances the snake by appending a new "head" or front of the array from the chosen direction
 * from the keydown event listener while
 * cutting off the "tail" or last index of the array
 */
function advanceSnake() {
    //setting last direction so game wont allow the snake to turn around in one move
    if(dx===-10)
    {
        lastDirection="left";
    }
    if(dx===10)
    {
        lastDirection="right";
    }
    if(dy===-10)
    {
        lastDirection="up";
    }
    if(dy===10)
    {
        lastDirection="down";
    }

    let newHead = {x: snake[0].x + dx, y: snake[0].y + dy};//calculating new head coordinates

    //game over condition
    if(newHead.x<0||newHead.x>290||newHead.y<0||newHead.y>290) {

        button.innerHTML = "reset";

        clearInterval(game);
        gameRunning=false;
    }

    if (checkCollision(snake))
    {
        button.innerHTML = "reset";
        clearInterval(game);
        gameRunning=false;
    }

    if (newHead.x===food.x&&newHead.y===food.y)//food was eaten
    {
        score++;
        let scoreElement = document.getElementById("score");
        scoreElement.innerText = "Score: "+score;
        snake.unshift(newHead);


        //to keep food from spawning on the snake
        let colliding = true;
        while(colliding) {
            colliding = false;
            food= {x: Math.floor(Math.random() * 29)*10, y:Math.floor(Math.random() *29)*10}
            for (let box of snake) {
                if (food.x == box.x && food.y == box.y) {
                    colliding = true;
                    break;
                }
            }
        }


    }
    else{
        //food was not eaten so "moving" snake here
        snake.unshift(newHead);
        snake.pop();
    }


}

/**
 *checks for collision with itself
 * if there is a collision return false, otherwise return true
 **/
function checkCollision(snake)
{
    let head=snake[0];//get the head to check for collisions with the rest of snake
    for(let i=1;i<snake.length;i++)//i must start at 1 since we check head against itself below which will always be true
    {
        //console.log("head.x: "+head.x+" head.y: "+head.y+" snake.x: "+snake[i].x+" snake.y: "+snake[i].y)
        if(head.x===snake[i].x&&head.y===snake[i].y)//collision with itself check
        {

            return true;
        }
    }
    //looped over whole snake and found no collisions so return true
    return false;
}

/**
 * Draws the snake on the canvas
 */
function draw() {
    //reset the canvas to get rid of the old snake drawing
    ctx.fillStyle=CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

    //draw food
    ctx.fillStyle=FOOD_COLOR;
    ctx.fillRect(food.x,food.y,10,10 );

    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    for(let i = 0;i<snake.length;i++)//drawing snake
    {
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
        ctx.strokeRect(snake[i].x, snake[i].y, 10, 10);
    }

}

addEventListener("keydown",setDirection);
/**
 * sets the next direction based on keystrokes
 * @param the event that initiated the call
 */
function setDirection(event){
    // if(event.key=='ArrowDown' && dy!==-10) use to have it like this but it allows for a 180 turn
    // if you are able to press the buttons fast enough(between the interval time) so lastDirection was implemented
    //which is set in the advanceSnake function
    if(event.key=='ArrowDown' && lastDirection!=="up")
    {
        dy=10;
        dx=0;

    }
    if(event.key=='ArrowUp'&& lastDirection!=="down")
    {
        dy=-10;
        dx=0;
    }
    if(event.key=='ArrowRight'&& lastDirection!=="left")
    {
        dx=10;
        dy=0;
    }
    if(event.key=='ArrowLeft'&& lastDirection!=="right")
    {
        dx=-10;
        dy=0;
    }
}
init();
