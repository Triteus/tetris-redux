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

interface KeysMapping {
    [cmd: string]: {
        key: string,
        updateAction: any;
        inputAction: any;
    };
}

const cmdNames = ['down', 'left', 'right', 'smash', 'rotateRight', 'reset', 'pause'];

const mapping: KeysMapping = {
    down: {
        key: 's',
        updateAction: update,
        inputAction: setDown
    },
    left: {
        key: 'a',
        updateAction: moveLeft,
        inputAction: setLeft
    },
    right: {
        key: 'd',
        updateAction: moveRight,
        inputAction: setRight
    },
    smash: {
        key: 'Control',
        updateAction: smash,
        inputAction: null
    },
    rotateRight: {
        key: 'w',
        updateAction: rotateRight,
        inputAction: null
    },
    reset: {
        key: 'r',
        updateAction: reset,
        inputAction: null
    },
    pause: {
        key: 'p',
        updateAction: togglePause,
        inputAction: null
    }
}

export const useInputHandler = () => {
    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const status = useRef<GameStatus | null>(null);

    const keysDict = useRef<{ [key: string]: boolean }>({});
    const keysUpdateActionMapping = useRef<{ [key: string]: any }>({});
    const keysInputActionsMapping = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        for(let cmdName of cmdNames) {
            const {key, updateAction, inputAction} = mapping[cmdName];
            keysUpdateActionMapping.current[key] = updateAction;
            keysInputActionsMapping.current[key] = inputAction;
        }
    }, [])


    const interval = useRef<any | null>({});
    const timeoutId = useRef<any | null>(null);

    const resetInterval = () => {
        if (interval.current) {
            clearInterval(interval.current);
        }
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        // small timeout to avoid multiple accidental inputs
        timeoutId.current = setTimeout(() => {
            interval.current = setInterval(() => {
                Object.keys(keysDict.current).forEach(key => {
                    if (keysDict.current[key]) {
                        const mapping = keysUpdateActionMapping.current;
                        if (mapping[key]) {
                            dispatch(mapping[key]());
                        }
                    }
                });
            }, 100);
        }, 120);
    };

    useEffect(() => {
        status.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        document.addEventListener("keydown", event => {
            if (status.current === GameStatus.ACTIVE) {
                const keyPressed = keysDict.current[event.key];
                if (!keyPressed) {
                    // user is not holding down a key yet
                    const updateAction =
                        keysUpdateActionMapping.current[event.key];
                    if (updateAction) {
                        dispatch(updateAction());
                    }

                    const setInput = keysInputActionsMapping.current[event.key];
                    if (setInput) {
                        keysDict.current[event.key] = true;
                        dispatch(setInput(true));
                        resetInterval();
                    }
                }
            } else {
                // game not active
                const updateAction = keysUpdateActionMapping.current[event.key];
                if (updateAction) {
                    dispatch(updateAction());
                }
            }
        });

        document.addEventListener("keyup", event => {
            if (status.current === GameStatus.ACTIVE) {
                const setInput = keysInputActionsMapping.current[event.key];
                if (setInput) {
                    dispatch(setInput(false));
                    keysDict.current[event.key] = false;
                }
            }
        });
    }, [dispatch]);
};
