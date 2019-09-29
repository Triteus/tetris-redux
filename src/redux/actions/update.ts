import { Action } from "./types";
import { Dispatch } from "redux";
import { GameStatus, GameState } from "../store";
import { ThunkAction } from "redux-thunk";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";
import { deleteFullRows, freezeBlockOnGrid, translateBlock, translateBlockToMiddle } from "../helpers/transform";
import { POINT_INC_STEPS } from "../reducers/points";
import { blockTransform, BlockTransformType } from "./block-transform";

function calcPoints(delRowsCount: number) {
    return delRowsCount * 100;
}

function nextLevelReached(points: number, level: number) {
    const pointsToNextLevel = POINT_INC_STEPS * (level + 1);
    return points !== 0 && points >= pointsToNextLevel;
}

type ThunkResult<R> = ThunkAction<R, GameState, undefined, Action>;

export function start(): Action {
    return {
        type: "START",
    };
}

export function updateCounter(): Action {
    return {
        type: 'UPDATE_COUNTER'
    }
}

let lastTimeInMillis = 0;

export function togglePause(): ThunkResult<any> {
    return (dispatch, getState) => {
        const status = getState().status;
        if (status === GameStatus.ACTIVE) {
            const timeInMillis = new Date().getTime();;
            if(((timeInMillis - lastTimeInMillis) / 1000) < 0.5 ) {
                // prevent spamming pause
                return;
            } 
            dispatch({ type: "PAUSE" });
            lastTimeInMillis = new Date().getTime();
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
    
        let updatedBlock = translateBlock(state.currBlock, 0, state.tileHeight);

        if (
            collides(updatedBlock.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight)) ||
            collidesBottom(updatedBlock.fields, state.height)
        ) {
            // check if next block instantly collides
            const nextBlock = translateBlockToMiddle(state.info.nextBlock, state.width, state.tileWidth);
            if (collides(nextBlock.fields, state.grid, new Vec2D(state.tileWidth, state.tileHeight))) {
                return dispatch({type: 'GAME_OVER'});
            }  

            let { updatedGrid, deletedRowsCount } = deleteFullRows(
                freezeBlockOnGrid(state.grid, state.currBlock),
                new Vec2D(state.width, state.height),
                new Vec2D(state.tileWidth, state.tileHeight),
            );
            if(deletedRowsCount > 0) {
                dispatch({type: 'ADD_POINTS', points: calcPoints(deletedRowsCount) })
               
                // dispatched synchronous action => points are already updated here
                const {points, level} = getState().info;
                if(nextLevelReached(points, level)){
                    dispatch({type: 'INCREASE_LEVEL'});
                }
            }
            return dispatch({type: "ADD_BLOCK_TO_GRID", updatedGrid});
        }
        return dispatch(blockTransform(BlockTransformType.MOVE_DOWN, updatedBlock));
    });

}

export function timeUpdate(): ThunkResult<void> {
    return ((dispatch) => {
        dispatch({type: 'UPDATE_TIME', interval: 1});
    })
}


