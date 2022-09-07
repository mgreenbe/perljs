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

    integer(a: number, b?: number) {
        if (b === undefined) {
            return Math.floor(a * this.random());
        }
        a = Math.ceil(a);
        b = Math.floor(b);
        if (b <= a) {
            throw "Must have Math.ceil(a) < Math.floor(b).";
        }
        return a + Math.floor((b - a) * this.random());
    }

    choice<T>(arr: T[]) {
        let n = arr.length;
        if (n == 0) {
            throw "Array must be nonempty.";
        }
        let i = this.integer(n);
        return arr[i];
    }
}

let rng = new LCG(666);
for (let i = 0; i < 20; i++){
    let x = rng.integer(1, 7)
    let y = rng.integer(1, 7)
    console.log(y*x, x)}