import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {

    const resp = await fetch(`file:///C:/Users/Death/projects/aoc_2022/assets/6.txt`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const line: string = (await resp.text()).trim();

    return new Response(
        JSON.stringify({line}),
        {
            status: 200,
            headers: {"content-type": "application/json"}
        }
    );
}
