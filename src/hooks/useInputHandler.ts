import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, togglePause, reset } from "../redux/actions/update";
import { GameState, GameStatus } from "../redux/store";
import {
    moveLeft,
    moveRight,
    smash,
    rotateRight,
} from "../redux/actions/block-transform";
import { setLeft, setRight, setDown } from "../redux/actions/input";

// TODO Users should be able to change standard controls

export const useInputHandler = () => {
    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const status = useRef<GameStatus | null>(null);

    const keysDict = useRef<{ [key: string]: boolean }>({
        a: false,
        d: false,
        s: false,
    });

    const keysActionMapping = useRef<{ [key: string]: any }>({
        a: () => dispatch(moveLeft()),
        d: () => dispatch(moveRight()),
        s: () => dispatch(update()),
    });
    const interval = useRef<any | null>({});

    const resetInterval = () => {
        if (interval.current) {
            clearInterval(interval.current);
        }
        interval.current = setInterval(() => {
            Object.keys(keysDict.current).forEach(key => {
                if (keysDict.current[key]) {
                    const mapping = keysActionMapping.current;
                    if (mapping[key]) mapping[key]();
                }
            });
        }, 150);
    };

    useEffect(() => {
        status.current = gameStatus;
    }, [gameStatus]);

    const startInput = (cb: () => any, key: string) => {
        if (!keysDict.current[key]) {
            // first input
            keysDict.current[key] = true;
            cb();
            resetInterval();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", event => {
            if (status.current === GameStatus.ACTIVE) {
                if (event.key === "Control") {
                    dispatch(smash());
                } else if (event.key === "w") {
                    startInput(() => {
                        dispatch(rotateRight());
                    }, event.key);
                } else if (event.key === "a") {
                    startInput(() => {
                        dispatch(moveLeft());
                        dispatch(setLeft(true));
                    }, event.key);
                } else if (event.key === "d") {
                    startInput(() => {
                        dispatch(moveRight());
                        dispatch(setRight(true));
                    }, event.key);
                } else if (event.key === "s") {
                    startInput(() => {
                        dispatch(update());
                        dispatch(setDown(true));
                    }, event.key);
                }
            }

            if (event.key === "r") {
                dispatch(reset());
            } else if (event.key === "p") {
                dispatch(togglePause());
            }
        });

        document.addEventListener("keyup", event => {
            if (status.current === GameStatus.ACTIVE) {
                if (event.key === "a") {
                    dispatch(setLeft(false));
                } else if (event.key === "d") {
                    dispatch(setRight(false));
                } else if (event.key === "s") {
                    dispatch(setDown(false));
                }
                keysDict.current[event.key] = false;
            }
        });
    }, [dispatch]);
};
