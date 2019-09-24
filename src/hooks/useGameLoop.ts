import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, start, timeUpdate } from "../redux/actions/update";
import { GameStatus, GameState } from "../redux/store";
import { Timer } from "../redux/helpers/timer";


export const useGameLoop = () => {

    let iv = useRef<any>(null);

    let secondsTimer = useRef<any>(null);
    
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


    useEffect(() => {
        return function() {
            if(iv.current) {
                timer.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if(gameStatus === GameStatus.ACTIVE) {
            // start counting
            secondsTimer.current = setInterval(() => {
                dispatch(timeUpdate());
            }, 1000)
        } else {
            if(secondsTimer.current) {
                // stop counting
                clearInterval(secondsTimer.current);
            }
        }
    }, [gameStatus])

    useEffect(() => {
        // pause current timer
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
