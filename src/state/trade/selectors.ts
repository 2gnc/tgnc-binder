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
import { UsersDealsT, TradeItemT, ConditionEnum, CardInDealT } from '../../models';

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
    const usersDeals: UsersDealsT = [];

    forEach(dealCardsKeys, ([owner, dealItem]) => {
        const hash = {} as Record<string, Record<ConditionEnum, number>>;
        forEach(dealItem, (item) => {
            const { quantity, condition, key } = item;
            if (!hash[key]) {
                hash[key] = {} as Record<ConditionEnum, number>;

                forEach(values(ConditionEnum), (value) => {
                    hash[key][value] = 0;
                });
            }
            hash[key][condition] = hash[key][condition] + quantity;
        });

        const cards: Array<CardInDealT> = [];
        forEach(entries(hash), ([key, data]) => {
            forEach(entries(data), ([condition, quantity]) => {
                if (quantity) {
                    cards.push({
                        card: thesaurus.cards[key],
                        quantity,
                        condition: condition as ConditionEnum,
                    });
                }
            })
        });

        usersDeals.push({
            owner,
            cards,
        });
    });
    return usersDeals;
});

const pickedCardsCount = createSelector([cardsInDeals], (inDeals) => {
    return inDeals.reduce((acc, val) => {
        return acc + val.cards.reduce((acc, val) => acc + val.quantity, 0);
    }, 0);
})

export const selectors = {
    cardsInDeals,
    pickedCardsCount,
};
