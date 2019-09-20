import { Field } from "./Field";
import { FieldType } from "./FieldType";


export function createGrid(numFields: Vec2D, fieldSize: Vec2D) {
    const grid = [];
    const fieldWidth = fieldSize.x;
    const fieldHeight = fieldSize.y;
    for (let posY = 0; posY < numFields.getHeight(); posY += fieldHeight) {
        for (let posX = 0; posX < numFields.getWidth(); posX += fieldWidth) {
            grid.push(new Field(new Vec2D(posX, posY), FieldType.EMPTY));
        }
    }
    return grid;
}

export function resolveIndex(pos: Vec2D, numCols: number) {
    const row = pos.getHeight();
    const col = pos.getWidth();
    return row * numCols + col;
}


export class Grid {
    grid: Field[];
    constructor(private size: Vec2D, private fieldSize: Vec2D) {
        this.grid = [];
        const fieldWidth = fieldSize.x;
        const fieldHeight = fieldSize.y;

        for (let posY = 0; posY < size.getWidth(); posY += fieldWidth) {
            for (let posX = 0; posX < size.getHeight(); posX += fieldHeight) {
                this.grid.push(new Field(new Vec2D(posX, posY), FieldType.EMPTY));
            }
        }
    }

    updateField(pos: Vec2D, type: string, isMoving: boolean) {
        const field = this.resolveField(pos);
        field.setType(type);
    }

    getFieldByIndex(index: number) {
        return this.grid[index];
    }

    resolveField(pos: Vec2D) {
        const index = resolveIndex(pos, this.size.getWidth());
        return this.grid[index];
    }


    getNumFields() {
        return this.grid.length;
    }

    printGrid() {
        console.log("-----------------------------------------");
        for (let posY = 0; posY < this.size.getWidth(); posY++) {
            for (let posX = 0; posX < this.size.getHeight(); posX++) {
                this.grid.push(new Field(new Vec2D(posX, posY), "empty"));
            }
        }
        console.log("-----------------------------------------");
    }

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
