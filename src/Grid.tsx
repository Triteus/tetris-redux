import React, { FC, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { GameState, BlockState } from "./redux/store";
import { Field } from "./models/Field";
import { FieldType } from "./models/FieldType";
import { useGameLoop } from "./hooks/useGameLoop";

interface Props {}

export const Grid: FC<Props> = props => {
    const grid = useSelector<GameState, Field[]>(state => {
        return state.grid;
    });

    const block = useSelector<GameState, BlockState>(state => {
        return state.currBlock;
    });

    const width = useSelector<GameState, number>(state => {
        return state.width;
    });

    const height = useSelector<GameState, number>(state => {
        return state.height;
    });

    const tileWidth = useSelector<GameState, number>(state => {
        return state.tileWidth;
    });

    const tileHeight = useSelector<GameState, number>(state => {
        return state.tileWidth;
    });

 
    const updateCounter = useSelector<GameState, number>(state => {
        return state.updateCounter;
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useGameLoop();
    
    
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        grid.forEach(field => {
            if(field.getType() === FieldType.EMPTY) {
                ctx.clearRect(
                    field.getPos().x,
                    field.getPos().y,
                    tileWidth,
                    tileHeight,
                    ); 
            } else {
                ctx.fillRect(
                    field.getPos().x,
                    field.getPos().y,
                    tileWidth,
                    tileHeight,
                    );
                }
            });

            block.fields.forEach((field) => {
                ctx.fillRect(
                    field.x,
                    field.y,
                    tileWidth,
                    tileHeight,
                    );
            })

        }, [updateCounter]);
   
        
        return (
            <React.Fragment>
            <canvas
                style={{border: 'solid 1px black'}}
                ref={canvasRef}
                id="tutorial"
                width={width}
                height={height}
            ></canvas>
        </React.Fragment>
    );
};
