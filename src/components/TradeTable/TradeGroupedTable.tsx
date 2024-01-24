import React, { type FC } from 'react';
import { CardT } from '../../models';
import { tunePrice } from '../../utils/tune-price';

type PropsT = {
    cards: Array<CardT>;
    color: string;
}

export const TradeGroupedTable: FC<PropsT> = ({ cards, color }) => {
    if (!cards.length) {
        return null;
    }
    
    return (
        <>
            <h2>{ color }</h2>
            <table style={{
                borderCollapse: 'collapse'
            }}>
            <thead> 
                <tr>
                    <th>Количество</th>
                    <th>Название</th>
                    <th>Особенности</th>
                    <th>Сет</th>
                    <th>Язык</th>
                    <th>Цена, руб</th>
                </tr>
            </thead>
            <tbody>
            {
                cards.map(card => {
                    return (
                    <tr key={card.id}>
                        <td style={{border: '1px solid silver'}}>{card.quantity}</td>
                        <td style={{border: '1px solid silver'}}>
                            {card.name}
                            { card.ruName && (<><br /> <span>{card.ruName}</span></>) }
                        </td>
                        <td style={{border: '1px solid silver'}}>{card.perticularities}</td>
                        <td style={{border: '1px solid silver'}}>{`${card.set} #${card.number}`}</td>
                        <td style={{border: '1px solid silver'}}>{card.lang}</td>
                        <td style={{border: '1px solid silver'}}>{tunePrice(card)}</td>
                    </tr>
                    )
                })
            }
            </tbody>
            <tfoot></tfoot>
        </table>
      </>
    )
}
