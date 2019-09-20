import { BlockState, FieldCoords } from "../store";
import { Field } from "../../models/Field";
import { FieldType } from "../../models/FieldType";
import { Vec2D } from "../../models/Grid";

export function collides(fields: FieldCoords[], grid: Field[][], tileSize: Vec2D) {
    for(let field of fields) {
        const cols = grid[field.x / tileSize.x];
        // outer bounds (x-axis)
        if(!cols) return true;

        const f = grid[field.x / tileSize.x][field.y / tileSize.y];
        // outer bounds (y-axis)
        if(!f) return true;

        if(f.getType() === FieldType.BLOCK && f.getPos().x === field.x && f.getPos().y === field.y) {
            return true;
        }
    }
    return false;
}

export function collidesBottom(fields: FieldCoords[], height: number) {
    for(let field of fields) {
        if(field.y >= height) {
            return true;
        }
    }
    return false;
}

