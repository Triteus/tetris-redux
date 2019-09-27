import React, { FC, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameState, GameStatus, BlockState, FieldCoords } from "./redux/store";
import { Field } from "./models/Field";
import { FieldType } from "./models/FieldType";
import { useGameLoop } from "./hooks/useGameLoop";
import { useInputHandler } from "./hooks/useInputHandler";
import { collides, collidesBottom } from "./redux/helpers/collision";
import { Vec2D } from "./models/Grid";
import { translateBlock } from "./redux/helpers/transform";

interface Props {}

const drawBlock = (
    ctx: CanvasRenderingContext2D,
    color = "black",
    block: BlockState,
    tileWidth: number,
    tileHeight: number,
) => {
    ctx.fillStyle = color;
    block.fields.forEach(field => {
        ctx.clearRect(field.x, field.y, tileWidth, tileHeight);
        ctx.strokeRect(field.x, field.y, tileWidth, tileHeight);
        ctx.fillRect(field.x + 2, field.y + 2, tileWidth - 4, tileHeight - 4);
    });
    ctx.fillStyle = "black";
};

export const Grid: FC<Props> = props => {

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

    const shadowBlock = useMemo(() => {
        if (block.fields.length === 0) {
            // no block was set
            return { fields: [] };
        }
        debugger;
        let shadowBlock = block;
        while (
            !collides(
                shadowBlock.fields,
                grid,
                new Vec2D(tileWidth, tileHeight),
            ) &&
            !collidesBottom(shadowBlock.fields, height)
        ) {
            shadowBlock = translateBlock(shadowBlock, 0, tileHeight);
        }
        return translateBlock(shadowBlock, 0, -tileHeight);
    }, [grid, block, height, tileHeight, tileWidth]);

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
        //draw collision shadow of current block
        drawBlock(ctx, "grey", shadowBlock, tileWidth, tileHeight);
        // draw current tetris-block
        drawBlock(ctx, "black", block, tileWidth, tileHeight);
    }, [updateCounter]);

    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    return (
        <React.Fragment>
            <canvas
                style={{ border: "solid 1px black" }}
                ref={canvasRef}
                id="grid"
                width={width}
                height={height}
            ></canvas>
            {gameStatus === GameStatus.GAME_OVER && <h1>Game Over!</h1>}
            {gameStatus === GameStatus.PAUSED && <h1>Paused</h1>}
        </React.Fragment>
    );
};
