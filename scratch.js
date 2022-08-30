import {LCG} from "./random"
const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const ops = ["-", "+", "/", "*"]
const spaces = ["", " ", "  ", "   "]

const rng = new LCG();

function choice(arr) {
    const n = arr.length
    return arr[Math.floor(rng.random()*n)]
}

for (let j = 0; j < 10; j++) {
    let s = choice(spaces) + choice(digits) + choice(spaces)
    for (let i = 0; i < 7; i++) {
        s += choice(ops) + choice(spaces) + choice(digits) + choice(spaces);
    }
    console.log(s)
}