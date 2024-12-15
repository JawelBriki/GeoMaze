import Player from "./player.js";
import Level from "./level.js"

let canvas, ctx, w, h;
let currentLevel, timerInterval;

const players = [];
const playerSize = 30;

window.addEventListener("load", function() {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    titleScreen();
});

function updateTimer() {
    let timer = document.querySelector("#timer span");
    let currentTime = parseInt(timer.innerHTML);
    currentTime++;
    timer.innerHTML = currentTime.toString();
}

function titleScreen() {
    const numPlayersButtons = document.querySelectorAll('input[name="players"]');
    const playerColors = document.getElementById("colors");
    const playerControls = document.getElementById("controls");
    let numPlayers;

    numPlayersButtons.forEach(button => {
        button.addEventListener('change', () => {
            document.querySelector("#menuMusic").play();
            numPlayers = parseInt(document.querySelector('input[name="players"]:checked').value);

            playerControls.innerHTML = '';
            playerColors.innerHTML = '';

            for (let i=1; i<=numPlayers; i++) {
                const colorLabel = document.createElement('label');
                colorLabel.textContent = `Player ${i} Color`;
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.id = `p${i}-color`;
                colorInput.value = "#FF0000";
                playerColors.appendChild(colorLabel);
                playerColors.appendChild(colorInput);

                const controlLabel = document.createElement('label');
                controlLabel.textContent = `Player ${i} Controls`;
                const controlSelect = document.createElement('select');
                controlSelect.id = `p${i}-controls`;
                const controlOptions = ['ZQSD', 'Arrows', 'Numpad', 'OKLM'];
                controlOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    controlSelect.appendChild(optionElement);
                });
                playerControls.appendChild(controlLabel);
                playerControls.appendChild(controlSelect);
            }
        });
    });

    const startButton = document.getElementById('startgame');
    startButton.addEventListener("click", () => {
        document.querySelector("#menuMusic").pause();
        let settings = [];
        for (let i=1; i<=numPlayers; i++) {
            const colorSelector = `#p${i}-color`;
            const color = document.querySelector(colorSelector).value;
            const controlSelector = `#p${i}-controls`;
            const controls = document.querySelector(controlSelector).value;
            settings.push({color: color, controls: controls});
        }
        setupGame(settings);
    });
}

function showCountdown(value, func) {
    if (value === 0) {
        timerInterval = setInterval(updateTimer, 1000);
        func();
        return;
    }
    ctx.save();

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.font = "100px Verdana";
    ctx.fillText(value.toString(), 950, 410);

    ctx.restore();

    return setTimeout(() => showCountdown(value-1, func), 1000);
}

function setupGame(settings) {
    let startingPositions = [{x: 0, y: 0}, {x: playerSize, y: 0}, {x: 0, y: playerSize}, {x: playerSize, y: playerSize}];
    let i = 0;
    for (let setting of settings) {
        players.push(new Player(startingPositions[i].x, startingPositions[i].y, playerSize, playerSize, setting.color, setting.controls, i+1));
        i++;
        let playerScoreElement = document.getElementById(`player${i}-score`);
        playerScoreElement.style.display = "inline";
        playerScoreElement.style.fontWeight = "bold";
        playerScoreElement.style.color = setting.color;
        if (i > 1) {
            document.getElementById(`sep${i}`).hidden = false;
            document.getElementById(`sep${i}`).style.fontWeight = "bold";
        }
    }

    canvas.hidden = false;
    document.getElementById("gamestatus").hidden = false;
    document.getElementById("menu").hidden = true;

    // Add the movement keys listeners
    addEventListener('keydown', (event) => {
        players.forEach((player) => {
            player.updateSpeed(event.code, player.controls, true);
        });
    });
    addEventListener('keyup', (event) => {
        players.forEach((player) => {
            player.updateSpeed(event.code, player.controls, false);
        });
    });

    currentLevel = new Level();
    document.querySelector("#level1Music").play();
    showCountdown(3, main);
}

function main() {
    ctx.clearRect(0 ,0 , w, h);

    currentLevel.draw(ctx);

    currentLevel.obstacles.forEach( (obstacle) => {
        obstacle.move();
        obstacle.checkCollisionWithWalls(w, h);
    });

    players.forEach( (player) => {
        if (!player.passedLevel) {
            player.draw(ctx);
            player.move();
        }
    });

    players.forEach( (player) => {
        if (!player.passedLevel) {
            player.checkCollisionWithWalls(w, h);
            player.checkCollisionWithPlayers(players);
            player.checkCollisionWithObstacles(currentLevel.obstacles);
        }
    });



    if (players.filter(player => player.passedLevel).length === players.length) {
        if (currentLevel.currentLevel === 10) {
            document.querySelector("#level10Music").pause();
            document.querySelector("#winMusic").play();
            let x = 450;
            let y = 300;
            ctx.save();

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "black";
            ctx.font = "100px Verdana";
            ctx.fillText("GAME OVER", x, y);

            players.forEach( (player) => {
                ctx.fillStyle = player.color;
                ctx.fillText(`Player ${player.id}: ${player.score}`, x, y + player.id * 125);
            });

            ctx.restore();
            return;
        }
        currentLevel.nextLevel();
        players.forEach( (player) => {
            player.passedLevel = false;
            player.x = player.startingX;
            player.y = player.startingY;
        });
        clearInterval(timerInterval);
        showCountdown(3, () => requestAnimationFrame(main));
        return;
    }

    requestAnimationFrame(main);
}