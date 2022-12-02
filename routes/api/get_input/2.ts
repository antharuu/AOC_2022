import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const resp = await fetch(`file:///C:/Users/Death/projects/aoc_2022/assets/2.txt`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const data: string = await resp.text();

    // get each line in an array of lines (split on newline)
    const lines: string[] = data.split("\n").map((line) => line.trim());

    return new Response(
        JSON.stringify(lines),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
