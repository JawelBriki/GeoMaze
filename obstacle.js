export class Obstacle {

    constructor(x, y, width, height, speedX, speedY, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type;
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.type === "exit" ? "#00ff00" : (this.type === "deathwall" ? "#7df9ff" : "#000000");
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.restore();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    checkCollisionWithWalls(canvasWidth, canvasHeight) {
        if ((this.x + this.width) >= canvasWidth) {
            this.speedX = -this.speedX;
            this.x = canvasWidth - this.width;
        }
        if (this.x <= 0) {
            this.speedX = -this.speedX;
            this.x = 0;
        }
        if ((this.y + this.height) >= canvasHeight) {
            this.speedY = -this.speedY;
            this.y = canvasHeight - this.height;
        }
        if (this.y <= 0) {
            this.speedY = -this.speedY;
            this.y = 0;
        }
    }
}