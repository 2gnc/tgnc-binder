import { createSlice } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import { FilterParamNameEnum, LangEnum, PermamentTypeEnum, SortingValsEnum } from '../../models';
import { ALL } from '../../constants';
export { selectors } from './selectors';
import {
    GalleryPageLoadedActionT,
    SetCollectionFilterActionT,
    RemoveCollectionFilterActionT,
    SetSearchValueActionT,
    ResetCollectionFilterActionT,
    SetSoringActionT,
} from './actions';
import { CardsStateT } from './models';

const initialState: CardsStateT = {
    owner: null,
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
};

// Slice
const gallerySlice = createSlice({
  name: 'ownerGallery',
  initialState,
  reducers: {
    galleryPageLoaded: (state, action: GalleryPageLoadedActionT): CardsStateT => {
        const { owner } = action.payload;

        return {
            ...state,
            owner,
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
  }
});

// Reducers
export default gallerySlice.reducer;

// Actions
export const actions = gallerySlice.actions;
