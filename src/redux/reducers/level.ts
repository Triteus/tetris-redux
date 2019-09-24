import { initialState } from "../store";

export function level(level = initialState.info.level, action: any) {
    switch(action.type) {
        case "INCREASE_LEVEL":
            return level < 9 ? level + 1 : level;
        case "UPDATE_LEVEL":
            return action.level;
        case "RESET_LEVEL":
            return 0;
        default:
            return level;
    }
}