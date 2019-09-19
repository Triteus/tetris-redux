import { BlockState } from "../store";

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
