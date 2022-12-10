import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../../src/Input.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const line = await Input.get(6);

    return new Response(
        JSON.stringify({line}),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
