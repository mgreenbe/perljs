import { tokenGenerator } from "./tokenizer";
import { expect, test } from "vitest";

test("Throw if no tokenizer matches.", () => {
    const num = { re: /^[0-9]+/, process: (s: string) => Number(s) };
    const op = { re: /^[-+]/ };
    const source = "45 - abc";
    const tokenStream = tokenGenerator(source);
    expect(() => { return [...tokenStream]; }).toThrow();
});