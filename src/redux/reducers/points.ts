import { initialState } from "../store";

export function points(points = initialState.info.points, action: any) {
    switch(action.type) {
        case "INCREASE_POINTS":
            return points + 100;
        case "RESET_POINTS":
            return 0;
        default:
            return points;
    }
}