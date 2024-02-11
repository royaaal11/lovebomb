const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameContainer = document.getElementById('game-container');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const notes = [
    261.63,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88
];

const heartPattern = [
    "00110001100",
    "01111011110",
    "11111111111",
    "11111111111",
    "11111111111",
    "01111111110",
    "00111111100",
    "00011111000",
    "00001110000",
    "00000100000"
];

let interval;
let gameOver = false;
let paddleWidth = 100;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let startdx = 2;
let startdy = -2;
let dx = startdx;
let dy = startdy;
let hitCounter = 0;
let brickRowCount = heartPattern.length;
let brickColumnCount = heartPattern[0].length;
let brickWidth = 40;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 75;
let brickOffsetLeft = (canvas.width - (brickWidth + brickPadding) * brickColumnCount) / 2;
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
let score = 0;


startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    gameContainer.style.backgroundColor = '#f8d8d8';
    gameOver = false;
    score = 0;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {

            if (heartPattern[r][c] === "1") {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r] = { x: brickX, y: brickY, status: 1 };
            } else {
                bricks[c][r] = { status: 0 };
            }
        }
    }
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    interval = setInterval(updateGame, 10);
}

function restartGame() {
    clearInterval(interval);
    startGame();
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameOver = true;
            clearInterval(interval);
            showRestartButton();
        }
    }

    x += dx;
    y += dy;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let canvasRect = canvas.getBoundingClientRect();
    let relativeX = e.clientX - canvasRect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    hitCounter++; 
                    if (hitCounter === 10) {
                        ballSpeed();
                        hitCounter = 0;
                    }
                    if (score === 70) {
                        alert('Congratulations! You win!');
                        document.location.reload();
                    }
                    displayPic();
                    playNote();
                }
            }
        }
    }
}


function ballSpeed() {
    dx *= 1.1;
    dy *= 1.1;
}
const winButton = document.getElementById('win-button');
winButton.addEventListener('click', endGame);

function endGame() {
    winGame();
    document.location.reload();
}

function winGame() {
    if (confirm('Congratulations! You win! Click OK for a SURPRISE!!!.')) {
        const url = 'index.html'

        const width = 1000;
        const height = 1000;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        const options = {
            width: width,
            height: height,
            left: left,
            top: top,
            resizable: 'yes',
            scrollbars: 'yes',
            toolbar: 'no',
            menubar: 'no',
            location: 'no',
            status: 'no'
        };

        window.open(url, '_blank', Object.entries(options).map(([key, value]) => `${key}=${value}`).join(','));
    } else {
        document.location.reload();
    }
}
function displayPic() {
    const image = document.createElement('img');
    const heartColors = ['heart.webp', 'dsa.png', 'bluengina.png']; 
    const randomColorIndex = Math.floor(Math.random() * heartColors.length); 
    image.src = heartColors[randomColorIndex]; 


    const randomWidth = Math.floor(Math.random() * 100) + 50;
    const randomHeight = Math.floor(Math.random() * 100) + 50;
    const randomOpacity = Math.random() * 0.5 + 0.3;
    const aspectRatio = image.width / image.height;

    let scale;
    if (aspectRatio >= 1) {
        scale = randomWidth / image.width;
    } else {
        scale = randomHeight / image.height;
    }
    const scaledWidth = Math.round(image.width * scale);
    const scaledHeight = Math.round(image.height * scale);

    image.style.position = 'absolute';
    image.style.left = Math.random() * (window.innerWidth - scaledWidth) + 'px'; // Random horizontal position
    image.style.top = Math.random() * (window.innerHeight - scaledHeight) + 'px'; // Random vertical position
    image.style.width = scaledWidth + 'px';
    image.style.height = scaledHeight + 'px';
    image.style.opacity = randomOpacity;

    document.body.appendChild(image);

    let opacity = randomOpacity;
    const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        image.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            image.remove();
        }
    }, 100); 
}
function playNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    const frequency = notes[randomIndex];
    const oscillator = audioContext.createOscillator();
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    
    setTimeout(() => {
        oscillator.stop();
    }, 100);
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function showRestartButton() {
    restartButton.style.display = 'block';
    gameContainer.style.backgroundColor = '#ffcccc';
}
