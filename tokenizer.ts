export type NUM = {
    type: "NUM", value: number;
};
export type PLUS = {
    type: "PLUS";
};
export type MINUS = {
    type: "MINUS";
};
export type TIMES = {
    type: "TIMES";
};
export type DIVIDE = {
    type: "DIVIDE";
};
export type POW = {
    type: "POW";
};
export type LPAREN = {
    type: "LPAREN";
};
export type RPAREN = {
    type: "RPAREN";
};
export type Glyph = PLUS | MINUS | TIMES | DIVIDE | POW | LPAREN | RPAREN;
export type Token = NUM | Glyph;

const numTokenizer = {
    name: "numTokenizer",
    re: /^[0-9]+/,
    process: (s: string): NUM => {
        return { type: "NUM", value: Number(s) };
    }
};

const glyphTokenizer = {
    name: "glyphTokenizer",
    re: /^\*\*|[-+*/()]/,
    process: (s: string): Glyph => {
        switch (s) {
            case "+":
                return { "type": "PLUS" };
            case "-":
                return { "type": "MINUS" };
            case "*":
                return { "type": "TIMES" };
            case "/":
                return { "type": "DIVIDE" };
            case "**":
                return { "type": "POW" };
            case "(":
                return { "type": "LPAREN" };
            case ")":
                return { "type": "RPAREN" };
            default:
                throw `Unknown glyph ${s}`;;
        }
    }
};

export function tokenize(source: string) {
    const tokenStream = tokenGenerator(source);
    return [...tokenStream];
}

export function* tokenGenerator(source: string, debug = false): Generator<Token, void, unknown> {
    let i = consumeWhitespace(source, 0);
    while (i < source.length) {
        if (debug) {
            console.log(`i = ${i}`);
        }
        let success = false;
        for (const tokenizer of [numTokenizer, glyphTokenizer]) {
            const result = tokenizer.re.exec(source.slice(i));
            if (result !== null) {
                if (debug) {
                    console.log(`${tokenizer.name} found ${result}.`);
                }
                if (result[0].length === 0) {
                    throw "Result has length 0!";
                }
                success = true;
                i += result[0].length;
                i = consumeWhitespace(source, i);
                const token = tokenizer.process(result[0]);
                yield token;
                break;
            }
        }
        if (!success) {
            // console.log(`${source}\n${" ".repeat(i)}^`);
            throw `Parse error at position ${i}.`;
        }
    }
    return;
}

function consumeWhitespace(source: string, i: number) {
    let ws = /^\s*/;
    const result = ws.exec(source.slice(i));
    if (result === null) {
        throw "This shouldn't be possible.";
    }
    else {
        return i + result[0].length;
    }
}

