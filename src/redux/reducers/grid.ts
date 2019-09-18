import { initialState, GameState, Direction } from "../store";
import { createSquareBlock } from "../../models/TetrisBlock";

export function root(state = initialState, action: any ): GameState {
    switch(action.type) {
        case 'START':
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                status: 'ACTIVE',
                currBlock: {
                    dir: Direction.NORTH,
                    fields: createSquareBlock(state.tileWidth, state.tileHeight)
                }                

            }
            // spawn block
            // change status to active
        
        case 'UPDATE':
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                currBlock: {
                    ...state.currBlock,
                    fields: state.currBlock.fields.map((field) => ({
                        x: field.x, y: field.y + state.tileHeight
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
        default:
            return state;
    }
}