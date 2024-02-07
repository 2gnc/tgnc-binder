import { createSlice } from '@reduxjs/toolkit';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
export { selectors } from './selectors';
import {
    AddCardToDealActionT,
    RemoveCardFromDealActionT
} from './actions';
import { TradeStateT } from './models';
import { buildCardThesaurusKey } from '../helpers';

const initialState: TradeStateT = {
    dealsByOwners: {},
    dealsByCards: {},
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

            const ownerDeals = state.dealsByOwners[owner.name] ? state.dealsByOwners[owner.name]?.concat(data) : data;
            return {
                ...state,
                dealsByOwners: {
                    ...state.dealsByOwners,
                    [owner.name]: ownerDeals
                }
            }
        },
        flushDeals: (state): TradeStateT => {
            return {
                ...state,
                dealsByOwners: initialState.dealsByOwners,
                dealsByCards: initialState.dealsByCards,
            }
        },

        removeCardFromDeal: (state, { payload }: RemoveCardFromDealActionT): TradeStateT => {

            const { owner, card } = payload;
            const { condition } = card;


            const dealCardKey = buildCardThesaurusKey(card.card);
            let foundIndex = -1;
            const ownerDeals = [...state.dealsByOwners[owner]];

            const tradeItem = find(ownerDeals, (deal, i) => {
                const match = deal.key === dealCardKey && deal.condition === condition;
                if (match) {
                    foundIndex = i;
                }
                return match;
            });

            if (!tradeItem) {
                return state;
            }

            if (ownerDeals[foundIndex].quantity > 1) {
                ownerDeals[foundIndex].quantity -= 1;
            } else {
                ownerDeals.splice(foundIndex, 1);
            }
            const updatedState = {
                ...state,
                deals: {
                    ...state.dealsByOwners,
                    [owner]: ownerDeals,
                }
            };

            if (isEmpty(updatedState.deals[owner])) {
                delete updatedState.deals[owner];
            }

            return updatedState;
        }
    },
});

// Reducers
export default tradeSlice.reducer;

// Actions
export const actions = tradeSlice.actions;
