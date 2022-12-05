import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";


const getLinesArray = (lines: { start: number; end: number }[][]) => lines.map(
    (line) => line.map(
        (item) => Array.from({length: item.end - item.start + 1},
            (_, i) => i + item.start)
    )
);

function getFullyContainedPairs(linesArray: number[][][]): number {
    let count = 0;

    linesArray.forEach((pairs) => {
        const [first, second] = pairs;

        // remove the items that are in the second range
        const firstFiltered = first.filter((item) => !second.includes(item));

        // remove the items that are in the first range
        const secondFiltered = second.filter((item) => !first.includes(item));

        // if one of the ranges is empty, then there are no fully contained pairs
        if (firstFiltered.length === 0 || secondFiltered.length === 0) count++;
    });

    return count;
}

function getOverlappingPairs(linesArray: number[][][]): number {
    let count = 0;

    linesArray.forEach((pairs) => {
        const [first, second] = pairs;

        // get the items that are in both ranges
        const overlapping = first.filter((item) => second.includes(item));

        // if the overlapping array is empty, then there are no overlapping pairs
        if (overlapping.length > 0) count++;
    });

    return count;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/4`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const lines: { start: number, end: number }[][] = await resp.json();

    const linesArray: number[][][] = getLinesArray(lines);

    const result = getFullyContainedPairs(linesArray);
    const result2 = getOverlappingPairs(linesArray);

    return new Response(JSON.stringify({
        result,
        result2
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
