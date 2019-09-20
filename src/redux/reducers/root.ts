import { initialState, GameState, BlockState, GameStatus } from "../store";
import { createRandomBlock } from "../../models/TetrisBlock";
import { rotateRight, deleteFullRows, fillGrid, freezeBlockOnGrid, translateBlock } from "../helpers/transform";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";



// TODO logic dealing with calculating new state should be placed inside action creators
// in this way, we can dispatch more specific actions and can make use of composition of small reducers

export function root(state = initialState, action: any): GameState {
    switch (action.type) {
        case "START":
            const { fields } = createRandomBlock(
                state.tileWidth,
                state.tileHeight,
            );
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                status: GameStatus.ACTIVE,
                currBlock: {
                    ...state.currBlock,
                    fields,
                },
                info: {
                    ...state.info,
                    nextBlock: createRandomBlock(
                        state.tileWidth,
                        state.tileHeight,
                    ),
                },
            };
        case "UPDATE":
            let updatedFields = state.currBlock.fields.map(field => ({
                ...field,
                x: field.x,
                y: field.y + state.tileHeight,
            }));

            if (
                collides(updatedFields, state.grid, new Vec2D(state.tileWidth, state.tileHeight)) ||
                collidesBottom(updatedFields, state.height)
            ) {
                // check if next block instantly collides
                if (collides(state.info.nextBlock.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight))) {
                    return {
                        ...state,
                        grid: fillGrid(state.grid),
                        updateCounter: state.updateCounter + 1,
                        status: GameStatus.GAME_OVER,
                    };
                }
                let updatedGrid = freezeBlockOnGrid(
                    state.grid,
                    state.currBlock,
                );
                 updatedGrid = deleteFullRows(
                    updatedGrid,
                    new Vec2D(state.width, state.height),
                    new Vec2D(state.tileWidth, state.tileHeight),
                ); 
                return {
                    ...state,
                    grid: updatedGrid,
                    updateCounter: state.updateCounter + 1,
                    currBlock: state.info.nextBlock,
                    info: {
                        ...state.info,
                        nextBlock: createRandomBlock(
                            state.tileWidth,
                            state.tileHeight,
                        ),
                    },
                };
            }
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: updatedFields,
                },
            };
        case "PAUSE":
            return {
                ...state,
                status: GameStatus.PAUSED,
            };
        case "UNPAUSE": {
            return {
                ...state,
                status: GameStatus.ACTIVE,
            };
        }
        case "RESET":
            return {
                ...state,
                grid: initialState.grid,
                info: {
                    ...state.info,
                    level: state.info.level,
                },
            };
        case "MOVE_LEFT":
            let fieldsToLeft = state.currBlock.fields.map(field => ({
                ...field,
                x: field.x - state.tileWidth,
                y: field.y,
            }));
            if (
                fieldsToLeft.some(f => f.x < 0) ||
                collides(fieldsToLeft, state.grid, new Vec2D(state.tileWidth, state.tileHeight))
            ) {
                return state;
            }

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: fieldsToLeft,
                },
            };
        case "MOVE_RIGHT":
            let fieldsToRight = state.currBlock.fields.map(field => ({
                ...field,
                x: field.x + state.tileWidth,
                y: field.y,
            }));
            if (
                fieldsToRight.some(f => f.x >= state.width) ||
                collides(fieldsToRight, state.grid, new Vec2D(state.tileWidth, state.tileHeight))
            ) {
                return state;
            }

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: fieldsToRight,
                },
            };
        case "SMASH":
            let block = state.currBlock;
            while (
                !collides(block.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight)) &&
                !collidesBottom(block.fields, state.height)
            ) {
                block = translateBlock(block, 0, state.tileHeight);
            }

            block = translateBlock(block, 0, -state.tileHeight);

            let updatedGrid = freezeBlockOnGrid(
                state.grid,
                block,
            );
             updatedGrid = deleteFullRows(
                updatedGrid,
                new Vec2D(state.width, state.height),
                new Vec2D(state.tileWidth, state.tileHeight),
            ); 

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                grid: updatedGrid,
                currBlock: createRandomBlock(state.tileWidth, state.tileHeight),
            };
        case "ROTATE_RIGHT":
            const rotatedFields = rotateRight(state.currBlock);

            if (
                collides(rotatedFields, state.grid, new Vec2D(state.tileWidth, state.tileHeight)) ||
                collidesBottom(rotatedFields, state.height) ||
                rotatedFields.some(f => f.x < 0 || f.x >= state.width)
            ) {
                return state;
            }
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: rotateRight(state.currBlock),
                },
            };
        default:
            return state;
    }
}
