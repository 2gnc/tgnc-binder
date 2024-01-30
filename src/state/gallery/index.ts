import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import store from '../store';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT, FilterParamNameEnum, LangEnum, PermamentTypeEnum, ColorEnum } from '../../models';
import { ALL } from '../../constants';
import { nonEmptyStringsArrTransformer } from '../transformers';
import { parseRawSetsResponse } from '../../utils/parse-raw-sets-response';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';
export { selectors } from './selectors';
import { GalleryDataReceivedActionT, SetCollectionFilterActionT, RemoveCollectionFilterActionT, SetSearchValueActionT } from './actions';
import { CardsStateT } from './models';

const initialState: CardsStateT = {
    owner: null,
    cards: [],
    filters: {
        [FilterParamNameEnum.COLLECTION]: [ALL],
        [FilterParamNameEnum.TYPE]: [PermamentTypeEnum.CARD],
        [FilterParamNameEnum.COLOR]: [],
        [FilterParamNameEnum.LANG]: [ALL as LangEnum],
        [FilterParamNameEnum.SET]: [],
    },
    searchValues: {
        [FilterParamNameEnum.SET]: '',
    },
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
};

// Slice
const gallerySlice = createSlice({
  name: 'ownerGallery',
  initialState,
  reducers: {
    galleryPageDataReceived: (state, action: GalleryDataReceivedActionT): CardsStateT => {
        const { rawCards, rawSets, owner } = action.payload;
        const { sets, setTypes, setBlocks, codesParents, parentSets } = parseRawSetsResponse(rawSets);
        const { cards, collections, types, names } = parseRawCardsResponse(rawCards, codesParents);

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
        const filters = new Set(state.filters[payload.filter]);

        // spell type: card - token
        const spellTypeValues = Object.values(PermamentTypeEnum);
        const isSpellTypeFilter = filter === FilterParamNameEnum.TYPE && spellTypeValues.includes(value as PermamentTypeEnum);
        if (isSpellTypeFilter) {
            filters.delete(PermamentTypeEnum.CARD);
            filters.delete(PermamentTypeEnum.TOKEN);
        };

        // collection, lang
        const soloFilters = [
            FilterParamNameEnum.COLLECTION,
            FilterParamNameEnum.LANG,
        ];
        const isSoloFilter = soloFilters.includes(filter);
        if (isSoloFilter) {
            filters.clear();
        }

        filters.add(payload.value);

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
  }
});

// Reducers
export default gallerySlice.reducer;

// Actions
export const actions = gallerySlice.actions;

// Thunks
