import { Obstacle } from "./obstacle.js";

export default class Level {
    constructor() {
        this.obstacles =
            [new Obstacle(900,360, 100, 100, 0, 0, "wall"),
            new Obstacle(1840, 760, 60, 60, 0, 0, "exit")]; // Level 1 already initialized

        this.currentLevel = 1;

        fetch("./levels.json")
            .then(response => response.json())
            .then(data => this.levelsData = data);
    }

    draw(ctx) {
        this.obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
    }

    nextLevel() {
        this.currentLevel++;

        if (this.currentLevel <= 4) {
            document.querySelector("#level1Music").pause();
            document.querySelector("#level2to4Music").play();
        }
        else if (this.currentLevel <= 9) {
            document.querySelector("#level2to4Music").pause();
            document.querySelector("#level5to9Music").play();
        }
        else if (this.currentLevel === 10) {
            document.querySelector("#level5to9Music").pause();
            document.querySelector("#level10Music").play();
        }
        this.obstacles = this.levelsData[this.currentLevel].map( (element) => {
            return new Obstacle(element.x, element.y, element.width, element.height, element.speedX, element.speedY, element.type)
        });

        document.querySelector("#timer span").innerHTML = "0";
        document.querySelector("#level span").innerHTML = this.currentLevel.toString();
    }

}