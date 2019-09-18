import { Grid, Vec2D } from "./Grid"
import { Field } from "./Field";

it('should init grid with right amount of fields', () => {
    const grid = new Grid(new Vec2D(10, 10), new Vec2D(10, 10));

    expect(grid.getNumFields()).toBe(100);
})

describe('tests for resolving grid pos', () => {

    let grid: Grid;
    beforeEach(() => {
        grid = new Grid(new Vec2D(10, 10), new Vec2D(10, 10));
    })

    it('should return first element', () => {
        const field = new Field(new Vec2D(0, 0), 'empty');
        const expectField = grid.resolveField(new Vec2D(0, 0));
        expect(expectField.getPos().getWidth()).toBe(field.getPos().getWidth());
        expect(expectField.getPos().getHeight()).toBe(field.getPos().getHeight());  
    })

    it('should return last element', () => {
        const field = new Field(new Vec2D(9, 9), 'empty');
        const expectField = grid.resolveField(new Vec2D(9, 9));
        expect(expectField.getPos().getWidth()).toBe(field.getPos().getWidth());
        expect(expectField.getPos().getHeight()).toBe(field.getPos().getHeight());  
    })

    it('should return correct position', () => {
        const field = new Field(new Vec2D(5, 6), 'empty');
        const expectField = grid.resolveField(new Vec2D(5, 6));
        expect(expectField.getPos().getWidth()).toBe(field.getPos().getWidth());
        expect(expectField.getPos().getHeight()).toBe(field.getPos().getHeight());

    })


})