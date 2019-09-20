import {createStore, combineReducers} from 'redux'; 
import { createGrid, Vec2D } from '../models/Grid';
import { Field } from '../models/Field';
import { composeWithDevTools } from 'redux-devtools-extension';
import { root } from './reducers/grid';

export enum Direction {
    NORTH, EAST, SOUTH, WEST
}

export interface GameState {

    status: 'MENU' | 'PAUSED' | 'ACTIVE', 
    currBlock: BlockState,
    grid: Field[],
    updateCounter: number,
    height: number,
    width: number,
    tileWidth: number,
    tileHeight: number,
    timestamp: any,
    bufferedInputs: {
        rotate: boolean,
        down: boolean,
        left: boolean,
        right: boolean,
        smash: boolean
    },
    info: {
        nextBlock: any,
        blockCollided: boolean,
        level: number,
        points: number,
        time: number
    }
}

const width = 320;
const height = 640;

const tileWidth = 16;
const tileHeight = 16;
export const initialState: GameState = {
    status: 'MENU',
    currBlock: {
        fields: [],
    },
    width, height,
    tileWidth, tileHeight,
    grid: createGrid(new Vec2D(width, height), new Vec2D(tileWidth, tileHeight)),
    updateCounter: 0,
    timestamp: 0,
    bufferedInputs: {
        rotate: false,
        down: false,
        left: false,
        right: false,
        smash: false
    },
    info: {
        nextBlock: '',
        blockCollided: false,
        level: 0,
        points: 0,
        time: 0 
    }


}

export interface BlockState {
    fields: FieldCoords[], 
}

export interface FieldCoords {
    x: number,
    y: number,
    isCenter?: boolean,
}

const game = (state = initialState, action: any) => {
    return state;
}

const rootReducer = combineReducers({
    game
})

export const store = createStore(
    root,
    composeWithDevTools());
