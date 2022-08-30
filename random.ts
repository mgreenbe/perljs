const a = 1664525;
const c = 1013904223;
const m = 2 ** 32;

export class LCG {
    seed: number;
    x: number;

    constructor(seed = 1234) {
        this.seed = seed;
        this.x = seed;
    };

    random() {
        this.x = (a * this.x + c) % m;
        return this.x / m;
    }
}

const rng = new LCG(666);
console.log(rng.random(), rng.random(), rng.random());