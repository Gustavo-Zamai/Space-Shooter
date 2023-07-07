const ship = document.querySelector('.player');
const playArea = document.querySelector('#gameArea');
const aliensImg = ['image/bad1.png', 'image/bad2.png', 'image/bad3.png', 'image/bad4.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
let score = 0;

//MOVE AND SHOOT
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();

    }else if(event.key === 'ArromRight'){
        event.preventDefault();
        moveRight();
    }else if(event.key === 'ArrowLeft'){
        event.preventDefault();
        moveLeft();
    }else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//go UP
function moveUp() {
    let topPosition = getComputedStyle(ship).getPropertyValue('top');
    if(topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 30;
        ship.style.top = `${position}px`;
    }
}

//go DOWN
function moveDown() {
    let topPosition = getComputedStyle(ship).getPropertyValue('top');
    if(topPosition === "540px"){
        return
    } else {
        let position = parseInt(topPosition);
        position += 30;
        ship.style.top = `${position}px`;
    }
}

//FIRE
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(ship).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(ship).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'image/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { 
            if(checkLaserCollision(laser, alien)) {
                alien.src = 'image/smallExplosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                score ++;
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 5}px`;
        }
    }, 10);
}

//RANDOM ENEMIES
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //RANDOM IMAGE
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//MOVE ENEMIES
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

//COLLISION
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//START
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}


//GAME OVER
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert(`You Lose!\nBetter Luck Next Time!\n Your Score:${score}`);
        ship.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}