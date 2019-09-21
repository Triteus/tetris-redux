import React, { FC } from "react";

interface Props {}


// TODO: Get all available controls from store

const Help: FC<Props> = props => {
    return (
        <label>
            <h3>Steuerung</h3>
            <table className='controls-table'>
                <tr>
                    <td>Zurücksetzen</td>
                    <td className='key'>R</td>
                </tr>
                <tr>
                    <td>Pausieren/Fortsetzen</td>
                    <td className='key'>P</td>
                </tr>
                <tr>
                    <td>Rotieren</td>
                    <td className='key'>W</td>
                </tr>
                <tr>
                    <td>Sofort nach unten</td>
                    <td className='key'>STRG</td>
                </tr>
                <tr>
                    <td>Nach links</td>
                    <td className='key'>A</td>
                </tr>
                <tr>
                    <td>Nach rechts</td>
                    <td className='key'>D</td>
                </tr>
                <tr>
                    <td>Schneller nach unten</td>
                    <td className='key'>S</td>
                </tr>
            </table>
        </label>
    );
};

export default Help;
