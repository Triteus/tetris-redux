import React, { FC, useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameState, Stats, BlockState } from "./redux/store";

interface Props {}

export const GameStats: FC<Props> = props => {
    const dispatch = useDispatch();
    const { level, points, time, nextBlock } = useSelector<GameState, Stats>(
        state => {
            return state.info;
        },
    );

    useEffect(() => {
        console.info("nextBlock changed");
    }, [nextBlock]);

    const tileWidth = useSelector<GameState, number>(state => {
        return state.tileWidth;
    });
    const tileHeight = useSelector<GameState, number>(state => {
        return state.tileHeight;
    });
    const width =
        nextBlock.fields.reduce((prev, curr) => {
            if (curr.x > prev) {
                return curr.x;
            }
            return prev;
        }, 0) + tileWidth;
    const height =
        nextBlock.fields.reduce((prev, curr) => {
            if (curr.y > prev) {
                return curr.y;
            }
            return prev;
        }, 0) + tileHeight;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 100, 100);

        if (!nextBlock) {
            return;
        }

        // draw current tetris-block
        nextBlock.fields.forEach(field => {
            ctx.strokeRect(field.x, field.y, tileWidth, tileHeight);
            ctx.fillRect(
                field.x + 2,
                field.y + 2,
                tileWidth - 4,
                tileHeight - 4,
            );
        });
    }, [nextBlock]);

    return (
        <React.Fragment>
            <label>
                <h3>Stats</h3>
                <table className="stats-table">
                    <tr>
                        <td>Level:</td>
                        <td>{level}</td>
                    </tr>
                    <tr>
                        <td>Punkte:</td>
                        <td>{points}</td>
                    </tr>
                    <tr>
                        <td>Zeit:</td>
                        <td>{time}</td>
                    </tr>
                    <tr>
                        <td>
                            Nächster <br></br> Block:
                        </td>
                        <td>
                            <canvas
                                width={width}
                                height={height}
                                ref={canvasRef}
                            ></canvas>
                        </td>
                    </tr>
                </table>
            </label>
        </React.Fragment>
    );
};
