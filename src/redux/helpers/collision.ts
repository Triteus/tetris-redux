import { BlockState, FieldCoords } from "../store";
import { Field } from "../../models/Field";
import { FieldType } from "../../models/FieldType";

export function collides(fields: FieldCoords[], grid: Field[]) {
    for(let field of fields) {
        if(grid.some(f => f.getType() === FieldType.BLOCK && f.getPos().x === field.x && f.getPos().y === field.y)) {
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
