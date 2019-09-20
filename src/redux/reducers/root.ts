import { initialState, GameState, BlockState, GameStatus } from "../store";
import { createRandomBlock } from "../../models/TetrisBlock";
import { rotateRight } from "../helpers/transform";
import { collides, collidesBottom } from "../helpers/collision";
import { FieldType } from "../../models/FieldType";
import { Field } from "../../models/Field";

/** put block onto grid */
function freezeBlockOnGrid(grid: Field[], block: BlockState) {
    return grid.map((field) => {
        for(let f of block.fields) {
            if( field.getPos().x === f.x && field.getPos().y === f.y) {
                return new Field(field.getPos(), FieldType.BLOCK);
            }
        }
       return field;
    })
}


// TODO logic dealing with calculating new state should be placed inside action creators 
// in this way, we can dispatch more specific actions and can make use of composition of small reducers

export function root(state = initialState, action: any ): GameState {
    switch(action.type) {
        case 'START':
            const {fields} = createRandomBlock(state.tileWidth, state.tileHeight);
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
                    nextBlock: createRandomBlock(state.tileWidth, state.tileHeight)
                }                
            }
        case 'UPDATE':
            let updatedFields = state.currBlock.fields.map((field) => ({
                ...field, x: field.x, y: field.y + state.tileHeight
             }));

             if(collides(updatedFields, state.grid) || collidesBottom(updatedFields, state.height)) {

                // check if next block instantly collides
                if(collides(state.info.nextBlock.fields, state.grid)) {
                    return {
                        ...state,
                        grid: state.grid.map((field) => {
                            return new Field(field.getPos(), FieldType.BLOCK);
                        }),
                        updateCounter: state.updateCounter + 1,
                        status: GameStatus.GAME_OVER
                    }
                }

                return {
                    ...state,
                    grid: freezeBlockOnGrid(state.grid, state.currBlock),
                    updateCounter: state.updateCounter + 1,
                    currBlock: state.info.nextBlock,
                    info: {
                        ...state.info,
                        nextBlock: createRandomBlock(state.tileWidth, state.tileHeight)
                    }
                }
             }
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: updatedFields
                }
            }
        case 'PAUSE':
            return {
                ...state,
                status: GameStatus.PAUSED
            }
        case 'UNPAUSE': {
            return {
                ...state,
                status: GameStatus.ACTIVE
            }
        }
        case 'RESET':
            return {
                ...state,
                grid: initialState.grid,
                info: {
                    ...state.info,
                    level: state.info.level
                }
            };
        case 'MOVE_LEFT':
            let fieldsToLeft = state.currBlock.fields.map((field) => ({
                ...field, x: field.x - state.tileWidth, y: field.y
            }));
            if(fieldsToLeft.some(f => f.x < 0) || collides(fieldsToLeft, state.grid)) {
                return state;
            }
            
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: fieldsToLeft
                }
            }
        case 'MOVE_RIGHT':
                let fieldsToRight = state.currBlock.fields.map((field) => ({
                    ...field, x: field.x + state.tileWidth, y: field.y
                }));
                if(fieldsToRight.some(f => f.x >= state.width) || collides(fieldsToRight, state.grid)) {
                    return state;
                }

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: fieldsToRight
                }
            };
            case 'SMASH':
            let f = state.currBlock.fields;
            while(!collides(f, state.grid) && !collidesBottom(f, state.height)) {
                f = f.map((field) => ({
                    ...field, x: field.x, y: field.y + state.tileHeight
                 }));
            }

            f = f.map((field) => ({
                ...field, x: field.x, y: field.y - state.tileHeight
             }));

            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                grid: freezeBlockOnGrid(state.grid, {fields: f}),
                currBlock: createRandomBlock(state.tileWidth, state.tileHeight)
                
            };
            case 'ROTATE_RIGHT':
                return {
                    ...state,
                    updateCounter: state.updateCounter + 1,
                    currBlock: {
                        ...state.currBlock,
                        fields: rotateRight(state.currBlock)
                    }
                };
        default:
            return state;
    }
}