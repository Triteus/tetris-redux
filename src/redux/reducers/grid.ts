import { initialState, GameState, Direction } from "../store";
import { createSquareBlock, createTBlock, createLBlock } from "../../models/TetrisBlock";
import { rotateRight } from "../helpers/transform";

export function root(state = initialState, action: any ): GameState {
    let updatedFields = [];
    switch(action.type) {
        case 'START':
            const {fields, centerField} = createLBlock(state.tileWidth, state.tileHeight);
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                status: 'ACTIVE',
                currBlock: {
                    ...state.currBlock,
                    fields, baseFields: fields
                }                
            }
        case 'UPDATE':
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: state.currBlock.fields.map((field) => ({
                       ...field, x: field.x, y: field.y + state.tileHeight
                    }))
                }
            }
            // update position of current block
            // if block collided with filled field => spawn block
                //get upcoming block
                // spawn block at pos (width / 2, 0)
                // if block already collides with any filled field
                    // game over
                // calculate random block to be chosen next time
        case 'PAUSE':
            // change status to paused
            return state;
        case 'RESET':
            // reset all status and create new grid
            return state;
        case 'MOVE_LEFT':
            let fieldsToLeft = state.currBlock.fields.map((field) => ({
                ...field, x: field.x - state.tileWidth, y: field.y
            }));
            if(fieldsToLeft.some(f => f.x < 0)) {
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
                if(fieldsToRight.some(f => f.x >= state.width)) {
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
            let lowY = Number.MIN_SAFE_INTEGER;
            // get lowest position
            state.currBlock.fields.forEach((field) => {
                if(field.y > lowY) {
                    lowY = field.y
                }
            })
            const offset =  state.height - lowY - state.tileHeight;
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: state.currBlock.fields.map((field) => ({
                        ...field, x: field.x, y:  field.y + offset
                    }))
                }
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