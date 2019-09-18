import { useEffect, useRef } from "react"
import { clearInterval } from "timers";
import { useDispatch } from "react-redux";
import { update, start } from "../redux/actions/update";


export const useGameLoop = () => {


    const reset = false;
    const time = 1000;
    let iv = useRef<any>(null);

    const loopHandler = () => {
        
    }

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(start());
        iv.current = setInterval(() => {
            dispatch(update())
        }, time)
        return function () {
            clearInterval(iv.current);
        }
    }, [])

    useEffect(() => {
        if(reset) {
            clearInterval(iv.current);
        }
    }, [reset])


}