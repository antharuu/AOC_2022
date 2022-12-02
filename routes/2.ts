import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

class Rock {
    static enemyLetter = "A";
    static playerLetter = "X";
    name = "Rock";
    score = 1;
    winAgainst = "Scissors";
    loseAgainst = "Paper";
}

class Paper {
    static enemyLetter = "B";
    static playerLetter = "Y";
    name = "Paper";
    score = 2;
    winAgainst = "Rock";
    loseAgainst = "Scissors";
}

class Scissors {
    static enemyLetter = "C";
    static playerLetter = "Z";
    name = "Scissors";
    score = 3;
    winAgainst = "Paper";
    loseAgainst = "Rock";
}

function getHand(letter: string): Hand {
    switch (letter.trim()) {
        case Rock.enemyLetter:
        case Rock.playerLetter:
        case "Rock":
            return new Rock();
        case Paper.enemyLetter:
        case Paper.playerLetter:
        case "Paper":
            return new Paper();
        case Scissors.enemyLetter:
        case Scissors.playerLetter:
        case "Scissors":
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

function changePlayerHand(playerHandLetter: string, enemyHand: Hand): Hand {

    switch (playerHandLetter.trim()) {
        case "Rock":
            return getHand(enemyHand.winAgainst);
        case "Paper":
            return getHand(enemyHand.name);
        case "Scissors":
            return getHand(enemyHand.loseAgainst);
    }

    throw new Error(`Invalid player hand letter: ${playerHandLetter}`);
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/2`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    let lines: string[] = await resp.json();

    // each line first character is the enemy's letter hand, and the last is the player's letter hand
    const scores: number[] = []
    const scores2: number[] = []

    // for each line, calculate the score
    lines.forEach((line) => {
        if (line.trim() === "") return;

        const enemyHand = getHand(line[0]);
        const playerHand = getHand(line[line.length - 1]);

        scores.push(getScore(enemyHand, playerHand));
        scores2.push(getScore(enemyHand, changePlayerHand(playerHand.name, enemyHand)));
    });

    // Get sum of each scores
    const totalScores = scores.reduce((a, b) => a + b, 0);
    const totalNewScores = scores2.reduce((a, b) => a + b, 0);

    return new Response(JSON.stringify({
        totalScores,
        totalNewScores
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
