import { Action } from "./types";

const CHANGE_LEVEL = 'CHANGE_LEVEL';


export function changeLevel(): Action {
    return {
        type: CHANGE_LEVEL
    }
}
