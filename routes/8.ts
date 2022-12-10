import {HandlerContext} from "https://deno.land/x/rutt@0.0.13/mod.ts";
import {Input} from "../src/Input.ts";

type Tree = number;
type Forest = Tree[][];
type TreeList = { [pos: string]: number };

function getForest(lines: string[]): Forest {
    const trees: Forest = [];

    lines.forEach((row) => {
        const treeRow: Tree[] = [];
        row.split("").forEach((tree) => {
            treeRow.push(parseInt(tree));
        });
        trees.push(treeRow);
    });

    return trees;
}

function getTree(trees: Forest, x: number, y: number) {
    return trees[y][x % trees[y].length];
}

function getOutlines(trees: Forest): TreeList {
    const list: TreeList = {};

    for (let y = 0; y < trees.length; y++) {
        for (let x = 0; x < trees[y].length; x++) {
            if (
                (y !== 0 && y !== trees.length - 1) &&
                (x !== 0 && x !== trees[y].length - 1)
            ) continue;

            list[`${x},${y}`] = getTree(trees, x, y);
        }
    }

    return list;
}

function hasTree(treeList: TreeList, x: number, y: number): boolean {
    return treeList.hasOwnProperty(`${x},${y}`);
}

function checkLeft(trees: Forest, x: number, y: number, tree: number) {
    let iX = 0;
    while (iX < x) {
        if (getTree(trees, iX, y) >= tree) {
            return false;
        }
        iX++;
    }

    return true;
}

function checkRight(trees: Forest, x: number, y: number, tree: number) {
    let iX = x + 1;
    while (iX < trees[y].length) {
        if (getTree(trees, iX, y) >= tree) {
            return false;
        }
        iX++;
    }

    return true;
}

function checkTop(trees: Forest, x: number, y: number, tree: number) {
    let iY = 0;
    while (iY < y) {
        if (getTree(trees, x, iY) >= tree) {
            return false;
        }
        iY++;
    }

    return true;
}

function checkBottom(trees: Forest, x: number, y: number, tree: number) {
    let iY = y + 1;
    while (iY < trees.length) {
        if (getTree(trees, x, iY) >= tree) {
            return false;
        }
        iY++;
    }

    return true;
}

function isVisible(trees: Forest, x: number, y: number): boolean {
    let visible = false;
    const tree = getTree(trees, x, y);

    visible = visible || checkLeft(trees, x, y, tree);
    visible = visible || checkRight(trees, x, y, tree);
    visible = visible || checkTop(trees, x, y, tree);
    visible = visible || checkBottom(trees, x, y, tree);

    return visible;
}

function getInnerTrees(trees: Forest, list: TreeList): TreeList {
    const innerTrees: TreeList = {};

    trees.forEach((row, y) => {
        row.forEach((tree, x) => {
            if (hasTree(list, x, y) || !isVisible(trees, x, y)) return;
            innerTrees[`${x},${y}`] = tree;
        });
    });

    return innerTrees;
}

function getVisibleOutsideTrees(trees: Forest): TreeList {
    let list: TreeList = getOutlines(trees);

    list = {...list, ...getInnerTrees(trees, list)};

    return list;
}

function getTreesTop(trees: Forest, x: number, y: number): Tree[] {
    const treesTop: Tree[] = [];

    let iY = 0;
    while (iY < y) {
        treesTop.push(getTree(trees, x, iY));
        iY++;
    }

    return treesTop.reverse();
}

function getTreesLeft(trees: Forest, x: number, y: number): Tree[] {
    const treesLeft: Tree[] = [];

    let iX = 0;
    while (iX < x) {
        treesLeft.push(getTree(trees, iX, y));
        iX++;
    }

    return treesLeft.reverse();
}

function getTreesRight(trees: Forest, x: number, y: number): Tree[] {
    const treesRight: Tree[] = [];

    let iX = x + 1;
    while (iX < trees[y].length) {
        treesRight.push(getTree(trees, iX, y));
        iX++;
    }

    return treesRight;
}

function getTreesBottom(trees: Forest, x: number, y: number): Tree[] {
    const treesBottom: Tree[] = [];

    let iY = y + 1;
    while (iY < trees.length) {
        treesBottom.push(getTree(trees, x, iY));
        iY++;
    }

    return treesBottom;
}

function keepVisible(mainTree: Tree, treesList: Tree[]): Tree[] {
    let lastTree = -1,
        broken = false;
    const visible: Tree[] = [];

    treesList.forEach((tree, i) => {
        if (broken) return;
        if (tree >= mainTree) {
            visible.push(tree);
            broken = true;
            return;
        }

        visible.push(tree);

        if (tree < lastTree) return;

        lastTree = tree;
    });

    return visible;
}

function getViewableTrees(trees: Forest) {
    let countVisible: { [pos: string]: number } = {};

    trees.forEach((row, y) => {
        row.forEach((tree, x) => {
            const top = keepVisible(tree, getTreesTop(trees, x, y));
            const left = keepVisible(tree, getTreesLeft(trees, x, y));
            const bottom = keepVisible(tree, getTreesBottom(trees, x, y));
            const right = keepVisible(tree, getTreesRight(trees, x, y));

            countVisible[`${x},${y}`] = top.length * left.length * bottom.length * right.length;
        });
    });

    return countVisible;
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const lines: string[] = await Input.getData(8) as string[];

    const trees: Forest = getForest(lines);

    const visibleOutsideTrees = getVisibleOutsideTrees(trees);
    const viewableTrees = getViewableTrees(trees);

    const count = Object.keys(visibleOutsideTrees).length;

    const max = Object.values(viewableTrees).reduce((a, b) => Math.max(a, b));

    return new Response(JSON.stringify({
        count,
        max
    }), {
        status: 200,
        headers: {
            "content-type": "application/json",
        }
    });
};
