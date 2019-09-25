import React, { FC } from "react";
import styled from "styled-components";

interface Props {}


const Key = styled.td`
    border: 5px outset grey;
    background-color: ghostwhite;
`;

const ControlsTable = styled.table`
    > tr > td:first-child {
        text-align: left;
        padding: 4px 20px 4px 2px;
        }
`;

// TODO: Get all available controls from store

const Help: FC<Props> = props => {
    return (
        <label>
            <h3>Steuerung</h3>
            <ControlsTable>
                <tr>
                    <td>Zurücksetzen</td>
                    <Key>R</Key>
                </tr>
                <tr>
                    <td>Pausieren/Fortsetzen</td>
                    <Key>P</Key>
                </tr>
                <tr>
                    <td>Rotieren</td>
                    <Key>W</Key>
                </tr>
                <tr>
                    <td>Sofort nach unten</td>
                    <Key>STRG</Key>
                </tr>
                <tr>
                    <td>Nach links</td>
                    <Key>A</Key>
                </tr>
                <tr>
                    <td>Nach rechts</td>
                    <Key>D</Key>
                </tr>
                <tr>
                    <td>Schneller nach unten</td>
                    <Key>S</Key>
                </tr>
            </ControlsTable>
        </label>
    );
};

export default Help;
