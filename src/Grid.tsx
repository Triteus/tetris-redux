import React, { FC, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameState, GameStatus, BlockState } from "./redux/store";
import { Field } from "./models/Field";
import { FieldType } from "./models/FieldType";
import { useGameLoop } from "./hooks/useGameLoop";
import { useInputHandler } from "./hooks/useInputHandler";

interface Props {}

export const Grid: FC<Props> = props => {
    const dispatch = useDispatch();

    const grid = useSelector<GameState, Field[][]>(state => {
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

    const firstRowPos = useMemo(() => {
        return block.fields.reduce((prev, curr) => {
            if (curr.y < prev) {
                return curr.y;
            }
            return prev;
        }, Number.MAX_SAFE_INTEGER);
    }, [block]);

    const colPosRange = useMemo(() => {
        return block.fields.reduce(
            (prev, curr) => {
                if (!prev.includes(curr.x)) {
                    return [...prev.slice(), curr.x];
                }
                return prev;
            },
            [] as number[],
        );
    }, [block]);

    const updateCounter = useSelector<GameState, number>(state => {
        return state.updateCounter;
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useGameLoop();
    useInputHandler();

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // clear everything before redrawing
        ctx.clearRect(0, 0, width, height);

        // draw existing fields
        for (let cols of grid) {
            for (let field of cols) {
                const { x, y } = field.getPos();
                if (field.getType() === FieldType.BLOCK) {
                    ctx.fillRect(x + 2, y + 2, tileWidth - 4, tileHeight - 4);
                } else {
                    // print path of current block
                    if (colPosRange.includes(x)) {
                        ctx.fillStyle = "steelblue";
                        ctx.fillRect(x, y, tileWidth, tileHeight);
                        ctx.fillStyle = "black";
                    }
                }
                ctx.strokeRect(x, y, tileWidth, tileHeight);
            }
        }

        // draw current tetris-block
        block.fields.forEach(field => {
            ctx.clearRect(field.x, field.y, tileWidth, tileHeight);
            ctx.strokeRect(field.x, field.y, tileWidth, tileHeight);
            ctx.fillRect(
                field.x + 2,
                field.y + 2,
                tileWidth - 4,
                tileHeight - 4,
            );
        });
    }, [updateCounter]);

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    return (
        <React.Fragment>
            <canvas
                style={{ border: "solid 1px black" }}
                ref={canvasRef}
                id="tutorial"
                width={width}
                height={height}
            ></canvas>
            {gameStatus === GameStatus.GAME_OVER && <h1>Game Over!</h1>}
            {gameStatus === GameStatus.PAUSED && <h1>Paused</h1>}
        </React.Fragment>
    );
};
