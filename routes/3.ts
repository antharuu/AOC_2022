import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../src/Input.ts";

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

function getGroups(lines: string[]): string[][] {
    const groups: string[][] = [];
    let group: string[] = [];

    [...lines, ""].forEach((line: string) => {
        if (group.length === 3) {
            groups.push(group);
            group = [];
        }
        group.push(line);
    });
    return groups;
}

function getGroupsLetters(groups: string[][]): string[] {
    const letters: string[] = [];
    groups.forEach(group => {
        // get the letter that appears in the all groups
        const firstLetters = group[0].split('');
        const secondLetters = group[1].split('');
        const thirdLetters = group[2].split('');

        // get the letter that appears in the all groups
        const letter = firstLetters.find(letter => secondLetters.includes(letter) && thirdLetters.includes(letter));

        letters.push(letter || '');
    });
    return letters;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    let lines: string[] = await Input.getData(3) as string[];

    const compartments = getCompartments(lines);
    const letters = getCompartmentsLetters(compartments);

    const groups = getGroups(lines);
    const groupsLetters = getGroupsLetters(groups);

    const result = getScore(letters);
    const resultGroups = getScore(groupsLetters);

    return new Response(JSON.stringify({
        result,
        resultGroups
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
