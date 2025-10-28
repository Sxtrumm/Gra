const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
// pobieranie najwyzszego wyniku z local storage (jako liczba)
let highScore = parseInt(localStorage.getItem("high-score")) || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
scoreElement.innerText = `Score: ${score}`;

// funkcja zmieniajaca pozycje jedzenia
const changeFoodPosition = () => {
    // Pojawianie sie randomowo owocow 0 - 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
// funkcja obslugujaca koniec gry
const handleGameOver = () => {
    // czysczenie timera i restart srony 
    clearInterval(setIntervalId);
    alert("Game Over! Kliknij Ok by zrestartowac...");
    location.reload();
}
// funkcja strzalkowa zmieniajaca kierunek weza
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;

    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}" ></div>`;

    // sprawdza czy waz zjadl owoc
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //popycha jedzenie w obszar glowy weza
        score++; // zwieksza wynik o 1
        // aktualizuje wynik
        scoreElement.innerText = `Score: ${score}`;
        // aktualizuje najwyzszy wynik
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // aktualizuje polozenie weza
    snakeX += velocityX;
    snakeY += velocityY;
    // sprawdza czy waz zderza sie ze sciana
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // dodawanie diva dla pozsotaly czesci ciala snake
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // sprawdza czy waz zderza sie sam ze soba
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
