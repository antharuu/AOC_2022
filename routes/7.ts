import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";

type File = {
    name: string,
    path: string,
    size: number,
}
type Folders = { [key: string]: number }

function getFiles(lines: string[]): File[] {
    const path: string[] = [],
        files: File[] = [];

    lines.forEach(line => {

        // if line start with "$" then it's a command
        if (line.startsWith("$ ")) {
            // if line start with "$ cd" then it's a path
            if (line.startsWith("$ cd ")) {
                const m = /^\$ cd (?<folder>.*)/g.exec(line);
                if (m) {
                    const folder = m.groups?.folder;
                    if (folder && folder !== '..') {
                        if (folder !== "/") folder.replace(/^\//, '');
                        path.push(folder);
                    } else path.pop();
                }
            }
        } else {
            // if line not start with "dir " then it's a file
            if (!line.startsWith("dir ")) {
                const m = /(?<size>\d+)\s+(?<name>.*)/g.exec(line);
                if (m) {
                    const {size, name} = m.groups as { [key: string]: string };
                    files.push({
                        name,
                        size: parseInt(size),
                        path: path.join("/").replace(/^\/\//, ''),
                    } as File);
                }
            }
        }

    });

    return files;
}

function getFolders(files: File[]): Folders {
    const folders: Folders = {};

    files.forEach(file => {
        if (file.path) {
            const paths = file.path.split("/");
            paths.forEach((path, index) => {
                if (path === "") return;
                const p = paths.slice(0, index + 1).join("/");
                if (!folders[p]) folders[p] = 0;
                folders[p] += file.size;
            })
        }
    });

    return folders;
}

function getSize(lines: string[]): number {
    const files: File[] = getFiles(lines);

    const folders: Folders = getFolders(files);

    let totalSize = 0;

    Object.keys(folders).forEach(path => {
        const size = folders[path];
        if (size <= 100000) totalSize += size;
    });

    return totalSize;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/7`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const lines: string[] = await resp.json();

    const parsedLines = getSize(lines);

    return new Response(JSON.stringify({
        parsedLines
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
