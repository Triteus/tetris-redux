import { initialState } from "../store";
import { InputAction } from "../actions/input";

export function input(state = initialState.input, action: InputAction) {
    switch(action.type) {
        case 'SET_DOWN': {
            return {
                ...state,
                down: action.pressed
            }
        }
        case 'SET_LEFT': {
            return {
                ...state,
                left: action.pressed
            }
        }
        case 'SET_RIGHT': {
            return {
                ...state,
                right: action.pressed
            }
        }
        case 'SET_ROTATE_RIGHT': {
            return {
                ...state,
                rotateRight: action.pressed
            }
        }
        default:
            return state;
    }
}