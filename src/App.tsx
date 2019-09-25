import React from "react";
import "./App.css";
import { Grid } from "./Grid";
import { GameStats } from "./GameStats";
import Help from "./Help";
import { useSelector, useDispatch } from "react-redux";
import { GameState, GameStatus } from "./redux/store";
import { start } from "./redux/actions/update";
import styled from "styled-components";

const AppContainer = styled.div`
    margin-top: 100px;
    text-align: center;
`;
const Container = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    grid-gap: 10px;
    < div: {
        align-self: start;
    }
`;
const HelpItem = styled.div`
    justify-self: end;
`;
const GridItem = styled.div`
    justify-self: stretch;
`;
const GameStatsItem = styled.div`
    justify-self: start;
    text-align: center;
`;

const StartButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;   
`;

const App: React.FC = () => {
    const gameStatus = useSelector<GameState, GameStatus>(state => {
        return state.status;
    });

    const dispatch = useDispatch();

    const startGame = () => {
        dispatch(start());
    };

    return (
        <AppContainer>

            <Container>
                <HelpItem>
                    <Help />
                </HelpItem>
                <GridItem>
                    <Grid />
                </GridItem>
                <GameStatsItem>
                    <GameStats />
                </GameStatsItem>
                <StartButtonContainer>
                    {gameStatus === GameStatus.MENU && (
                        <button onClick={startGame}>Spiel Starten</button>
                    )}
                </StartButtonContainer>
            </Container>

        </AppContainer>
    );
};

export default App;
