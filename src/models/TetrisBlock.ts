import { Field } from "./Field";

export class TetrisBlock {
    private fields = [];
    constructor(private dir: string) {}
}

export class SquareBlock extends TetrisBlock {}


export function createSquareBlock(tileWidth: number, tileHeight: number) {
    return createBlock([{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}], tileWidth, tileHeight)
}

function createTBlock(tileWidth: number, tileHeight: number) {
    return createBlock([], tileWidth, tileHeight);
}

function createBlock(coords: {x: number, y: number}[], tileWidth: number, tileHeight: number) {
    return coords.map((coord) => ({x: coord.x * tileWidth, y: coord.y * tileHeight}))
}