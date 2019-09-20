import { Action } from "./types"


export function start(): Action {
    return {
        type: 'START'
    }
}

export function pause(): Action {
    return {
        type: 'PAUSE'
    }
}

export function reset(): Action {
    return {
        type: 'RESET'
    }
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



