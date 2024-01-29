import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import store from '../store';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT, FilterParamNameEnum, OwnerT, SetRawT, SetListT, SetSearchT, LangEnum } from '../../models';
import { ALL } from '../../constants';
import { nonEmptyStringsArrTransformer } from '../transformers';
import filter from 'lodash/filter';
import { parseRawSetsResponse } from '../../utils/parse-raw-sets-response';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';

type GalleryDataReceivedActionT = PayloadAction<{
    rawSets: Array<SetRawT>;
    rawCards: Array<Record<string, string>>;
    owner: OwnerT;
}>;
type SetCollectionFilterActionT = PayloadAction<{
    filter: FilterParamNameEnum;
    value: string;
}>;

type CardsStateT = {
    owner: Nullable<OwnerT>;
    cards: Array<CardT>;
    filters: {
        [FilterParamNameEnum.COLLECTION]: string
    };
    thesaurus: {
        collections: Array<string>;
        sets: SetListT;
        setTypes: Set<string>;
        setBlocks: Set<string>;
        parentSets: Record<string, SetSearchT>;
        languages: Array<LangEnum>;
        names: Array<{
            name: string;
            searchBase: string;
        }>;
        types: Array<string>;
    };
}

const initialState: CardsStateT = {
    owner: null,
    cards: [],
    filters: {
        [FilterParamNameEnum.COLLECTION]: ALL,
    },
    thesaurus: {
        collections : [],
        sets: {},
        setTypes: new Set<string>(),
        setBlocks: new Set<string>(),
        parentSets: {},
        languages: Object.values(LangEnum),
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
                collections: nonEmptyStringsArrTransformer(collections),
                sets,
                setTypes,
                setBlocks,
                parentSets,
                names,
                types,
            }
        }

    },
    setFilter: (state, { payload }: SetCollectionFilterActionT): CardsStateT => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [payload.filter]: payload.value,
            }
        }
    }
  }
});

// Reducers
export default gallerySlice.reducer;

// Selectors
export const gallerySelector = (state: RootState) => state.gallery;
export const userCollectionsSelector = (state: RootState) => state.gallery.thesaurus.collections;
export const userCardsSelector = (state: RootState) => state.gallery.cards;
export const byCollectionFilterSelector = (state: RootState) => state.gallery.filters[FilterParamNameEnum.COLLECTION];
export const cardsFiltredByCollectionSelector = createSelector([
    userCardsSelector,
    byCollectionFilterSelector
], (cards, collection) => {
    if (collection === ALL) {
        return cards;
    }
    return cards.filter((card) => card.collections.includes(collection));
});
export const filtersSelector = createSelector([
    gallerySelector
], (gallery) => {
    return gallery.filters;
})

// Actions
export const {
    setFilter,
    galleryPageDataReceived,
} = gallerySlice.actions;

// Thunks
