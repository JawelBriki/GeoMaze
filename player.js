export default class Player {

    constructor(x, y, width, height, color, controls, id) {
        this.x = x;
        this.y = y;
        this.startingX = this.id % 2 === 0 ? this.width : 0;
        this.startingY = this.id > 2 ? this.height : 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.controls = controls;
        this.baseSpeed = 3;
        this.speedX = 0;
        this.speedY = 0;
        this.id = id;
        this.score = 0;
        this.passedLevel = false;
    }

    static keyMap = {
        'KeyW': {axis: 'y', direction: -1, controls: 'ZQSD'},
        'KeyO': {axis: 'y', direction: -1, controls: 'OKLM'},
        'ArrowUp': {axis: 'y', direction: -1, controls: 'Arrows'},
        'Numpad8': {axis: 'y', direction: -1, controls: 'Numpad'},
        'KeyS': {axis: 'y', direction: 1, controls: 'ZQSD'},
        'KeyL': {axis: 'y', direction: 1, controls: 'OKLM'},
        'ArrowDown': {axis: 'y', direction: 1, controls: 'Arrows'},
        'Numpad2': {axis: 'y', direction: 1, controls: 'Numpad'},
        'KeyA': {axis: 'x', direction: -1, controls: 'ZQSD'},
        'KeyK': {axis: 'x', direction: -1, controls: 'OKLM'},
        'ArrowLeft': {axis: 'x', direction: -1, controls: 'Arrows'},
        'Numpad4': {axis: 'x', direction: -1, controls: 'Numpad'},
        'KeyD': {axis: 'x', direction: 1, controls: 'ZQSD'},
        'Semicolon': {axis: 'x', direction: 1, controls: 'OKLM'},
        'ArrowRight': {axis: 'x', direction: 1, controls: 'Arrows'},
        'Numpad6': {axis: 'x', direction: 1, controls: 'Numpad'}
    };

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.restore();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    updateSpeed(key, controls, pressed) {
        if (Player.keyMap[key] && Player.keyMap[key].controls === this.controls) {
            const {axis, direction} = Player.keyMap[key];
            this[axis === 'x' ? 'speedX' : 'speedY'] = pressed ? direction * this.baseSpeed : 0;
        }
    }

    givePoints() {
        this.score += Math.max(1, Math.round(100 / parseInt(document.querySelector("#timer span").innerHTML)));
        document.querySelector(`#player${this.id}-score span`).innerHTML = this.score;
    }

    checkCollisionWithWalls(canvasWidth, canvasHeight) {
        if ((this.x + this.width) >= canvasWidth) {
            this.speedX = 0;
            this.x = canvasWidth - this.width;
        }
        if (this.x <= 0) {
            this.speedX = 0;
            this.x = 0;
        }
        if ((this.y + this.height) >= canvasHeight) {
            this.speedY = 0;
            this.y = canvasHeight - this.height;
        }
        if (this.y <= 0) {
            this.speedY = 0;
            this.y = 0;
        }
    }

    checkCollisionWithPlayers(players) {
        for (let i = 0; i < players.length; i++) {
            const otherPlayer = players[i];
            if (otherPlayer === this) return; // Skip self-collision

            if (this.x < otherPlayer.x + otherPlayer.width &&
                this.x + this.width > otherPlayer.x &&
                this.y < otherPlayer.y + otherPlayer.height &&
                this.y + this.height > otherPlayer.y) {

                // Collision detected!

                // Calculate the overlap on each axis
                console.log(`${this.id} pushed ${otherPlayer.id}`);
                const overlapX = Math.min(this.x + this.width, otherPlayer.x + otherPlayer.width) - Math.max(this.x, otherPlayer.x);
                const overlapY = Math.min(this.y + this.height, otherPlayer.y + otherPlayer.height) - Math.max(this.y, otherPlayer.y);

                // Determine the collision direction based on the smallest overlap
                if (overlapX < overlapY) {
                    // Collision is primarily horizontal
                    if (this.x < otherPlayer.x) {
                        // this player is to the left of the other player
                        this.x -= overlapX;
                    } else {
                        // this player is to the right of the other player
                        this.x += overlapX;
                    }
                    if (otherPlayer.speedX === 0) {
                        otherPlayer.speedX = this.speedX;
                    }
                } else {
                    // Collision is primarily vertical
                    if (this.y < otherPlayer.y) {
                        // this player is above the other player
                        this.y -= overlapY;
                    } else {
                        // this player is below the other player
                        this.y += overlapY;
                    }
                    if (otherPlayer.speedY === 0) {
                        otherPlayer.speedY = this.speedY;
                    }
                }
            }
        }
    }

    checkCollisionWithObstacles(obstacles) {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];


            if (this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x && this.y < obstacle.y + obstacle.height && this.y + this.height > obstacle.y) {
                // Collision detected!

                if (obstacle.type === "exit") {
                    this.passedLevel = true;
                    this.givePoints();
                    return;
                }

                if (obstacle.type === "deathwall") {
                    this.x = this.startingX;
                    this.y = this.startingY;
                    return;
                }

                // Calculate the overlap on each axis
                const overlapX = Math.min(this.x + this.width, obstacle.x + obstacle.width) - Math.max(this.x, obstacle.x);
                const overlapY = Math.min(this.y + this.height, obstacle.y + obstacle.height) - Math.max(this.y, obstacle.y);

                // Determine the collision direction based on the smallest overlap
                if (overlapX < overlapY) {
                    // Collision is primarily horizontal
                    if (this.x < obstacle.x) {
                        // this player is to the left of the obstacle
                        this.x -= overlapX;
                        this.speedX = 0;
                    }
                    else {
                        // this player is to the right of the obstacle
                        this.x += overlapX;
                        this.speedX = 0;
                    }
                }
                else {
                    // Collision is primarily vertical
                    if (this.y < obstacle.y) {
                        // this player is above the obstacle
                        this.y -= overlapY;
                        this.speedY = 0;
                    }
                    else {
                        // this player is below the obstacle
                        this.y += overlapY;
                        this.speedY = 0;
                    }
                }
            }
        }
    }
}