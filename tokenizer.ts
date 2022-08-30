export type NumToken = {
    type: "num", value: number;
};

export type PrefixOp = "pre+" | "pre-";
export type PrefixOpToken = {
    type: "prefixOp", value: PrefixOp;
};

export type InfixOp = "+" | "-" | "*" | "/" | "**";
export type InfixOpToken = {
    type: "infixOp", value: InfixOp;
};

export type Token = NumToken | PrefixOpToken | InfixOpToken;

const numTokenizer = {
    name: "numTokenizer",
    re: /^[0-9]+/,
    process: (s: string, prevToken: Token | null): NumToken => {
        return { type: "num", value: Number(s) };
    }
};

const opTokenizer = {
    name: "opTokenizer",
    re: /^\*\*|[-+*/]/,
    process: (s: string, prevToken: Token | null): PrefixOpToken | InfixOpToken => {
        if (s === "-" || s === "+" || s === "*" || s === "/" || s === "**") {
            return { type: "infixOp", value: s };
        } else { throw `Unknown operator ${s}`; };
    }
};

export function* tokenGenerator(source: string, debug = false): Generator<Token, void, unknown> {
    let i = consumeWhitespace(source, 0);
    let token: Token | null = null;
    while (i < source.length) {
        if (debug) {
            console.log(`i = ${i}`);
        }
        let success = false;
        for (const tokenizer of [numTokenizer, opTokenizer]) {
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
                token = tokenizer.process(result[0], token);
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