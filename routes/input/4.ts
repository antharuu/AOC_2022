import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../../src/Input.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const data = await Input.get(4);

    // get each line in an array of lines (split on newline)
    const lines: { start: number, end: number }[][] = data.split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => (
            line.split(",").map((item) => {
                const [start, end] = item.split("-");
                return {
                    start: parseInt(start),
                    end: parseInt(end)
                };
            }))
        );

    return new Response(
        JSON.stringify(lines),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
