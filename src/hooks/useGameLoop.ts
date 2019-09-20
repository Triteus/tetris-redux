import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, start } from "../redux/actions/update";
import { GameStatus, GameState } from "../redux/store";
import { Timer } from "../redux/helpers/timer";




export const useGameLoop = () => {
    const time = 1000;
    let iv = useRef<any>(null);
    
    const loop = () => {
        dispatch(update());
    };

    const timer = useRef<any>(Timer(loop, 1000))

    const dispatch = useDispatch();

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    })



    useEffect(() => {
        dispatch(start());
        return function() {
            if(iv.current) {
                timer.current.pause();
            }
        };
    }, []);

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
