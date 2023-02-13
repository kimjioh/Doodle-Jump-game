const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
const scoreDisplay =document.querySelector('.result');
let platformCount = 5;
let platforms = [];
let i = 0;
let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let isJumping = true;
let upTimerId;
let downTimerId;
let leftTimerId;
let rightTimerId;
let score = 0;
let isGameOver = false;
let isGoingLeft = false;
let isGoingRight = false;


class Platform{
    constructor (platformBottom){
        this.bottom = platformBottom; //20
        this.left = Math.random() * 315;
        this.visual = document.createElement('div');


        const visual = this.visual;
        visual.classList.add('platform');
        visual.classList.add(String(i));
        visual.style.left = this.left + 'px';
        visual.style.backfaceVisibility = this.bottom + 'px';
        grid.appendChild(visual);
    }
};

function createPlatform() {
    for (i = 0; i < platformCount; i++){
        let platformGap = 600 / platformCount;
        let platformBottom = 100 + (i * platformGap);
        let newPlatforms = new Platform(platformBottom);
        platforms.push(newPlatforms);
        // console.log(platform);
    }
}
 
function movePlatforms() {

    if(doodlerBottomSpace > 125){
        platforms.forEach(platform => {
            platform.bottom -= 4
            let visual = platform.visual;
            visual.style.bottom = platform.bottom + 'px';
    
            if(platform.bottom < 10) {
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove('platform');
                platforms.shift()
                let addnewPlatform = new Platform(600);
                platforms.push(addnewPlatform);
            }
        })
    }
    
    /* for(i = 0; i<platforms.length; i++){
        platform = platforms[i]; 

        platform.bottom -= 4 //16
        let visual = platform.visual; //기존div
        visual.style.bottom = platform.bottom + 'px';
        //새로생성된div의 bottom css는 = 16 + px =16px

        if(platform.bottom < 10) {
            let firstPlatform = platforms[0].visual;
            firstPlatform.classList.remove('platform');
            platforms.shift()
            let addnewPlatform = new Platform(600);
            platforms.push(addnewPlatform);
        }
    } */


}

function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';

}

function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if(doodlerBottomSpace > startPoint + 200){
            fall()
        }
    }, 30)
}

function fall(){
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function (){
        doodlerBottomSpace -= 5;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if(doodlerBottomSpace <= 0){
            GameOver();
        };
        platforms.forEach(platform => {
            if((doodlerBottomSpace >= platform.bottom) &&
            (doodlerBottomSpace <= platform.bottom + 15) &&
            ((doodlerLeftSpace + 60) >= platform.left) && 
            (doodlerLeftSpace <= platform.left + 85) &&
            !isJumping){
                score ++;
                scoreDisplay.innerHTML = score;
                startPoint = doodlerBottomSpace;
                jump();
            }
        })

    }, 30)
}

function GameOver(){
    isGameOver = true;
    while(grid.firstChild){
        grid.removeChild(grid.firstChild);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

}

function control(e){
   if(e.key === 'ArrowLeft'){
        moveLeft()
   } else if(e.key === 'ArrowRight'){
        moveRight()
   } else if(e.key === 'ArrowUp'){
        moveStright()
   }
}

function moveStright() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
}

function moveLeft(){
    if(isGoingRight){
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function(){
        if(doodlerLeftSpace >= 0){
            doodlerLeftSpace -= 5;
            doodler.style.left = doodlerLeftSpace + 'px';
        } else {
            moveRight()
        }
    }, 20)
}

function moveRight(){
    if(isGoingLeft){
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function (){
        if(doodlerLeftSpace <= 340){
            doodlerLeftSpace += 5;
            doodler.style.left = doodlerLeftSpace + 'px';
        } else {
            moveLeft();
        }
    }, 20)
}

function startGame() {
    createPlatform();
    createDoodler();
    setInterval(movePlatforms, 500);
    jump();
    document.addEventListener('keyup', control);
}

startGame();