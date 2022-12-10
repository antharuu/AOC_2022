import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../../src/Input.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const data = await Input.get(2);

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
