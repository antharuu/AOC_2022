import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../src/Input.ts";

enum Type {
    NOOP,
    ADDX
}

type Instruction = {
    type: Type.NOOP,
    cycles: 1
} | {
    type: Type.ADDX,
    value: number,
    cycles: 2
} | false;

function getInputs(lines: string[]): Instruction[] {
    return lines.map(line => {
        const [type, value] = line.split(" ");
        if (type === "noop") {
            return {type: Type.NOOP, cycles: 1};
        } else {
            return {type: Type.ADDX, value: parseInt(value), cycles: 2};
        }
    });
}

function getCycles(inputs: Instruction[]) {
    const cycles: Instruction[] = [];
    let c = 0;
    inputs.forEach(input => {
        if (input) {
            c += input.cycles ?? 0;
            cycles[c] = input ?? false;
        }
    });

    // replace undefined with false from 1 to 240
    for (let i = 1; i <= 240; i++) cycles[i] = cycles[i] ?? false;

    return cycles;
}

function getResults(inputs: Instruction[]) {
    let X = 1;
    const cycles: Instruction[] = getCycles(inputs),
        lfCycles = [20, 60, 100, 140, 180, 220],
        cycleSignals: number[] = [];
    cycles.forEach((input, c) => {
        if (input) {
            if (input.type === Type.ADDX) {
                X += input.value;
            }
        }
        const C = c + 1;
        if (lfCycles.includes(C)) {
            cycleSignals.push(X * C);
        }
    });

    return cycleSignals.reduce((a, b) => a + b, 0);
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const lines: string[] = await Input.getData(10) as string[];
    const inputs = getInputs(lines);

    const result = getResults(inputs);

    return new Response(JSON.stringify({
        result
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
