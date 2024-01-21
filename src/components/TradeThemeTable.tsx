import React from 'react';
import { tunePrice } from '../utils/tune-price';
import { type CardT } from '../models';

type TablePropsT = {
    header: string;
    cards: Array<CardT>
}

const Table: React.FC<TablePropsT> = ({ header, cards }) => {
    return (
        <>
            <h2>{header}</h2>
            <table>
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
                    <tr key={card.id} >
                        <td>{card.quantity}</td>
                        <td>{card.name}</td>
                        <td>{card.perticularities}</td>
                        <td>{`${card.set} #${card.number}`}</td>
                        <td>{card.lang}</td>
                        <td>{tunePrice(card)}</td>
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

export default Table;
