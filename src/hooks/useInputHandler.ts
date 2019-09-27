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

interface CommandsMapping {
    [cmd: string]: {
        /** action that updates actual gamestate (e.g. moving block) */
        updateAction: any;
        /**
         * @param setInput action that should be dispatched when input is pressed
         * @param timeout time between reacting to input when holding input down
         */
        inputAction: {
            setInput: any;
            timeout: number;
        } | null;
        /** indicated whether cmd can be executed during pause */
        activateWhenPaused?: boolean;
    };
}

const cmdToActionsMapping: CommandsMapping = {
    down: {
        updateAction: update,
        inputAction: {
            setInput: setDown,
            timeout: 50,
        },
    },
    left: {
        updateAction: moveLeft,
        inputAction: {
            setInput: setLeft,
            timeout: 100,
        },
    },
    right: {
        updateAction: moveRight,
        inputAction: {
            setInput: setRight,
            timeout: 100,
        },
    },
    smash: {
        updateAction: smash,
        inputAction: null,
    },
    rotateRight: {
        updateAction: rotateRight,
        inputAction: null,
    },
    reset: {
        updateAction: reset,
        inputAction: null,
        activateWhenPaused: true,
    },
    pause: {
        updateAction: togglePause,
        inputAction: null,
        activateWhenPaused: true,
    },
};

export const useInputHandler = () => {
    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const cmdToKeyMapping = useSelector<GameState, CmdMappingState>(state => {
        return state.cmdMappings;
    });

    const status = useRef<GameStatus | null>(null);

    const keysDict = useRef<{ [key: string]: boolean }>({});
    const keysUpdateActionMapping = useRef<{ [key: string]: any }>({});
    const keysInputActionsMapping = useRef<{
        [key: string]: { setInput: any; timeout: number } | null;
    }>({});
    const keysTypeMapping = useRef<{ [key: string]: any }>({});
    const keysIntervalMapping = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        // make sure all mappings are properly initialized
        for (let cmdName of Object.keys(cmdToKeyMapping)) {
            const key = cmdToKeyMapping[cmdName];
            const {
                updateAction,
                inputAction,
                activateWhenPaused,
            } = cmdToActionsMapping[cmdName];
            
            keysUpdateActionMapping.current[key] = updateAction;
            keysInputActionsMapping.current[key] = inputAction;
            keysTypeMapping.current[key] = !!activateWhenPaused;
            keysIntervalMapping.current[key] = {
                intervalID: null,
                timeoutID: null,
            };
        }
    }, [cmdToKeyMapping]);

    const resetInterval = (timeout: number, key: string) => {
        const { timeoutID, intervalID } = keysIntervalMapping.current[key];
        if (intervalID) {
            clearInterval(intervalID);
        }
        if (timeoutID) {
            clearTimeout(timeoutID);
        }

        // small timeout before starting interval to avoid multiple accidental inputs
        keysIntervalMapping.current[key].timeoutID = setTimeout(() => {
            keysIntervalMapping.current[key].intervalID = setInterval(() => {
                if (keysDict.current[key]) {
                    const mapping = keysUpdateActionMapping.current;
                    if (mapping[key]) {
                        dispatch(mapping[key]());
                    }
                }
            }, timeout);
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

                    const inputAction = keysInputActionsMapping.current[event.key];
                    if (inputAction) {
                        keysDict.current[event.key] = true;
                        dispatch(inputAction.setInput(true));
                        resetInterval(inputAction.timeout, event.key);
                    }
                }
            } else {
                // game not active
                const updateAction = keysUpdateActionMapping.current[event.key];
                const canActivateWhenPaused =
                    keysTypeMapping.current[event.key];
                if (updateAction && canActivateWhenPaused) {
                    dispatch(updateAction());
                }
            }
        });

        document.addEventListener("keyup", event => {
            if (status.current === GameStatus.ACTIVE) {
                const inputAction = keysInputActionsMapping.current[event.key];
                if (inputAction) {
                    dispatch(inputAction.setInput(false));
                    keysDict.current[event.key] = false;
                }
            }
        });
    }, [dispatch]);
};
