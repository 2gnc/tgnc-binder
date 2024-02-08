import { createSlice } from '@reduxjs/toolkit';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
export { selectors } from './selectors';
import {
    AddCardToDealActionT,
    RemoveCardFromDealActionT
} from './actions';
import { TradeStateT } from './models';
import { buildCardThesaurusKey } from '../helpers';
import { ConditionEnum } from '../../models';

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

            const cardDeals = {...state.dealsByCards[cardKey]};
            if (isEmpty(cardDeals)) {
                forEach(values(ConditionEnum), (cond) => {
                    cardDeals[cond] = {};
                });
                cardDeals[condition] = { [owner.name]: 1 }
            } else {
                cardDeals[condition] = {
                    ...state.dealsByCards[cardKey][condition],
                    [owner.name]: state.dealsByCards[cardKey][condition] ? state.dealsByCards[cardKey][condition][owner.name] + 1 : 1
                }
            }

            return {
                ...state,
                dealsByOwners: {
                    ...state.dealsByOwners,
                    [owner.name]: ownerDeals
                },
                dealsByCards: {
                    ...state.dealsByCards,
                    [cardKey]: {
                        ...cardDeals
                    }
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

            const updatedCradDeals = {
                ...state.dealsByCards[dealCardKey],
                [condition]: {
                    ...state.dealsByCards[dealCardKey][condition]
                }
            }
            if (updatedCradDeals[condition][owner] === 1) {
                delete updatedCradDeals[condition][owner];
            } else {
                updatedCradDeals[condition][owner] -= 1;
            }

            const updatedState: TradeStateT = {
                ...state,
                dealsByOwners: {
                    ...state.dealsByOwners,
                    [owner]: ownerDeals,
                },
                dealsByCards: {
                    ...state.dealsByCards,
                    [dealCardKey]: updatedCradDeals,
                },
            };

            if (isEmpty(updatedState.dealsByOwners[owner])) {
                delete updatedState.dealsByOwners[owner];
            }

            return updatedState;
        }
    },
});

// Reducers
export default tradeSlice.reducer;

// Actions
export const actions = tradeSlice.actions;
