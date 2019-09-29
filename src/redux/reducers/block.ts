import { initialState } from "../store";
import {
    BlockTransformType,
    BlockTransformAction,
} from "../actions/block-transform";

export function block(state = initialState.currBlock, action: BlockTransformAction,) {
    if (Object.values(BlockTransformType).includes(action.type)) {
        return action.updatedBlock;
    } else {
        return state;
    }
}
