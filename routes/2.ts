import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

class Rock {
    static enemyLetter = "A";
    static playerLetter = "X";
    name = "Rock";
    score = 1;
    winAgainst = "Scissors";
}

class Paper {
    static enemyLetter = "B";
    static playerLetter = "Y";
    name = "Paper";
    score = 2;
    winAgainst = "Rock";
}

class Scissors {
    static enemyLetter = "C";
    static playerLetter = "Z";
    name = "Scissors";
    score = 3;
    winAgainst = "Paper";
}

function getHand(letter: string): Hand {
    switch (letter.toUpperCase().trim()) {
        case Rock.enemyLetter:
        case Rock.playerLetter:
            return new Rock();
        case Paper.enemyLetter:
        case Paper.playerLetter:
            return new Paper();
        case Scissors.enemyLetter:
        case Scissors.playerLetter:
            return new Scissors();
    }

    throw new Error(`Invalid hand letter: ${letter}`);
}

type Hand = Rock | Paper | Scissors;

const resultScore = {
    win: 6,
    lose: 0,
    draw: 3
}

function getScore(enemyHand: Hand, playerHand: Hand) {
    let roundScore = 0;

    if (enemyHand.name === playerHand.name) roundScore += resultScore.draw;
    else if (enemyHand.winAgainst === playerHand.name) roundScore += resultScore.lose;
    else if (playerHand.winAgainst === enemyHand.name) roundScore += resultScore.win;

    return roundScore + playerHand.score;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/2`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    let lines: string[] = await resp.json();

    // each line first character is the enemy's letter hand, and the last is the player's letter hand
    const scores: number[] = []

    // for each line, calculate the score
    lines.forEach((line) => {
        if (line.trim() === "") return;

        const enemyHand = getHand(line[0]);
        const playerHand = getHand(line[line.length - 1]);

        scores.push(getScore(enemyHand, playerHand));
    });

    // sum all the scores
    const totalScore = scores.reduce((a, b) => a + b, 0);

    return new Response(JSON.stringify({
        totalScore
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
