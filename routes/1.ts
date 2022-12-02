import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/1`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const groups: number[][] = await resp.json();

    // get an array of sums of each group
    let sums = groups.map((group) =>
        group.reduce((num_1, num_2) => num_1 + num_2, 0));

    // get the greatest sum
    let max: number = Math.max(...sums);

    return new Response(JSON.stringify({
        "max": max,
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
