import { Action } from "./types";
import { Dispatch } from "redux";
import { GameStatus, GameState } from "../store";
import { GameStats } from "../../GameStats";
import { ThunkAction } from "redux-thunk";
import { statement } from "@babel/template";

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

export function update(): Action {
    return {
        type: "UPDATE",
    };
}

export function intervalUpdate(interval: number): ThunkResult<void> {
    return ((dispatch) => {
        dispatch({type: 'UPDATE_TIME', interval: interval / 1000});
        dispatch({type: 'UPDATE'});
    })
}

export function smash(): ThunkResult<void> {
    return (dispatch, getState) => {
        const oldState = getState();
        while (getState().info.placedBlocks === oldState.info.placedBlocks && getState().status !== GameStatus.GAME_OVER) {
            dispatch({ type: "UPDATE" });
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
