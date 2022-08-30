import { tokenGenerator, InfixOp, PrefixOp } from "./tokenizer";

const precedence: Record<InfixOp, number> = {
    "-": 0, "+": 0, "*": 1, "/": 1, "**": 2
};

const associativity: ("LR" | "RL")[] = ["LR", "LR", "RL"];

export function parse(source: string, debug = false) {
    const tokenStream = tokenGenerator(source);
    const nums: number[] = [];
    const ops: InfixOp[] = [];

    function shouldReduce(op: InfixOp) {
        const prevOp = ops[ops.length - 1];
        const prec = precedence[op];
        if (prevOp == undefined) {
            return false;
        } else if (precedence[prevOp] > prec) {
            return true;
        } else if (precedence[prevOp] === prec && associativity[prec] === "LR") {
            return true;
        } else {
            return false;
        }
        // return prevOp !== undefined && precedence[prevOp] >= precedence[op];
    }

    function reduce() {
        const op = ops.pop();
        if (op === undefined) {
            throw "Reduce called with empty op stack!";
        }
        const y = nums.pop();
        const x = nums.pop();
        if (x === undefined || y === undefined) {
            throw "Not enough arguments!";
        }
        const z = applyBinOp(op, x, y);
        nums.push(z);
        if (debug) {
            console.log(`Reduced: ${x} ${op} ${y}.`);
            console.log(`nums = ${nums}, ops = ${ops}`);
        }
    }

    for (const token of tokenStream) {
        switch (token.type) {
            case "num":
                nums.push(token.value);
                if (debug) {
                    console.log(`Pushed ${token.value}.`);
                }
                break;
            case "prefixOp": {
                break;
            }
            case "infixOp": {
                const op = token.value;
                while (shouldReduce(op)) {
                    reduce();
                }
                ops.push(op);
                if (debug) {
                    console.log(`Pushed ${token.value}.`);
                    console.log(`nums = ${nums}, ops = ${ops}`);
                }
                break;
            }
        }
    }
    while (ops.length > 0) {
        reduce();
    };
    console.assert(nums.length === 1);
    return nums[0];
}

function applyBinOp(op: InfixOp, x: number, y: number) {
    switch (op) {
        case "-":
            return x - y;
        case "+":
            return x + y;
        case "/":
            return x / y;
        case "*":
            return x * y;
        case "**":
            return x ** y;
    }
}

function applyPrefixOp(op: PrefixOp, x: number) {
    switch (op) {
        case "pre-":
            return -x;
        case "pre+":
            return x;
    }
}