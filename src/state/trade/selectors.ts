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

import { DealByCardT } from './models';

const dealsByOwners = (state: RootState) => state.trade.dealsByOwners;
const requestsByOwners = (state: RootState) => state.trade.requestsByOwners;
const dealsbyCards = (state: RootState) => state.trade.dealsByCards;
const requestsByCards = (state: RootState) => state.trade.requestsByCards;

const orderingCard = (state: RootState) => state.trade.orderingCard;

const cardsInDeals = createSelector([dealsByOwners, cardsThesaurus], (deals, thesaurus) => {
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

const cardsInRequests = createSelector([requestsByOwners, cardsThesaurus], (requests, thesaurus) => {
    const requestCardsKeys = entries(requests);
    const usersRequests: UsersDealsT = [];

    forEach(requestCardsKeys, ([owner, dealItem]) => {
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

        usersRequests.push({
            owner,
            cards,
        });
    });

    return usersRequests;
});

const pickedCardsCount = createSelector([cardsInDeals, cardsInRequests], (inDeals, inRequests) => {
    return inDeals.concat(inRequests).reduce((acc, val) => {
        return acc + val.cards.reduce((acc, val) => acc + val.quantity, 0);
    }, 0);
});

const addedInDealsQuantity = createSelector([dealsbyCards], (cards) => {
    return calculateInDealsCards(cards);
});

export const selectors = {
    cardsInDeals,
    cardsInRequests,
    pickedCardsCount,
    addedInDealsQuantity,
    orderingCard,
    requestsByCards,
    dealsbyCards,
};

function calculateInDealsCards(cards: Record<string, DealByCardT>): Record<string, Record<ConditionEnum, number>> {
    const result = {} as Record<string, Record<ConditionEnum, number>>;
    forEach(entries(cards), ([cardKey, conditions]) => {
        forEach(entries(conditions), ([condition, deals]) => {
            let counter = 0;
            forEach(values(deals), (quantity) => {
                counter += quantity;
            });
            if(!result[cardKey]) {
                result[cardKey] = {} as Record<ConditionEnum, number>;
            }
            result[cardKey][condition as ConditionEnum] = counter;
        });
    });
    return result;
};
