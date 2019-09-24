import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid } from "./Grid";
import { GameStats } from "./GameStats";
import Help from "./Help";
import { useSelector, useDispatch } from "react-redux";
import { GameState, GameStatus } from "./redux/store";
import { start } from "./redux/actions/update";

const App: React.FC = () => {
    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const dispatch = useDispatch();

    const startGame = () => {
        dispatch(start());
    };

    return (
        <div className="App">
            <div className="container">
                <div className="item-a">
                    <Help/>
                </div>
                <div className="item-b">
                    <Grid/>
                </div>
                <div className="item-c">
                    <GameStats/>
                </div>
                <div className="start-button" style={{display: 'flex', justifyContent: 'center'}}>
                    {gameStatus === GameStatus.MENU && (
                        <button onClick={startGame}>Spiel Starten</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
