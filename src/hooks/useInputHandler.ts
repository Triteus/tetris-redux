import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { moveLeft, moveRight, rotateRight, smash, update } from "../redux/actions/update";


export const useInputHandler = () => {


    const dispatch = useDispatch();

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            console.log(event.key);
            if(event.key === 'a') {
                dispatch(moveLeft())
            } else if(event.key === 'd') {
                dispatch(moveRight());
            } else if(event.key === 's') {
                dispatch(update()); 
            } else if(event.key === 'w') {
                dispatch(rotateRight());
            } else if(event.key === 'Control') {
                dispatch(smash());
            }
        })
    }, [dispatch]);

}