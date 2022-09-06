import { tokenize, Token } from "./tokenizer";

export class Parser {
    tokens: Token[];
    i: number;

    constructor(source: string) {
        this.tokens = tokenize(source);
        this.i = 0;
    }

    primary(): number {
        const t = this.tokens[this.i];
        if (t?.type === "NUM") {
            this.i++;
            return t.value;
        } else if (t?.type === "LPAREN") {
            return this.paren();
        } else {
            throw "Expected NUM or LPAREN!";
        }
    }

    additive() {
        let x = this.multiplicative();
        while (true) {
            const t = this.tokens[this.i];
            if (t?.type === "PLUS" || t?.type === "MINUS") {
                this.i++;
                const y = this.multiplicative();
                if (t.type === "PLUS") {
                    x += y;
                } else {
                    t.type;
                    x -= y;
                }
            } else {
                return x;
            }
        }
    }

    multiplicative() {
        let x = this.unary();
        while (true) {
            const t = this.tokens[this.i];
            if (t?.type === "TIMES" || t?.type === "DIVIDE") {
                this.i++;
                const y = this.unary();
                if (t.type === "TIMES") {
                    x *= y;
                } else {
                    x /= y;
                }
            } else {
                return x;
            }
        }
    }


    paren() {
        const lparen = this.tokens[this.i];
        if (lparen?.type !== "LPAREN") {
            throw "Expected LPAREN!";
        }
        this.i++;
        const x = this.additive();
        const rparen = this.tokens[this.i];
        if (rparen?.type !== "RPAREN") {
            throw "Expected RPAREN!";
        }
        this.i++;
        return x;
    }

    unary(): number {
        const t = this.tokens[this.i];
        if (t?.type === "PLUS" || t?.type === "MINUS") {
            this.i++;
            const x = this.unary();
            return t.type === "PLUS" ? x : -x;
        } else {
            try {
                return this.pow();
            } catch {
                throw "Expected unary expression!";
            }

        }
    }

    pow(): number {
        const x = this.primary();
        const xs = [x];
        while (true) {
            const t = this.tokens[this.i];
            if (t?.type === "POW") {
                this.i++;
                const y = this.unary(); // sic
                xs.push(y);
            } else {
                break;
            }
        }
        let n = xs.length;
        let z = xs[n - 1];
        for (let j = n - 2; j >= 0; j--) {
            z = xs[j] ** z;
        }
        return z;
    }
}

// const source = "-+-3*((--5 - 1)*+2 + (2+3)*4)";
// const source = "3*2--(1+2)";
// const source = "((((3)))*((4 + 5)) - ((6 - 7)/(8 + 9)))";
const source = "---2**-2";
const parser = new Parser(source);
console.log(parser.additive());
