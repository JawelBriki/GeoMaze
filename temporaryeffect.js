export class TemporaryEffect {

    constructor(duration) {
        if (this.constructor === TemporaryEffect) {
            throw new Error('Abstract class TemporaryEffect cannot be instantiated');
        }
        this.duration = duration;
    }
}

export class Buff extends TemporaryEffect {

    constructor(duration) {
        super();
    }
}

export class Debuff extends TemporaryEffect {

    constructor(duration) {
        super();
    }
}