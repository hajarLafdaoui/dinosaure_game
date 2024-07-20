// board
let board;
let boardWidth = 570;
let boardHeight = 300;
let context;

// dinosaur 
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactus4Width = 69;
let cactus5Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;
let cactus4Img;
let cactus5Img;

// cloud
let cloudsArr = [];
let cloudWidth = 80;
let cloudHeight = 60;
let cloudX = 90;
let cloudY = 50;
let cloud1Img;
let cloud2Img;
let cloud3Img;

//physics
let velocityX = -8; //cactus moving to the left
let velocityY = 0;  //for jumping by default is 0 (no jumping)
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") //getContext("2d") tells the computer you want to draw in two dimensions—width and height.

    // dino
    dinoImg = new Image();
    dinoImg.src = "images/dino.png"
    //When the image is loaded, it places the dinosaur image at the coordinates (dino.x, dino.y) on the board, and scales the image to the specified dino.width and dino.height.
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // cactus
    cactus1Img = new Image();
    cactus1Img.src = "images/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "images/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "images/cactus3.png";

    cactus4Img = new Image();
    cactus4Img.src = "images/big-cactus1.png";

    cactus5Img = new Image();
    cactus5Img.src = "images/big-cactus2.png";

    // clouds
    cloud1Img = new Image();
    cloud1Img.src = "images/cloud.png"

    cloud2Img = new Image();
    cloud2Img.src = "images/cloud.png"

    cloud3Img = new Image();
    cloud3Img.src = "images/cloud.png"

    // requestAnimationFrame(update); is like asking the browser to help you make something move smoothly on the screen by repeatedly calling a function (update) that updates the animation. 

    
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000); // Set interval to place cacti
        setInterval(placeClouds, 5000);
        document.addEventListener("keydown", moveDino);
    
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        context.fillStyle = "black";
        context.font = "30px Arial";
        let gameOverTextWidth = context.measureText("Game Over").width;
        let scoreTextWidth = context.measureText("Score: " + score).width;

        // Calculate center coordinates
        let gameOverX = (boardWidth - gameOverTextWidth) / 2;
        let gameOverY = boardHeight / 2;
        let scoreX = (boardWidth - scoreTextWidth) / 2;
        let scoreY = gameOverY + 40; // Adjust the vertical position

        context.fillText("Game Over", gameOverX, gameOverY);
        context.fillText("Score: " + score, scoreX, scoreY);
        return;
    }

    // reset the canvas to not have repeated cactus
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // to make the dinosaur fall when it jumps
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    // Draw each cactus 
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX; //Because velocityX is negative it means that we subtract it from x position to make the cactus moves 

        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "images/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Move and draw clouds
    for (let i = 0; i < cloudsArr.length; i++) {
        let cloud = cloudsArr[i];
        cloud.x += velocityX * 0.7; // Clouds might move slower than cacti for a parallax effect

        context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    }

    // Place clouds periodically
    if (Math.random() > 0.95) { // Adjust this threshold as needed
        placeClouds();
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText("Score:" + score, 5, 20);
}

// key events
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // Jump
        velocityY = -10;
    }
}


// Function to place cactus obstacles
function placeCactus() {
    if (gameOver) {
        return;
    }

    // Logic to determine which cactus to place
    let placeCactusChance = Math.random(); // Generates a random number between 0 and 1

    // Choose the type of cactus based on probability
    if (placeCactusChance > 0.90) { // 10% chance for cactus4
        let cactus4 = {
            img: cactus4Img,
            x: cactusX,
            y: cactusY,
            width: cactus4Width,
            height: cactusHeight
        };
        cactusArray.push(cactus4);
    } else if (placeCactusChance > 0.70) { // 20% chance for cactus5
        let cactus5 = {
            img: cactus5Img,
            x: cactusX,
            y: cactusY,
            width: cactus5Width,
            height: cactusHeight
        };
        cactusArray.push(cactus5);
    } else if (placeCactusChance > 0.50) { // 20% chance for cactus3
        let cactus3 = {
            img: cactus3Img,
            x: cactusX,
            y: cactusY,
            width: cactus3Width,
            height: cactusHeight
        };
        cactusArray.push(cactus3);
    } else if (placeCactusChance > 0.30) { // 20% chance for cactus2
        let cactus2 = {
            img: cactus2Img,
            x: cactusX,
            y: cactusY,
            width: cactus2Width,
            height: cactusHeight
        };
        cactusArray.push(cactus2);
    } else { // 30% chance for cactus1
        let cactus1 = {
            img: cactus1Img,
            x: cactusX,
            y: cactusY,
            width: cactus1Width,
            height: cactusHeight
        };
        cactusArray.push(cactus1);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); // Remove the first element from the array to prevent it from growing indefinitely
    }
}

function placeClouds() {
    // Randomly generate the number of clouds to place (between 1 and 3)
    let numClouds = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numClouds; i++) {
        // Random x and y coordinates for the new cloud
        let randomX = Math.random() * (boardWidth - cloudWidth); // Random x position within the board width
        let randomY = Math.random() * (boardHeight / 2 - cloudHeight); // Random y position in the top half of the board

        let newCloud = {
            img: null,
            x: randomX,
            y: randomY,
            width: cloudWidth,
            height: cloudHeight
        };

        let cloudType = Math.floor(Math.random() * 3) + 1; // Randomly choose a cloud image
        if (cloudType === 1) {
            newCloud.img = cloud1Img;
        } else if (cloudType === 2) {
            newCloud.img = cloud2Img;
        } else {
            newCloud.img = cloud3Img;
        }

        cloudsArr.push(newCloud);
    }

    // Remove excess clouds if more than 3 are present
    while (cloudsArr.length > 3) {
        cloudsArr.shift(); // Remove the first cloud
    }
}


// function is used to determine whether two objects are colliding with each other in a 2D space.(dino and cactus)
function detectCollision(a, b) {

    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&       //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&      //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;        //a's bottom left corner passes b's top left corner
}
