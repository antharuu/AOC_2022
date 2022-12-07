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
                    } else {
                        // if path.length > 1 then remove the last path
                        if (path.length > 1) path.pop();
                    }
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
    const folders: Folders = {"/": 0};

    files.forEach(file => {
        if (file.path) {
            const paths = file.path.split("/");
            paths.forEach((path, index) => {
                if (path === "" || path === "/") return;
                const p = paths.slice(0, index + 1).join("/");
                if (!folders[p]) folders[p] = 0;
                folders[p] += file.size;
            })
        }

        folders["/"] += file.size;
    });

    return folders;
}

function getSize(folders: Folders): number {
    let totalSize = 0;

    Object.keys(folders).forEach(path => {
        const size = folders[path];
        if (size <= 100000) totalSize += size;
    });

    return totalSize;
}

function getSizeToFree(folders: Folders) {
    const foldersCanDelete: Folders = {},
        totalDiskSize = 70000000,
        requiredDiskSize = 30000000,
        rootSize = folders["/"],
        unusedSpace = totalDiskSize - rootSize,
        sizeToFree = requiredDiskSize - unusedSpace;

    Object.keys(folders).forEach(path => {
        // if a folder is bigger than sizeToFree then it can be deleted
        if (folders[path] > sizeToFree) foldersCanDelete[path] = folders[path];
    });

    // return the smallest folder size
    return Math.min(...Object.values(foldersCanDelete));
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const resp = await fetch(`http://localhost:8000/api/get_input/7`);
    if (resp.status === 404) return new Response("Not found", {status: 404});
    const lines: string[] = await resp.json();

    const folders: Folders = getFolders(getFiles(lines));

    const parsedLines = getSize(folders);
    const sizeToRemove = getSizeToFree(folders);

    return new Response(JSON.stringify({
        parsedLines,
        sizeToRemove
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
