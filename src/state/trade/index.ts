import { createSlice } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import entries from 'lodash/entries';
import { FilterParamNameEnum, LangEnum, PermamentTypeEnum, SortingValsEnum, OwnerT, TradeItemT } from '../../models';
import { ALL } from '../../constants';
export { selectors } from './selectors';
import {
    AddCardToDealActionT,
    RemoveCardFromDealActionT
} from './actions';
import { TradeStateT } from './models';
import { buildCardThesaurusKey, buildCardDealKey } from '../helpers';

const initialState: TradeStateT = {
    deals: {}
}

// Slice
const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        addCardToDeal: (state, { payload }: AddCardToDealActionT): TradeStateT => {
            const { owner, cardKey, condition } = payload;

            const data = [{
                key: cardKey,
                quantity: 1,
                condition,
            }];

            const ownerDeals = state.deals[owner.name] ? state.deals[owner.name]?.concat(data) : data;
            return {
                ...state,
                deals: {
                    ...state.deals,
                    [owner.name]: ownerDeals
                }
            }
        },
        flushDeals: (state): TradeStateT => {
            return {
                ...state,
                deals: initialState.deals,
            }
        },

        removeCardFromDeal: (state, { payload }: RemoveCardFromDealActionT): TradeStateT => {
            // const { owner, tradeItem } = payload;
            // const { key, quantity } = tradeItem;
            // const ownerDealToUpdate = find(entries(state.deals), ([trader]) => trader === owner);
            // if (isNil(ownerDealToUpdate)) {
            //     return state;
            // }

            // const dealItemToUpdate = find(entries(ownerDealToUpdate), ([,item]) => item.key)

            return {
                ...state,
            }
        }
    },
});

// Reducers
export default tradeSlice.reducer;

// Actions
export const actions = tradeSlice.actions;
