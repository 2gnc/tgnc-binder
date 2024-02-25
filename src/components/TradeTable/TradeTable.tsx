import React, { useEffect, useState } from 'react';
import { type CardT, ColorEnum, UserCardsT, CardThesaurusT, UserCardMetaT, CardThesaurusItemT } from '../../models';
import { TradeGroupedTable } from './TradeGroupedTable';
import entries from 'lodash/entries'; 
import map from 'lodash/map';
import values from 'lodash/values';

type TablePropsT = {
    cards: UserCardsT;
    thesaurus: CardThesaurusT;
}

const TradeTable: React.FC<TablePropsT> = ({ cards, thesaurus }) => {
    const [collection, setCollection] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const collection = urlParams.get('collection') || '';
        setCollection(collection);
    }, []);

    const byColors: Record<string, Array<UserCardMetaT & { data: CardThesaurusItemT }>> = {
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

    const cardsArr = map(map(values(cards), itm => itm['']), (item) => {
      return {
        ...item,
        data: thesaurus[item.key]
      }
    });

    cardsArr.forEach(card => {
        if ((!collection || !card.collections.includes(collection)) && collection !== 'all') {
            return;
        }

        if (card.data.colors.length > 1) {
          byColors.multicolor.push(card);
          return;
        }
        if (
          card.data.colors.includes(ColorEnum.COLORLESS)
          && !card.data.isLand
          && !card.data.isToken
        ) {
          byColors.colorless.push(card);
          return;
        }
        if (
          card.data.colors.includes(ColorEnum.COLORLESS)
          && card.data.isLand
        ) {
          byColors.lands.push(card);
          return;
        }
        if (
          card.data.colors.includes(ColorEnum.COLORLESS)
          && card.data.isToken
        ) {
          byColors.tokens.push(card);
          return;
        }
    
        if (card.data.colors.length === 1) {
          switch(card.data.colors[0]) {
            case ColorEnum.WHITE:
              byColors.white.push(card);
              return;
            case ColorEnum.BLUE:
              byColors.blue.push(card);
              return;
            case ColorEnum.BLACK:
              byColors.black.push(card);
              return;
            case ColorEnum.RED:
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
