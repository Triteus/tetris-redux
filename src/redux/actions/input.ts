import { setupMaster } from "cluster";
import { Action } from "./types";


export interface InputAction extends Action {
    pressed: boolean;
}

export function setDown(pressed: boolean): InputAction {
    return {
        type: 'SET_DOWN',
        pressed
    }
}
export function setLeft(pressed: boolean): InputAction {
    return {
        type: 'SET_LEFT',
        pressed
    }
}
export function setRight(pressed: boolean): InputAction {
    return {
        type: 'SET_RIGHT',
        pressed
    }
}