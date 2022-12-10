import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../src/Input.ts";


export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const lines: string[] = await Input.getData(9) as string[];

    return new Response(JSON.stringify({
        "???": "???"
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
