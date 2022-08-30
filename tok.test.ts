import { tokenGenerator } from "./tokenizer";
import { parse } from "./parser";
import { expect, test } from "vitest";


test("Throw if no tokenizer matches.", () => {
    const num = { re: /^[0-9]+/, process: (s: string) => Number(s) };
    const op = { re: /^[-+]/ };
    const source = "45 - abc";
    const tokenStream = tokenGenerator(source);
    expect(() => { return [...tokenStream]; }).toThrow();
});


test('45 - 23 is tokenized correctly.', () => {
    const source = "45 - 23";
    const tokenStream = tokenGenerator(source);
    const tokens = [...tokenStream];
    expect(tokens).toEqual([{
        "type": "num",
        "value": 45,
    },
    {
        "type": "infixOp",
        "value": "-",
    },
    {
        "type": "num",
        "value": 23,
    }]);
});

test("4 /  8 -  4+ 6*  8 + 4   -   9   /  7", () => {
    const source = "4 /  8 -  4+ 6*  8 + 4   -   9   /  7";
    expect(parse(source)).toBeCloseTo(4 / 8 - 4 + 6 * 8 + 4 - 9 / 7);
});

test(" 6*   2+ 8- 3 / 9 /   4   +   9  +1 ", () => {
    const source = " 6*   2+ 8- 3 / 9 /   4   +   9  +1 ";
    expect(parse(source)).toBeCloseTo(6 * 2 + 8 - 3 / 9 / 4 + 9 + 1);
});

test(" 7   + 6 * 8   *8*  4-   4   -5+   3  +   3  -6 -6 ", () => {
    const source = " 7   + 6 * 8   *8*  4-   4   -5+   3  +   3  -6 -6 ";
    expect(parse(source)).toBeCloseTo(7 + 6 * 8 * 8 * 4 - 4 - 5 + 3 + 3 - 6 - 6);
});

test(" 3  +  7 -   5- 3 /1   *   6  +  4   -   9 -   8   - 4- 6 ", () => {
    const source = " 3  +  7 -   5- 3 /1   *   6  +  4   -   9 -   8   - 4- 6 ";
    expect(parse(source)).toBeCloseTo(3 + 7 - 5 - 3 / 1 * 6 + 4 - 9 - 8 - 4 - 6);
});

test("  2* 3+   4   *  5 +5+   2   /  9   /  4+  9*   6   + 9   ", () => {
    const source = "  2* 3+   4   *  5 +5+   2   /  9   /  4+  9*   6   + 9   ";
    expect(parse(source)).toBeCloseTo(2 * 3 + 4 * 5 + 5 + 2 / 9 / 4 + 9 * 6 + 9);
});

test("4 * 3 ** 2", () => {
    const source = "4 * 3 ** 2";
    expect(parse(source)).toBeCloseTo(4 * 3 ** 2);
});

test("4 ** 3 ** 2", () => {
    const source = "4 ** 3 ** 2";
    expect(parse(source)).toBeCloseTo(4 ** 3 ** 2);
});
