import { initialState } from "../store";


export const POINT_INC_STEPS = 500;

export function points(points = initialState.info.points, action: {type: string, points: number}) {
    switch(action.type) {
        case "ADD_POINTS":
            return points + action.points;
        case "RESET_POINTS":
            return 0;
        default:
            return points;
    }
}