let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 51; // width/height ratio = 17/12 (adjusted size)
let birdHeight = 36; 
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 60; // adjusted for better gameplay experience
let pipeHeight = 500; // adjusted for better gameplay experience
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2.2; // pipes moving left speed
let velocityY = 0;  // bird jump speed
let gravity = 0.4; 

// game over
let gameOver = false;

// score
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load Bird Image
    birdImg = new Image();
    birdImg.onload = function() {
       context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    birdImg.src = "./grandfather.png";

    // Load Pipe Images
    topPipeImg = new Image();
    topPipeImg.onload = function() {
        // Now that the top pipe image has loaded, start the game loop
        requestAnimationFrame(update);
    }
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Set up event listeners
    setInterval(placePipes, 1500); // every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    board.addEventListener("touchstart", touchHandler);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
            break;
        }
    }

    // clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // bird
    velocityY += gravity;
    bird.y += velocityY;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height || bird.y < 0){
        gameOver = true;
    }

    // Check for game over
    if (gameOver) {
        gameOverLogic();
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver){
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    // Randomize the opening space size between 80 and 150 pixels
    let openingSpace = 80 + Math.random() * 70;

    // Calculate the minimum and maximum Y positions for the opening
    let minOpeningY = boardHeight / 4;
    let maxOpeningY = boardHeight - minOpeningY - openingSpace;

    // Generate a random Y position for the opening
    let randomOpeningY = minOpeningY + Math.random() * (maxOpeningY - minOpeningY);

    // Create the top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomOpeningY - pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    // Create the bottom pipe
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomOpeningY + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    // Add the pipes to the pipe array
    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}



function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        // jump
        velocityY = -6;

        // reset game
        if(gameOver){
            resetGame();
        }
    }
}

function touchHandler(event) {
    event.preventDefault();
    // jump
    velocityY = -6;

    // reset game
    if(gameOver){
        resetGame();
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityY = 0;
    gameOver = false;
}

function gameOverLogic() {
    console.log("Game Over!");
    // Additional game over logic can be added here
}
