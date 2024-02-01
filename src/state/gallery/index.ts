import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import store from '../store';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT, FilterParamNameEnum, LangEnum, PermamentTypeEnum, ColorEnum, SortingValsEnum } from '../../models';
import { ALL } from '../../constants';
import { nonEmptyStringsArrTransformer } from '../transformers';
import { parseRawSetsResponse } from '../../utils/parse-raw-sets-response';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';
export { selectors } from './selectors';
import {
    GalleryDataReceivedActionT,
    SetCollectionFilterActionT,
    RemoveCollectionFilterActionT,
    SetSearchValueActionT,
    ResetCollectionFilterActionT,
    SetSoringActionT,
    SetLastPickedForTradeActionT,
} from './actions';
import { CardsStateT } from './models';

const initialState: CardsStateT = {
    owner: null,
    cards: [],
    filters: {
        [FilterParamNameEnum.COLLECTION]: [ALL],
        [FilterParamNameEnum.TYPE]: [],
        [FilterParamNameEnum.COLOR]: [],
        [FilterParamNameEnum.LANG]: [ALL as LangEnum],
        [FilterParamNameEnum.SET]: [],
        [FilterParamNameEnum.NAME]: []
    },
    searchValues: {
        [FilterParamNameEnum.SET]: '',
        [FilterParamNameEnum.NAME]: '',
        [FilterParamNameEnum.TYPE]: '',
    },
    sorting: SortingValsEnum.NAME_ASC,
    thesaurus: {
        collections : [],
        sets: {},
        setTypes: [],
        setBlocks: [],
        parentSets: {},
        languages: [...Object.values(LangEnum), ALL as LangEnum],
        names: [],
        types: [],
    },
    lastPickedForTrade: null,
};

// Slice
const gallerySlice = createSlice({
  name: 'ownerGallery',
  initialState,
  reducers: {
    galleryPageDataReceived: (state, action: GalleryDataReceivedActionT): CardsStateT => {
        const { rawCards, rawSets, owner } = action.payload;
        const { sets, setTypes, setBlocks, codesParents, parentSets } = parseRawSetsResponse(rawSets);
        const { cards, collections, types, names, userCards } = parseRawCardsResponse(rawCards, codesParents);

        console.log({ userCards })

        return {
            ...state,
            owner,
            cards,
            thesaurus: {
                ...state.thesaurus,
                collections: [...nonEmptyStringsArrTransformer(collections), ALL],
                sets,
                setTypes: [...setTypes],
                setBlocks: [...setBlocks],
                parentSets,
                names,
                types,
            }
        }

    },
    setFilter: (state, { payload }: SetCollectionFilterActionT): CardsStateT => {
        const { filter, value } = payload;
        let filters = uniq(state.filters[payload.filter]);

        // spell type: card - token
        const spellTypeValues = Object.values(PermamentTypeEnum);
        const isSpellTypeFilter = filter === FilterParamNameEnum.TYPE && spellTypeValues.includes(value as PermamentTypeEnum);
        if (isSpellTypeFilter) {
            filters = filters.filter((item) => item !== PermamentTypeEnum.CARD && item !== PermamentTypeEnum.TOKEN)
        };

        const soloFilters = [
            FilterParamNameEnum.COLLECTION,
            FilterParamNameEnum.LANG,
        ];
        const isSoloFilter = soloFilters.includes(filter);
        if (isSoloFilter) {
            filters.length = 0;
        }

        filters.push(payload.value);

        return {
            ...state,
            filters: {
                ...state.filters,
                [payload.filter]: [...filters],
            }
        }
    },
    removeFilter: (state, { payload }: RemoveCollectionFilterActionT): CardsStateT => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [payload.filter]: filter(state.filters[payload.filter], (val) => val !== payload.value)
            }
        }
    },
    resetFilter: (state, { payload }: ResetCollectionFilterActionT): CardsStateT => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [payload]: initialState.filters[payload],
            }
        }
    },
    flushFilters: (state): CardsStateT => {
        return {
            ...state,
            filters: initialState.filters,
            searchValues: initialState.searchValues,
        }
    },
    setSearchValue: (state, { payload }: SetSearchValueActionT): CardsStateT => {
        return {
            ...state,
            searchValues: {
                ...state.searchValues,
                [payload.entity]: payload.value,
            }
        }
    },
    setSorting: (state, { payload }: SetSoringActionT): CardsStateT => {
        return {
            ...state,
            sorting: payload,
        }
    },
    addCardForTrade: (state, { payload }: SetLastPickedForTradeActionT): CardsStateT => {
        const card = state.cards.find(card => card.id === payload);
        return {
            ...state,
            lastPickedForTrade: card || null
        }
    },
  }
});

// Reducers
export default gallerySlice.reducer;

// Actions
export const actions = gallerySlice.actions;

// Thunks
