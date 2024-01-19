import React from 'react';
import { tunePrice } from '../utils/tune-price';
import { buildPeculiarities } from '../utils/build-peculiarities';

type TablePropsT = {
    header: string;
    cards: Array<CardT>
}

type CardT = {
    Is_foil: string;
    Frame: string;
    Lang: string;
    Rarity: string;
    Price1: string;
    Price2: string;
    Price3: string;
    Price4: string;
    id: string;
    Qtty: string;
    Name: string;
    Set: string;
    Colors: string;
    Number: string;
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
                    const isFoil = card.Is_foil === 'true';
                    const perticularities = buildPeculiarities(isFoil, card.Frame);
                    const calculatedPrice = tunePrice({
                    isFoil,
                    isRu: card.Lang === 'ru',
                    isRare: card.Rarity === 'rare',
                    isMyphic: card.Rarity === 'myphic',
                    tcgFoil: parseInt(card.Price2, 10),
                    tcgNonFoil: parseInt(card.Price1, 10),
                    cardMarketFoil: parseInt(card.Price4, 10),
                    cardMarketNonFoil: parseInt(card.Price3, 10),
                    });

                    return (
                    <tr key={card.id} >
                        <td>{card.Qtty}</td>
                        <td>{card.Name}</td>
                        <td>{perticularities}</td>
                        <td>{`${card.Set} #${card.Number}`}</td>
                        <td>{card.Lang}</td>
                        <td>{calculatedPrice}</td>
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
