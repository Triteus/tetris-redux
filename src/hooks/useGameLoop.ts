import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, start, timeUpdate } from "../redux/actions/update";
import { GameStatus, GameState } from "../redux/store";
import { Timer } from "../util/timer";


export const useGameLoop = () => {

    let iv = useRef<any>(null);

    let secondsTimer = useRef<any>(Timer(() => {
        dispatch(timeUpdate());
    }, 1000));
    
    const loop = () => {
        dispatch(update());
    };

    const timer = useRef<any>(null);

    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    })

    const level = useSelector<GameState, number>(state => {
        return state.info.level;
    })

    const downInput = useSelector<GameState, boolean>(state => {
        return state.input.down;
    })


    useEffect(() => {
        return function() {
            if(iv.current) {
                timer.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if(downInput) {
            // pause timer to avoid additional update when pressing down
            timer.current.pause();
        } else {
            if(timer.current) {
                timer.current.start();      
            }
        }
    }, [downInput])

    useEffect(() => {
        if(!secondsTimer.current) return;
        
        if(gameStatus === GameStatus.ACTIVE) {
            // (re)start counting
            if(secondsTimer.current.hasStarted()) {
                secondsTimer.current.resume();
            } else {
                secondsTimer.current.start();
            }
        } else {
            if(secondsTimer.current) {
                // stop counting
                secondsTimer.current.pause();
            }
        }
    }, [gameStatus])

    useEffect(() => {
        // pause current timer (clear interval)
        if(timer.current) {
            timer.current.pause();
        }
        // create new timer
        timer.current = Timer(loop, 1000 - level * 100);

        // start new timer
        if(gameStatus === GameStatus.ACTIVE) {
            timer.current.start();
        }
    }, [level])

    useEffect(() => {
        if(gameStatus === GameStatus.ACTIVE) {
            if(!timer.current.hasStarted()) {
                timer.current.start();
            } else {
                timer.current.resume();
            }
        }
        if (gameStatus === GameStatus.GAME_OVER) {
            timer.current.pause();
        }
        
        if(gameStatus === GameStatus.PAUSED) {
            timer.current.pause();
        }

    }, [gameStatus]);
};
