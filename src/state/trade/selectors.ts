import map from 'lodash/map';
import values from 'lodash/values';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';
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
    return map(dealCardsKeys, ({ key }) => {
        if (!key) return;
        return thesaurus.cards[key]
    });
});

export const selectors = {
    cardsInDeals,
};
