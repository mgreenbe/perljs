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

const rng = new LCG(666);

class Expr {
    m: number;
    M: number;
    seed?: number;
    rng: LCG;

    constructor(m: number, M: number, seed?: number) {
        this.m = m;
        this.M = M;
        this.seed = seed;
        this.rng = new LCG(seed);
    }

    primary() {
        return this.rng.integer(this.m, this.M);
    }



}

let expr = new Expr(-9, 10);
for (let i = 0; i < 200; i++)
    console.log(expr.primary());