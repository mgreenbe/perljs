import { tokenGenerator } from "./tokenizer";
import { expect, test } from "vitest";

test("Throw if no tokenizer matches.", () => {
    const source = "45 - abc";
    const tokenStream = tokenGenerator(source);
    expect(() => { return [...tokenStream]; }).toThrow();
});