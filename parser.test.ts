import { Parser } from "./parser";
import { expect, test, describe } from "vitest";

describe("Random arithmetic expressions", () => {
    const sources = [
        "45 - 23",
        "4 /  8 -  4+ 6*  8 + 4   -   9   /  7",
        " 3  +  7 -   5- 3 /1   *   6  +  4   -   9 -   8   - 4- 6 ",
        "  2* ((3))*   (4   *  5 +5+   2   /  9)   /  (4+  9*   6)   + 9   ",
        "( (  ( ( 3)) )* ( (4 +   5)) - ((6   - 7)/ (  8 + 9) )  )",
        "2 ** 3 ** 4"
    ];
    for (let source of sources) {
        test(source,
            () => {
                const parser = new Parser(source);
                expect(parser.additive()).toBeCloseTo(eval(source));
            });
    }
});

describe("Exponentials", () => {
    test("+-+2**-+-+-2", () => {
        let source = "+-+2**-+-+-2";
        const parser = new Parser(source);
        expect(parser.additive()).toBeCloseTo(-0.25);
    });
});