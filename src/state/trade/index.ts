import { createSlice } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import { FilterParamNameEnum, LangEnum, PermamentTypeEnum, SortingValsEnum, OwnerT } from '../../models';
import { ALL } from '../../constants';
export { selectors } from './selectors';
import {
    AddCardToDealActionT
} from './actions';
import { TradeStateT } from './models';

const initialState: TradeStateT = {
    deals: {}
}

// Slice
const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        addCardToDeal: (state, { payload }: AddCardToDealActionT): TradeStateT => {
            const { owner, cardCode} = payload;

            const data = [{
                key: cardCode,
                quantity: 1,
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
    },
});

// Reducers
export default tradeSlice.reducer;

// Actions
export const actions = tradeSlice.actions;
