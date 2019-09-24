import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update, start, intervalUpdate } from "../redux/actions/update";
import { GameStatus, GameState } from "../redux/store";
import { Timer } from "../redux/helpers/timer";


export const useGameLoop = () => {
    const time = 1000;
    let iv = useRef<any>(null);
    
    const loop = () => {
        dispatch(intervalUpdate(time));
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
        timer.current = Timer(loop, 1000 - level * 100);
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
