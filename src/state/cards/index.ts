import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import size from 'lodash/size';
import uniq from 'lodash/uniq';
import store from '../store';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT, UserCardT } from '../../models';
import { PopullateCardsActionT, SetIsLoadingActionT } from './actions';
import { CardsStateT } from './models';
import { LangEnum } from '../../models';
import { ALL } from '../../constants';
import { parseRawSetsResponse } from '../../utils/parse-raw-sets-response';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';

const initialState: CardsStateT = {
    isLoaded: false,
    cards: {},
    thesaurus: {
        cards: {},
        names: [],
        sets: {},
        setTypes: [],
        setBlocks: [],
        types: [],
        languages: [...Object.values(LangEnum), ALL as LangEnum],
        parentSets: {},
    }
};

// Slice
const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setIsLoading: (state, { payload }: SetIsLoadingActionT): CardsStateT => {
            return {
                ...state,
                isLoaded: payload,
            }
        },
        popullateCards: (state, { payload }: PopullateCardsActionT): CardsStateT => {
            const { rawCards, rawSets, owner} = payload;
            const { sets, setTypes, setBlocks, codesParents, parentSets } = parseRawSetsResponse(rawSets);
            const { types, names, userCards, cardsThesaurus } = parseRawCardsResponse(rawCards, codesParents, owner);
            const unitedThesausus = {
                ...state.thesaurus.cards,
                ...cardsThesaurus,
            };

            const unitedCards = {
                ...state.cards,
            };
            Object.values(userCards).forEach((card) => {
                const cardData = Object.values(card)[0];
                unitedCards[cardData.key] = {
                    ...state.cards[cardData.key],
                    [owner]: cardData
                }
            });

            const popullapedState: CardsStateT = {
                ...state,
                cards: {
                    ...state.cards,
                    ...unitedCards,
                },
                thesaurus: {
                    ...state.thesaurus,
                    cards: unitedThesausus,
                }
            };

            popullapedState.thesaurus.names = uniq(popullapedState.thesaurus.names.concat(names));
            popullapedState.thesaurus.types = uniq(popullapedState.thesaurus.types.concat(types));

            if (!size(popullapedState.thesaurus.setBlocks)) {
                popullapedState.thesaurus.setBlocks = [...setBlocks];
            }
            if (!size(popullapedState.thesaurus.setTypes)) {
                popullapedState.thesaurus.setTypes = [...setTypes];
            }
            if (!size(popullapedState.thesaurus.sets)) {
                popullapedState.thesaurus.sets = sets;
            }
            if (!size(popullapedState.thesaurus.parentSets)) {
                popullapedState.thesaurus.parentSets = parentSets;
            }
            return popullapedState;
        }
    }
});

// Reducers
export default cardsSlice.reducer;

// Selectors

// Actions
export const actions = cardsSlice.actions;
