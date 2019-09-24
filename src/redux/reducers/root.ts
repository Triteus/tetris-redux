import { initialState, GameState, BlockState, GameStatus } from "../store";
import { createRandomBlock } from "../../models/TetrisBlock";
import { rotateRight, deleteFullRows, fillGrid, freezeBlockOnGrid, translateBlock } from "../helpers/transform";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";


function calcPoints(delRowsCount: number) {
    return delRowsCount * 100;
}

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
                let {updatedGrid, deletedRowsCount} = deleteFullRows(
                freezeBlockOnGrid(state.grid, state.currBlock),
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
                        points: state.info.points + calcPoints(deletedRowsCount),
                        placedBlocks: state.info.placedBlocks + 1,
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
                    points: 0,
                    placedBlocks: 0,
                    time: 0,
                    level: state.info.level,
                },
            };
        case "MOVE_LEFT":
            let blockToLeft = translateBlock(state.currBlock, -state.tileWidth, 0 );
            if (
                blockToLeft.fields.some(f => f.x < 0) ||
                collides(blockToLeft.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight))
            ) {
                return state;
            }

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: blockToLeft
            };
        case "MOVE_RIGHT":
            let blockToRight = translateBlock(state.currBlock, state.tileWidth, 0 );
            if (
                blockToRight.fields.some(f => f.x >= state.width) ||
                collides(blockToRight.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight))
            ) {
                return state;
            }

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: blockToRight,
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
        case "UPDATE_TIME":
            return {
                ...state,
                info: {
                    ...state.info,
                    time: state.info.time + action.interval
                }
            }
        case "UPDATE_LEVEL":
            return {
                ...state,
                info: {
                    ...state.info,
                    level: action.level
                }
            }

        default:
            return state;
    }
}
