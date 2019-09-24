import { Action } from "./types";
import { Dispatch } from "redux";
import { GameStatus, GameState } from "../store";
import { ThunkAction } from "redux-thunk";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";
import { deleteFullRows, freezeBlockOnGrid } from "../helpers/transform";

function calcPoints(delRowsCount: number) {
    return delRowsCount * 100;
}

const ptsForNextLevel = 500;

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

// main action of updating game

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

            let { updatedGrid, deletedRowsCount } = deleteFullRows(
                freezeBlockOnGrid(state.grid, state.currBlock),
                new Vec2D(state.width, state.height),
                new Vec2D(state.tileWidth, state.tileHeight),
            );
            if(deletedRowsCount > 0) {
                const points = state.info.points + calcPoints(deletedRowsCount);
                dispatch({type: 'INCREASE_POINTS' })
                
                if(points !== 0 && (points % ptsForNextLevel) === 0) {
                    dispatch({type: 'INCREASE_LEVEL'});
                }
            }
            return dispatch({type: "ADD_BLOCK_TO_GRID"});
        }
        

        return dispatch({type: "MOVE_DOWN_BLOCK"});
    });

}

export function timeUpdate(): ThunkResult<void> {
    return ((dispatch) => {
        dispatch({type: 'UPDATE_TIME', interval: 1});
    })
}


