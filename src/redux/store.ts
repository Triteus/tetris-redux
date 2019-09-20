import { createStore, combineReducers, applyMiddleware } from "redux";
import { createGrid, Vec2D } from "../models/Grid";
import { Field } from "../models/Field";
import { composeWithDevTools } from "redux-devtools-extension";
import { root } from "./reducers/root";
import { createRandomBlock } from "../models/TetrisBlock";
import thunk from "redux-thunk";

export enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST,
}

export enum GameStatus {
    MENU = "MENU",
    PAUSED = "PAUSED",
    ACTIVE = "ACTIVE",
    GAME_OVER = "GAME_OVER",
}

export interface GameState {
    status: GameStatus;
    currBlock: BlockState;
    grid: Field[][];
    updateCounter: number;
    height: number;
    width: number;
    tileWidth: number;
    tileHeight: number;
    timestamp: any;
    bufferedInputs: {
        rotate: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
        smash: boolean;
    };
    info: Stats;
}

const width = 160;
const height = 320;

const tileWidth = 16;
const tileHeight = 16;
export const initialState: GameState = {
    status: GameStatus.MENU,
    currBlock: {
        fields: [],
    },
    width,
    height,
    tileWidth,
    tileHeight,
    grid: createGrid(
        new Vec2D(width, height),
        new Vec2D(tileWidth, tileHeight),
    ),
    updateCounter: 0,
    timestamp: 0,
    bufferedInputs: {
        rotate: false,
        down: false,
        left: false,
        right: false,
        smash: false,
    },
    info: {
        nextBlock: createRandomBlock(tileWidth, tileHeight),
        level: 0,
        placedBlocks: 0,
        points: 0,
        time: 0,
    },
};

export interface BlockState {
    fields: FieldCoords[];
}

export interface FieldCoords {
    x: number;
    y: number;
    isCenter?: boolean;
}

export interface Stats {
    nextBlock: BlockState;
    level: number;
    points: number;
    placedBlocks: number;
    time: number;
}

const game = (state = initialState, action: any) => {
    return state;
};

const rootReducer = combineReducers({
    game,
});

export const store = createStore(
    root,
    composeWithDevTools(applyMiddleware(thunk)),
);
