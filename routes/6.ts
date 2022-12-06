import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

// get the 4 chars after the offset
const getSection = (line: string, offset: number) => line.substr(offset, 4);

// check if the section has 2 times the same char in all 4 chars
function hasDoubleChar(section: string) {
    let hasDouble = false;
    for (let i = 0; i < section.length; i++) {
        const char = section[i];
        const rest = section.substr(i + 1);
        if (rest.includes(char)) {
            hasDouble = true;
            break;
        }
    }
    return hasDouble;
}

function getFirstCharSection(line: string) {
    let offset = 0;
    let section = getSection(line, offset);
    while (hasDoubleChar(section)) {
        offset++;
        section = getSection(line, offset);
    }
    return offset + 4;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/6`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const {line}: { line: string } = await resp.json();

    const first = getFirstCharSection(line);

    return new Response(JSON.stringify({
        first
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
