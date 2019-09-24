import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    update,
    togglePause,
    reset,
} from "../redux/actions/update";
import { GameState, GameStatus } from "../redux/store";
import { moveLeft, moveRight, smash, rotateRight } from "../redux/actions/block-transform";


// TODO Users should be able to change standard controls

export const useInputHandler = () => {
    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const status = useRef<GameStatus | null>(null);

    useEffect(() => {
        status.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        document.addEventListener("keydown", event => {
            console.log(event.key);

            if (status.current === GameStatus.ACTIVE) {
                if (event.key === "a") {
                    dispatch(moveLeft());
                } else if (event.key === "d") {
                    dispatch(moveRight());
                } else if (event.key === "s") {
                    dispatch(update());
                } else if (event.key === "w") {
                    dispatch(rotateRight());
                } else if (event.key === "Control") {
                    dispatch(smash());
                }
            }
            
            if (event.key === "r") {
                dispatch(reset());
            } else if (event.key === "p") {
                dispatch(togglePause());
            }
        });
    }, [dispatch]);
};
