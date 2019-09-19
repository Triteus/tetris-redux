import { Field } from "./Field";

export class TetrisBlock {
    private fields = [];
    constructor(private dir: string) {}
}

export class SquareBlock extends TetrisBlock {}

export function createSquareBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
        centerField: null,
    };
}

export function createTBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
        centerField: { x: 1, y: 0 },
    };
}

export function createLBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
        centerField: { x: 1, y: 0 },
    };
}

function translateBlock(
    coords: { x: number; y: number }[],
    tileWidth: number,
    tileHeight: number,
) {
    return coords.map(coord => ({
        ...coord,
        x: coord.x * tileWidth,
        y: coord.y * tileHeight,
    }));
}
