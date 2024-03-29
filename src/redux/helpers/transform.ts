import { BlockState } from "../store";
import { Field } from "../../models/Field";
import { Vec2D } from "../../models/Grid";
import { FieldType } from "../../models/FieldType";

export function rotateRight(block: BlockState): { x: number; y: number }[] {
    const centerField = block.fields.filter(field => {
        return field.isCenter;
    })[0];
    if (!centerField) {
        return block.fields;
    }

    return block.fields.map(coord => {
        if (coord.isCenter) {
            return coord;
        }

        const offsetX = coord.x - centerField.x;
        const offsetY = coord.y - centerField.y;
        return { x: centerField.x - offsetY, y: centerField.y + offsetX };
    });
}

export function translateBlock(
    block: BlockState,
    offsetX: number,
    offsetY: number,
) {
    return {
        ...block,
        fields: block.fields.map(field => ({
            ...field,
            x: field.x + offsetX,
            y: field.y + offsetY,
        })),
    };
}


function getBlockWidth(block: BlockState) {
    let minX = Number.MAX_SAFE_INTEGER, maxX = 0;
    for(let field of block.fields) {
        if(field.x > maxX) {
            maxX = field.x;
        }
        if(field.x < minX) {
            minX = field.x;
        }
    }
    return maxX - minX;
}

export function translateBlockToMiddle(block: BlockState, width: number, tileWidth: number): BlockState {
    if(width < 2) {
        throw new Error('Invalid width (must be greater than one)!');
    }

    const blockWidth = getBlockWidth(block) + tileWidth;
   const offsetX = ((blockWidth / tileWidth) % 2) === 0 ? (blockWidth / 2) : ((blockWidth + tileWidth) / 2);
    return {
        fields: block.fields.map((field) => {
            return {...field, x: field.x + (width / 2 - offsetX), y: field.y} 
    })}
}

export function deleteFullRows(
    grid: Field[][],
    size: Vec2D,
    tileSize: Vec2D,
): {updatedGrid: Field[][], deletedRowsCount: number} {
    const rows = getFullRows(grid);
    const numCols = size.x / tileSize.x;
    let updatedGrid: Field[][] = grid;

    // it is essential that keys are read from top to bottom
    const keys = Object.keys(rows)
    let rowsCount = 0;
    
    for (let key of keys) {
        const rowPos = parseInt(key);
        if (rows[rowPos] === numCols) {
            rowsCount++;
            updatedGrid = lowerFields(updatedGrid, rowPos, tileSize);
        }
    }
    return {updatedGrid, deletedRowsCount: rowsCount};
}

/**
 * Lower all fields in the grid above the given row position.
 *
 * @param grid
 * @param rowPos index of row
 * @param tileSize
 */

function getFullRows(grid: Field[][]): { [y: number]: number } {
    const rows: { [y: number]: number } = {};
    for (let cols of grid) {
        for (let field of cols) {
            if (field.getType() === FieldType.BLOCK) {
                const count = rows[field.getPos().y];
                rows[field.getPos().y] = count ? count + 1 : 1;
            }
        }
    }
    return rows;
}

function lowerFields(
    grid: Field[][],
    rowPos: number,
    tileSize: Vec2D,
): Field[][] {
    return grid.map(cols => {
        return cols.map(field => {
            const { x, y } = field.getPos();
            const { x: tileWidth, y: tileHeight } = tileSize;

            if (y === 0) {
                return field;
            }

            const upperField =
                grid[x / tileWidth][(y - tileHeight) / tileHeight];
            if (!upperField) {
                throw new Error(
                    `Out of bounds while trying to read field at x=${x} and y=${y -
                        tileHeight} position!`,
                );
            }
            if (field.getType() === FieldType.BLOCK && y <= rowPos) {
                return new Field(new Vec2D(x, y), upperField.getType());
            }
            return field;
        });
    });
}

export function fillGrid(grid: Field[][]) {
    return grid.map(cols => {
        return cols.map(field => {
            return new Field(field.getPos(), FieldType.BLOCK);
        });
    });
}

/** put block onto grid */
export function freezeBlockOnGrid(grid: Field[][], block: BlockState) {
    return grid.map(col => {
        return col.map(field => {
            for (let f of block.fields) {
                if (field.getPos().x === f.x && field.getPos().y === f.y) {
                    return new Field(field.getPos(), FieldType.BLOCK);
                }
            }
            return field;
        });
    });
}
