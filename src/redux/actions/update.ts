import { Action } from "./types";
import { Dispatch } from "redux";
import { GameStatus, GameState } from "../store";
import { GameStats } from "../../GameStats";
import { ThunkAction } from "redux-thunk";
import { statement } from "@babel/template";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";
import { fillGrid, deleteFullRows, freezeBlockOnGrid } from "../helpers/transform";
import { createRandomBlock } from "../../models/TetrisBlock";

type ThunkResult<R> = ThunkAction<R, GameState, undefined, Action>;

export function start(): Action {
    return {
        type: "START",
    };
}

export function togglePause() {
    return (dispatch: Dispatch, getState: any) => {
        const status = getState().status;
        if (status === GameStatus.ACTIVE) {
            dispatch({ type: "PAUSE" });
        }
        if (status === GameStatus.PAUSED) {
            dispatch({ type: "UNPAUSE" });
        }
    };
}

export function reset() {
    return (dispatch: Dispatch) => {
        dispatch({ type: "RESET" });
        dispatch({ type: "START" });
    };
}

export function update(): ThunkResult<any> {
    return ((dispatch, getState) => {
        const state = getState();

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
                return dispatch({type: 'GAME_OVER'});
            }  
            return dispatch({type: "ADD_BLOCK_TO_GRID"});
        }
        return dispatch({type: "MOVE_DOWN_BLOCK"});
    });

}

export function intervalUpdate(interval: number): ThunkResult<void> {
    return ((dispatch) => {
        dispatch({type: 'UPDATE_TIME', interval: interval / 1000});
        dispatch(update());
    })
}

export function smash(): ThunkResult<void> {
    return (dispatch, getState) => {
        const oldState = getState();
        while (getState().info.placedBlocks === oldState.info.placedBlocks && getState().status !== GameStatus.GAME_OVER) {
            dispatch(update());
        }
    };
}

export function moveLeft(): Action {
    return {
        type: "MOVE_LEFT",
    };
}

export function moveRight(): Action {
    return {
        type: "MOVE_RIGHT",
    };
}

export function rotateLeft(): Action {
    return {
        type: "ROTATE_LEFT",
    };
}

export function rotateRight(): Action {
    return {
        type: "ROTATE_RIGHT",
    };
}
