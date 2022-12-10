import { config } from 'https://deno.land/x/dotenv/mod.ts';

export class Input {

    static async get(day: number): Promise<string> {

        const ASSETS_DIRECTORY = config().ASSETS_DIRECTORY;
        return await Deno.readTextFile(`${ASSETS_DIRECTORY}/${day}.txt`);
    }

    static async getData(day: number): Promise<object> {
        const resp = await fetch(`http://localhost:8000/input/${day}`);
        if (resp.ok) return await resp.json();
        else throw new Error("Error getting input data");
    }

}