import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/1`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const groups: number[][] = await resp.json();

    // get an array of sums of each group
    const sums = groups.map((group) =>
        group.reduce((num_1, num_2) => num_1 + num_2, 0));

    // order the sums from greatest to least
    sums.sort((a, b) => b - a);

    // get the greatest sum
    const maxTotal: number = Math.max(...sums);

    // get the sum of the first 3 greatest sums
    const maxThree: number = sums.slice(0, 3).reduce((num_1, num_2) => num_1 + num_2, 0);

    return new Response(JSON.stringify({
        "max": maxTotal,
        "max_three": maxThree,
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
