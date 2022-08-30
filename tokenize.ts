import fs from "node:fs";
import readline from "node:readline";

async function processLineByLine() {
    const fileStream = fs.createReadStream("comments.pl");

    const lines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let line_num = 0;
    for await (const line of lines) {
        line_num++;
        const tokens: string[] = tokenizeLine(line);
        console.log(tokens);
    }
}

function consumeWhitespace(s: string, i: number) {
    let j: number;
    for (j = i; j < s.length; j++) {
        if (s[j] !== " ") {
            break;
        }
    }
    return j;
}

const DELIMS = ["(", ")", "[", "]", "{", "}"];
const SIGILS = ["@", "#", "$"];

function tokenizeLine(line: string) {
    line = line.trimEnd();
    let i = 0;
    const tokens: string[] = [];
    loop: while (i < line.length) {
        i = consumeWhitespace(line, i);
        const c = line[i];
        if (c == "#") {
            break;
        } else if (DELIMS.includes(c)) {
            tokens.push(c);
            i++;
        } else if (SIGILS.includes(c)) {
            const j = consumeIdentifier(line, i + 1);
            tokens.push(`${line[i]}${line.slice(i + 1, j)}`);
            i = j;
        }
        switch (line[i]) {
            case "#":
                break loop;
            case ";":
                tokens.push(";");
                i++;
                break;
            case "$":
            case "@":
            case "%":
                const j = consumeIdentifier(line, i + 1);
                tokens.push(`${line[i]}${line.slice(i + 1, j)}`);
                i = j;
                break;
            case ",":
                tokens.push(",");
                i += 1;
                break;
            case "(":
                tokens.push("(");
                i += 1;
                break;
            case ")":
                tokens.push(")");
                i += 1;
                break;
            case "[":
                tokens.push("[");
                i += 1;
                break;
            case "]":
                tokens.push("]");
                i += 1;
                break;
            case "{":
                tokens.push("{");
                i += 1;
                break;
            case "}":
                tokens.push("}");
                i += 1;
                break;
        }
    }
    return tokens;
}
// processLineByLine();

function startsWithDigit(s: string) {
    return s.charCodeAt(0) >= 48 && s.charCodeAt(0) < 58;
};

function startsWithLetter(s: string) {
    const c = s.charCodeAt(0);
    return (c >= 65 && c < 91) || (c >= 97 && c < 123);
};

function consumeIdentifier(s: string, i: number) {
    let j: number;
    for (j = i; j < s.length; j++) {
        if (!startsWithDigit(s[j]) && !startsWithLetter(s[j]) && s[j] !== "_") {
            break;
        }
    }
    return j;
}

let line = ";; ($my_ident ) [@hi_mom123; ]{}%hash; $";
let i = 0;
let tokens = tokenizeLine(line);
console.log(tokens);