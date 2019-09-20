import { Vec2D } from "./Grid";

export class Field {
    constructor(private pos: Vec2D, private type: string) {
    }

    setType(type: string) {
        this.type = type;
    }

 
    getPos() {
        return this.pos;
    }

    getType() {
        return this.type;
    }

}