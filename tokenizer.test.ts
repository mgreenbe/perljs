import { tokenGenerator } from "./tokenizer";
import { expect, test } from "vitest";

test("Throw if no tokenizer matches.", () => {
    const source = "45 - abc";
    const tokenStream = tokenGenerator(source);
    expect(() => { return [...tokenStream]; }).toThrow();
});

test("Equalities", () => {
    const source = "12 == 34 != 56";
    const tokenStream = tokenGenerator(source);
    const tokens = [...tokenStream];
    expect(tokens).toEqual(
        [
            { type: 'NUM', value: 12 },
            { type: 'EQ' },
            { type: 'NUM', value: 34 },
            { type: 'NEQ' },
            { type: 'NUM', value: 56 }
        ]
    );
});