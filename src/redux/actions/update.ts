import { Action } from "./types"
import { Dispatch } from "redux"
import { GameStatus } from "../store";
import { GameStats } from "../../GameStats";


export function start(): Action {
    return {
        type: 'START'
    }
}

export function togglePause() {
    return ((dispatch: Dispatch, getState: any) => {
        const status = getState().status;
        if(status === GameStatus.ACTIVE) {
            dispatch({type: 'PAUSE'});
        }
        if(status === GameStatus.PAUSED) {
            dispatch({type: 'UNPAUSE'});
        }
    }) 
    
}


export function reset() {
    return ((dispatch: Dispatch) => {
        dispatch({type: 'RESET'});
        dispatch({type: 'START'});
    })
}

export function update(): Action {
    return {
        type: 'UPDATE'
    }
}

export function smash(): Action {
    return {
        type: 'SMASH'
    }
}


export function moveLeft(): Action {
    return {
        type: 'MOVE_LEFT'
    }
}


export function moveRight(): Action {
    return {
        type: 'MOVE_RIGHT'
    }
}

export function rotateLeft(): Action {
    return {
        type: 'ROTATE_LEFT'
    }   
}

export function rotateRight(): Action {
    return {
        type: 'ROTATE_RIGHT'
    }
}



