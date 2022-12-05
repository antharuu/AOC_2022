import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const resp = await fetch(`file:///C:/Users/Death/projects/aoc_2022/assets/5.txt`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const data: string = await resp.text();

    // get lines
    const [_, lines]: string[] = data.split("\r\n\r\n");

    const columns: string[][] = [
        ["N", "R", "G", "P"],
        ["J", "T", "B", "L", "F", "G", "D", "C"],
        ["M", "S", "V"],
        ["L", "S", "R", "C", "Z", "P"],
        ["P", "S", "L", "V", "C", "W", "D", "Q"],
        ["C", "T", "N", "W", "D", "M", "S"],
        ["H", "D", "G", "W", "P"],
        ["Z", "L", "P", "H", "S", "C", "M", "V"],
        ["R", "P", "F", "L", "W", "G", "Z"]
    ]

    const instructions: { move: number, from: number, to: number }[] = lines.split("\r\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line: string) => {
            if (typeof line === "string") {
                // get the move, from and to value from "move 14 from 6 to 1" type of string with regex
                const [_, move, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/) || [];
                return {
                    move: parseInt(move) || 0,
                    from: parseInt(from) || 0,
                    to: parseInt(to) || 0,
                }
            }

            return {move: 0, from: 0, to: 0};
        });

    return new Response(
        JSON.stringify({columns, instructions}),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
