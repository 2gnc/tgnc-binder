import React, { useEffect, useState } from 'react';
import { type CardT, ColorsEnum } from '../../models';
import { TradeGroupedTable } from './TradeGroupedTable';
import entries from 'lodash/entries'; 
import map from 'lodash/map';

type TablePropsT = {
    cards: Array<CardT>
}

const TradeTable: React.FC<TablePropsT> = ({ cards }) => {
    const [collection, setCollection] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const collection = urlParams.get('collection') || '';
        setCollection(collection);
    }, []);

    const byColors: Record<string, Array<CardT>> = {
        multicolor: [],
        colorless: [],
        lands: [],
        tokens: [],
        white: [],
        blue: [],
        black: [],
        red: [],
        green: []
    };

    cards.forEach(card => {
        if ((!collection || !card.collections.includes(collection)) && collection !== 'all') {
            return;
        }

        if (card.colors.length > 1) {
          byColors.multicolor.push(card);
          return;
        }
        if (
          card.colors.includes(ColorsEnum.COLORLESS)
          && !card.isLand
          && !card.isToken
        ) {
          byColors.colorless.push(card);
          return;
        }
        if (
          card.colors.includes(ColorsEnum.COLORLESS)
          && card.isLand
        ) {
          byColors.lands.push(card);
          return;
        }
        if (
          card.colors.includes(ColorsEnum.COLORLESS)
          && card.isToken
        ) {
          byColors.tokens.push(card);
          return;
        }
    
        if (card.colors.length === 1) {
          switch(card.colors[0]) {
            case ColorsEnum.WHITE:
              byColors.white.push(card);
              return;
            case ColorsEnum.BLUE:
              byColors.blue.push(card);
              return;
            case ColorsEnum.BLACK:
              byColors.black.push(card);
              return;
            case ColorsEnum.RED:
              byColors.red.push(card);
              return;
            default:
              byColors.green.push(card);
              return;
          }
        }
      });

    return (
        <>
            <h1>{ collection }</h1>
            { map(entries(byColors), ([ color, cards ]) => <TradeGroupedTable key={ color } cards={ cards } color={ color } />) }
        </>
    )
}

export default TradeTable;
