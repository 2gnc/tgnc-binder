import map from 'lodash/map';
import values from 'lodash/values';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';
import forEach from 'lodash/forEach';
import entries from 'lodash/entries';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, Thunk, Dispatch } from '../store';
import { cardsThesaurus } from '../cards/selectors';
import { ALL } from '../../constants';
import { UsersDealsT } from './models'

import {
    LangEnum,
    PermamentTypeEnum,
    SortingDirectionEnum,
    SortingValsEnum,
    TypeEnum,
    CardThesaurusItemT,
    GalleryCardT,
    UserCardMetaT,
    GalleryCardMetaT,
} from '../../models';

const deals = (state: RootState) => state.trade.deals;
const cardsInDeals = createSelector([deals, cardsThesaurus], (deals, thesaurus) => {

    const dealCardsKeys = entries(deals);

    const usersDeals: Array<{
        owner: string,
        cards: Array<{
            card: CardThesaurusItemT;
            quantity: number;
        }>
    }> = [];
    
    forEach(dealCardsKeys, ([owner, dealItem]) => {
        const hash = {} as Record<string, number>;

        forEach(dealItem, (item) => {
            if (!hash[item.key]) {
                hash[item.key] = 1;
            } else {
                hash[item.key] += 1;
            }
        });
        usersDeals.push({
            owner,
            cards: map(entries(hash), ([key, quantity]) => {
                return {
                    card: thesaurus.cards[key],
                    quantity
                };
            }),
        });
    });
    return usersDeals;
});

const pickedCardsCount = createSelector([cardsInDeals], (indeals) => {
    return indeals.reduce((acc, val) => {
        return acc + val.cards.reduce((acc, val) => acc + val.quantity, 0);
    }, 0);
})

export const selectors = {
    cardsInDeals,
    pickedCardsCount,
};
