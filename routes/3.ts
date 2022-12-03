import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

const Letters = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

type Compartment = {
    first: string,
    second: string,
}

function lineToCompartment(line: string): Compartment {
    // get line length
    const length = line.length;

    // get compartments
    const first = line.slice(0, length / 2);
    const second = line.slice(length / 2, length);

    // return compartments
    return {first, second};
}

const getCompartments = (lines: string[]): Compartment[] => lines.map(line => lineToCompartment(line));

function getCompartmentsLetters(compartments: Compartment[]): string[] {
    const letters: string[] = [];
    compartments.forEach(compartment => {
        // get the letter that appears in the both compartments
        const firstLetters = compartment.first.split('');
        const secondLetters = compartment.second.split('');

        // get the letter that appears in the both compartments
        const letter = firstLetters.find(letter => secondLetters.includes(letter));

        letters.push(letter || '');
    });
    return letters;
}

function getScore(letters: string[]) {
    let score = 0;
    letters.forEach((letter: string) => {
        score += Letters.indexOf(letter) + 1;
    });
    return score;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/3`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    let lines: string[] = await resp.json();

    const compartments = getCompartments(lines);
    const letters = getCompartmentsLetters(compartments);

    const result = getScore(letters);

    return new Response(JSON.stringify({
        "result": result
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
