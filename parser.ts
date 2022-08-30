import { tokenGenerator, OpLiteral } from "./tokenizer";

const precedence: Record<OpLiteral, number> = {
    "-": 0, "+": 0, "*": 1, "/": 1, "**": 2
};

const associativity: Record<OpLiteral, "left" | "right"> = {
    "-": "left", "+": "left", "*": "left", "/": "left", "**": "right"
};

export function parse(source: string, debug = false) {
    const tokenStream = tokenGenerator(source);
    const nums: number[] = [];
    const ops: OpLiteral[] = [];

    function shouldReduce(op: OpLiteral) {
        const prevOp = ops[ops.length - 1];
        return prevOp !== undefined && precedence[prevOp] >= precedence[op];
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
        const z = applyOp(op, x, y);
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
            case "op": {
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

function applyOp(op: OpLiteral, x: number, y: number) {
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