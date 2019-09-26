import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, togglePause, reset } from "../redux/actions/update";
import { GameState, GameStatus, CmdMappingState } from "../redux/store";
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
        updateAction: any;
        inputAction: any;
        activateWhenPaused?: boolean
    };
}

const cmdToActionsMapping: KeysMapping = {
    down: {
        updateAction: update,
        inputAction: setDown
    },
    left: {
        updateAction: moveLeft,
        inputAction: setLeft
    },
    right: {
        updateAction: moveRight,
        inputAction: setRight
    },
    smash: {
        updateAction: smash,
        inputAction: null
    },
    rotateRight: {
        updateAction: rotateRight,
        inputAction: null
    },
    reset: {
        updateAction: reset,
        inputAction: null,
        activateWhenPaused: true
    },
    pause: {
        updateAction: togglePause,
        inputAction: null,
        activateWhenPaused: true
    }
}

export const useInputHandler = () => {
    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const cmdToKeyMapping = useSelector<GameState, CmdMappingState>(state => {
        return state.cmdMappings;
    })

    const status = useRef<GameStatus | null>(null);

    const keysDict = useRef<{ [key: string]: boolean }>({});
    const keysUpdateActionMapping = useRef<{ [key: string]: any }>({});
    const keysInputActionsMapping = useRef<{ [key: string]: any }>({});
    const keysTypeMapping = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        for(let cmdName of Object.keys(cmdToKeyMapping)) {
            const key = cmdToKeyMapping[cmdName];
            const {updateAction, inputAction, activateWhenPaused} = cmdToActionsMapping[cmdName];
            keysUpdateActionMapping.current[key] = updateAction;
            keysInputActionsMapping.current[key] = inputAction;
            keysTypeMapping.current[key] = !!activateWhenPaused;
        }
    }, [cmdToKeyMapping])


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

    // save status in ref => keydown-event-listener has access to newest status
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
                const canActivateWhenPaused = keysTypeMapping.current[event.key];
                if (updateAction && canActivateWhenPaused) {
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
