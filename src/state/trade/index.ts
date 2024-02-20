import { createSlice } from '@reduxjs/toolkit';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
export { selectors } from './selectors';
import {
    AddCardToDealActionT,
    RemoveCardFromDealActionT,
    SetOrderingCardActionT,
    RequestTradeActionT,
} from './actions';
import { TradeStateT, DealByCardT } from './models';
import { buildCardThesaurusKey } from '../helpers';
import { ConditionEnum, OwnerT } from '../../models';

type DataT = [{
    key: string;
    quantity: number;
    condition: ConditionEnum;
}]

const initialState: TradeStateT = {
    dealsByOwners: {},
    dealsByCards: {},
    requestsByOwners: {},
    requestsByCards: {},
    orderingCard: null,
}

// Slice
const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        setOrderingCard: (state, { payload }: SetOrderingCardActionT): TradeStateT => {
            return {
                ...state,
                orderingCard: payload,
            }
        },
        addCardToDeal: (state, { payload }: AddCardToDealActionT): TradeStateT => {
            const { owner, cardKey, condition } = payload;

            const data: DataT = [{
                key: cardKey,
                quantity: 1,
                condition,
            }];

            const ownerDeals = state.dealsByOwners[owner] ? state.dealsByOwners[owner]?.concat(data) : data;
            
            const cardDeals = buildByCardsData(state.dealsByCards[cardKey], owner, data);

            return {
                ...state,
                dealsByOwners: {
                    ...state.dealsByOwners,
                    [owner]: ownerDeals
                },
                dealsByCards: {
                    ...state.dealsByCards,
                    [cardKey]: {
                        ...cardDeals
                    }
                }
            }
        },
        addCardToRequest: (state, { payload }: RequestTradeActionT): TradeStateT => {
            const { owner, cardKey, condition } = payload;

            const data: DataT = [{
                key: cardKey,
                quantity: 1,
                condition,
            }];

            const ownerRequests = state.requestsByOwners[owner] ? state.requestsByOwners[owner]?.concat(data) : data;
            const cardRequests = buildByCardsData(state.requestsByCards[cardKey], owner, data);

            return {
                ...state,
                requestsByOwners: {
                    ...state.requestsByOwners,
                    [owner]: ownerRequests,
                },
                requestsByCards: {
                    ...state.requestsByCards,
                    [cardKey]: {
                        ...cardRequests
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

        flushRequests: (state): TradeStateT => {
            return {
                ...state,
                requestsByCards: initialState.requestsByCards,
                requestsByOwners: initialState.requestsByOwners,
            }
        },

        removeCardFromDeal: (state, { payload }: RemoveCardFromDealActionT): TradeStateT => {
            const { owner, key, condition } = payload;

            let foundIndex = -1;
            const ownerDeals = [...state.dealsByOwners[owner]];

            const tradeItem = find(ownerDeals, (deal, i) => {
                const match = deal.key === key && deal.condition === condition;
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
                ...state.dealsByCards[key],
                [condition]: {
                    ...state.dealsByCards[key][condition]
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
                    [key]: updatedCradDeals,
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

function buildByCardsData(deals: DealByCardT, owner: string, data: DataT ): DealByCardT {
    const cardDeals = {...deals};
    const [{ condition, quantity, key }] = data;


    if (isEmpty(cardDeals)) {
        forEach(values(ConditionEnum), (cond) => {
            cardDeals[cond] = {} as DealByCardT;
        });
        cardDeals[condition] = { [owner]: 1 }
    } else {
        cardDeals[condition] = {
            ...deals[condition],
            [owner]: deals[condition][owner] ? deals[condition][owner] + 1 : 1
        }
    }
    return cardDeals;
}
