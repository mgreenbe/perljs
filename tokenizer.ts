export type OpLiteral = "+" | "-" | "*" | "/" | "**";

export type NumToken = {
    type: "num", value: number;
};

export type OpToken = {
    type: "op", value: OpLiteral;
};

const numTokenizer = {
    name: "numTokenizer",
    re: /^[0-9]+/,
    process: (s: string): NumToken => {
        return { type: "num", value: Number(s) };
    }
};

const opTokenizer = {
    name: "opTokenizer",
    re: /^\*\*|[-+*/]/,
    process: (s: string): OpToken => {
        if (s === "-" || s === "+" || s === "*" || s === "/" || s === "**") {
            return { type: "op", value: s };
        } else { throw `Unknown operator ${s}`; };
    }
};

export function* tokenGenerator(source: string, debug = false) {
    let i = consumeWhitespace(source, 0);
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
                yield tokenizer.process(result[0]);
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