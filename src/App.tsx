import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid } from "./Grid";
import { GameStats } from "./GameStats";
import Help from "./Help";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="container">
                <div className='item-a'>
                    <Help></Help>
                </div>
                <div className='item-b'>
                    <Grid></Grid>
                </div>
                <div className='item-c'>
                    <GameStats></GameStats>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default App;
