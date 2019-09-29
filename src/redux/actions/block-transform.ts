import { GameStatus, GameState, BlockState } from "../store";

import { update } from "./update";

import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { translateBlock, rotateRight as rr } from "../helpers/transform";
import { collides, collidesBottom } from "../helpers/collision";
import { Vec2D } from "../../models/Grid";

type ThunkResult<R> = ThunkAction<R, GameState, undefined, Action>;

export interface BlockTransformAction {
    type: BlockTransformType;
    updatedBlock: BlockState;
}

export enum BlockTransformType {
    ROTATE_RIGHT = "ROTATE_RIGHT",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    MOVE_DOWN = "MOVE_DOWN",
}

export function blockTransform(type: BlockTransformType, updatedBlock: BlockState): BlockTransformAction {
    return {
        type,
        updatedBlock,
    };
}

/**
 * Action to immediately put current block down
 */

export function smash(): ThunkResult<void> {
    return (dispatch, getState) => {
        const oldState = getState();
        while (
            getState().info.placedBlocks === oldState.info.placedBlocks &&
            getState().status !== GameStatus.GAME_OVER
        ) {
            dispatch(update());
        }
    };
}

export function moveLeft(): ThunkResult<any> {
    return (dispatch, getState) => {
        const state = getState();

        let blockToLeft = translateBlock(state.currBlock, -state.tileWidth, 0);

        // check if block would be out of bounds or collide with block on grid
        if (
            blockToLeft.fields.some(f => f.x < 0) ||
            collides(
                blockToLeft.fields,
                state.grid,
                new Vec2D(state.tileWidth, state.tileHeight),
            )
        ) {
            return;
        }
        dispatch(blockTransform(BlockTransformType.MOVE_LEFT, blockToLeft));
    };
}

export function moveRight(): ThunkResult<any> {
    return (dispatch, getState) => {
        const state = getState();

        let blockToRight = translateBlock(state.currBlock, state.tileWidth, 0);
        // check if block would be out of bounds or collide with block on grid
        if (
            blockToRight.fields.some(f => f.x >= state.width) ||
            collides(
                blockToRight.fields,
                state.grid,
                new Vec2D(state.tileWidth, state.tileHeight),
            )
        ) {
            return;
        }
        dispatch(blockTransform(BlockTransformType.MOVE_RIGHT, blockToRight));
    };
}

export function rotateRight(): ThunkResult<any> {
    return (dispatch, getState) => {
        const state = getState();

        const rotatedFields = rr(state.currBlock);

        if (
            collides(
                rotatedFields,
                state.grid,
                new Vec2D(state.tileWidth, state.tileHeight),
            ) ||
            collidesBottom(rotatedFields, state.height) ||
            rotatedFields.some(f => f.x < 0 || f.x >= state.width)
        ) {
            return;
        }
        return dispatch(
            blockTransform(BlockTransformType.ROTATE_RIGHT, {
                fields: rotatedFields,
            }),
        );
    };
}
