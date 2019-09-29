import { initialState, GameState, BlockState, GameStatus } from "../store";
import { createRandomBlock } from "../../models/TetrisBlock";
import {
    fillGrid,
    translateBlockToMiddle,
} from "../helpers/transform";
import { points } from "./points";
import { level } from "./level";
import { input } from "./input";
import { block } from "./block";
import { BlockTransformType } from "../actions/block-transform";


// TODO logic dealing with calculating new state should be placed inside action creators
// in this way, we can dispatch more specific actions and can make use of composition of small reducers

export function root(state = initialState, action: any): GameState {

    // if block is translated or transformed then increase counter for rendering cycle
    if (Object.values(BlockTransformType).includes(action.type)) {
        return {
            ...state,
            updateCounter: state.updateCounter + 1,
            currBlock: block(state.currBlock, action)
        }
    } 

    switch (action.type) {
        case "START":
            const createdBlock = createRandomBlock(
                state.tileWidth,
                state.tileHeight,
            );
            return {
                ...state,
                updateCounter: state.updateCounter + 1,
                status: GameStatus.ACTIVE,
                currBlock: translateBlockToMiddle(createdBlock, state.width, state.tileWidth),
                info: {
                    ...state.info,
                    nextBlock: createRandomBlock(
                        state.tileWidth,
                        state.tileHeight,
                    ),
                },
            };
        case "GAME_OVER": {
            return {
                ...state,
                grid: fillGrid(state.grid),
                updateCounter: state.updateCounter + 1,
                status: GameStatus.GAME_OVER,
            };
        }
        case "ADD_BLOCK_TO_GRID":
            return {
                ...state,
                grid: action.updatedGrid,
                updateCounter: state.updateCounter + 1,
                currBlock: translateBlockToMiddle(state.info.nextBlock, state.width, state.tileWidth),
                info: {
                    ...state.info,
                    placedBlocks: state.info.placedBlocks + 1,
                    nextBlock: createRandomBlock(
                        state.tileWidth,
                        state.tileHeight,
                    ),
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
                    level: 0,
                },
            };
        case "UPDATE_TIME":
            return {
                ...state,
                info: {
                    ...state.info,
                    time: state.info.time + action.interval,
                },
            };
        default:
            return {
                ...state,
                input: input(state.input, action),
                info: {
                        ...state.info,
                        points: points(state.info.points, action),
                        level: level(state.info.level, action),
                    }};
    }
}
