import { tokenize, Token } from "./tokenizer";

class Parser {
    tokens: Token[];
    i: number;

    constructor(source: string) {
        this.tokens = tokenize(source);
        this.i = 0;
    }

    peek() {
        const token = this.tokens[this.i];
        if (token === undefined) {
            return null;
        }
        return token;
    }

    next() {
        const token = this.tokens[this.i];
        if (token === undefined) {
            return null;
        }
        this.i++;
        return token;
    }

    number() {
        const token = this.peek();
        if (token === null || token.type !== "NUM") {
            return null;
        }
        this.next();
        return token.value;
    };

    _plus_or_minus() {
        let token = this.peek();
        if (token !== null && (token.type === "PLUS" || token.type === "MINUS")) {
            this.next();
            return token.type;
        }
        return null;
    }

    additive() {
        let x = this.multiplicative();
        if (x === null) {
            return null;
        }
        let op: "PLUS" | "MINUS" | null;
        while (op = this._plus_or_minus()) {
            const y = this.multiplicative();
            if (y === null) {
                throw "Expected a number!";
            }
            if (op === "PLUS") {
                x += y;
            } else {
                x -= y;
            }
        }
        return x;
    }

    _times_or_divide() {
        let token = this.peek();
        if (token !== null && (token.type === "TIMES" || token.type === "DIVIDE")) {
            this.next();
            return token.type;
        }
        return null;
    }

    multiplicative() {
        let x = this.number();
        if (x === null) {
            return null;
        }
        let op: "TIMES" | "DIVIDE" | null;
        while (op = this._times_or_divide()) {
            const y = this.number();
            if (y === null) {
                throw "Expected a number!";
            }
            if (op === "TIMES") {
                x *= y;
            } else {
                x /= y;
            }
        }
        return x;
    }


}

const source = "2*6 + 4*2 - 25*4*2/10";
const parser = new Parser(source);
console.log(parser.additive());