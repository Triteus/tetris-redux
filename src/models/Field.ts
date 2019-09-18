import { Vec2D } from "./Grid";

export class Field {
    isMoving = false;
    constructor(private pos: Vec2D, private type: string) {
    }

    setType(type: string) {
        this.type = type;
    }

    setIsMoving(isMoving: boolean) {
        this.isMoving = isMoving;
    }

    getPos() {
        return this.pos;
    }

    getType() {
        return this.type;
    }

    getIsMoving() {
        return this.isMoving;
    }
}