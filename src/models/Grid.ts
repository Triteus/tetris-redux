import { Field } from "./Field";
import { FieldType } from "./FieldType";


export function createGrid(numFields: Vec2D, fieldSize: Vec2D): Field[][] {
    const grid: Field[][] = [];
    const fieldWidth = fieldSize.x;
    const fieldHeight = fieldSize.y;
    for (let posX = 0; posX < numFields.getWidth() / fieldHeight; posX += 1) {
        grid[posX] = [];
        for ( let posY = 0; posY < numFields.getHeight() / fieldHeight; posY += 1) {
            grid[posX][posY] = new Field(new Vec2D(posX * fieldWidth, posY * fieldHeight), FieldType.EMPTY);
        }
    }
    return grid;
}

export function resolveIndex(pos: Vec2D, numCols: number) {
    const row = pos.getHeight();
    const col = pos.getWidth();
    return row * numCols + col;
}

export class Vec2D {
    constructor(public x: number, public y: number) {}

    setWidth(w: number) {
        this.x = w;
    }


    setHeight(h: number) {
        this.y = h;
    }

    setSize(width: number, height: number) {
        this.x = width;
        this.y = height;
    }

    getWidth() {
        return this.x;
    }

    getHeight() {
        return this.y;
    }
}
