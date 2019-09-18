import { Ref, useEffect, useRef } from "react";

export const useCanvas = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawTile = () => {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if(ctx) {
            
            }
        }
    }


    useEffect(() => {
        if(!canvasRef)
        return;
        const ctx = canvasRef.current;

    })

    return canvasRef;
}