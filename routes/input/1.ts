import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../../src/Input.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const data: string = await Input.get(1);

    // get each line in an array of lines (split on newline)
    const lines: string[] = data.split("\n").map((line) => line.trim());

    // group lines into groups separated by empty lines
    const groups: number[][] = [];
    let group: number[] = [];
    for (const line of lines) {
        if (line === "") {
            groups.push(group);
            group = [];
        } else group.push(parseInt(line));
    }

    return new Response(
        JSON.stringify(groups),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
