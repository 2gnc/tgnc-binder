import React, { type FC } from 'react';
import { UserCardMetaT, CardThesaurusItemT, GalleryCardT } from '../../models';
import { calculatePrice } from '../../utils/tune-price';

type PropsT = {
    cards: Array<UserCardMetaT & { data: CardThesaurusItemT }>;
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
                    <th>Qty</th>
                    <th>Name</th>
                    <th>Details</th>
                    <th>Set</th>
                    <th>Language</th>
                    <th>Price, rub</th>
                </tr>
            </thead>
            <tbody>
            {
                cards.map(card => {
                    const calcData = {
                        card: card.data,
                        meta: card,
                    };

                    return (
                    <tr key={card.key}>
                        <td style={{border: '1px solid silver'}}>{card.quantity}</td>
                        <td style={{border: '1px solid silver'}}>
                            {card.data.name}
                            { card.data.ruName && (<><br /> <span>{card.data.ruName}</span></>) }
                        </td>
                        <td style={{border: '1px solid silver'}}>{card.data.perticularities}</td>
                        <td style={{border: '1px solid silver'}}>{`${card.data.set} #${card.data.number}`}</td>
                        <td style={{border: '1px solid silver'}}>{card.data.lang}</td>
                        <td style={{border: '1px solid silver'}}>{calculatePrice(calcData)}</td>
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
