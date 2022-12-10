import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../src/Input.ts";

type Column = string[];

type Instruction = { move: number; from: number; to: number };

function rearrange(columns: Column[], instructions: Instruction[], reverse = true): Column[] {
    instructions.forEach(({move, from, to}) => {
        const quantity = move;
        const fromColumn = columns[from - 1];
        const toColumn = columns[to - 1];

        const items = fromColumn.splice(fromColumn.length - quantity, quantity);

        if (reverse) items.reverse();

        toColumn.push(...items);
    });

    return columns;
}

type ColInstr = { columns: Column[], instructions: Instruction[] };

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const {columns, instructions}: ColInstr = await Input.getData(5) as ColInstr;

    // create a copy of the columns
    const columns2 = JSON.parse(JSON.stringify(columns));

    const result = rearrange(columns, instructions);
    const result2 = rearrange(columns2, instructions, false);

    // get all last items from each column
    const lastItems = result.map((column) => column[column.length - 1]).join("");
    const lastItems2 = result2.map((column) => column[column.length - 1]).join("");

    return new Response(JSON.stringify({
        lastItems,
        lastItems2
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
