import { GameStatus, GameState } from "../store";

import { update } from "./update";

import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

type ThunkResult<R> = ThunkAction<R, GameState, undefined, Action>;

/**
 * Action to immediately put current block down
 */

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