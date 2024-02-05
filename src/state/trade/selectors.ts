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
import { TradeItemT } from './models'

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
    const dealCardsKeys = flatMap(compact(values(deals)));
    const hash = {} as Record<string, number>;
    forEach(dealCardsKeys, (dealCard) => {
        if (!hash[dealCard.key]) {
            hash[dealCard.key] = 1;
        } else {
            hash[dealCard.key] += 1;
        }
    });
    return map(entries(hash), ([key, quantity]) => {
        return {
            card: thesaurus.cards[key],
            quantity
        };
    });
});

export const selectors = {
    cardsInDeals,
};
