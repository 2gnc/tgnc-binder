import { createSlice } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import { FilterParamNameEnum, LangEnum, PermamentTypeEnum, SortingValsEnum } from '../../models';
import { ALL } from '../../constants';
export { selectors } from './selectors';
import {
    GalleryPageLoadedActionT,
    SetFilterActionT,
    RemoveCollectionFilterActionT,
    SetSearchValueActionT,
    ResetFilterActionT,
    SetSoringActionT,
} from './actions';
import { FiltersStateT } from './models';

const initialState: FiltersStateT = {
    filters: {
        [FilterParamNameEnum.COLLECTION]: [ALL],
        [FilterParamNameEnum.TYPE]: [],
        [FilterParamNameEnum.COLOR]: [],
        [FilterParamNameEnum.LANG]: [ALL as LangEnum],
        [FilterParamNameEnum.SET]: [],
        [FilterParamNameEnum.NAME]: [],
        [FilterParamNameEnum.OWNER]: [],
    },
    searchValues: {
        [FilterParamNameEnum.SET]: '',
        [FilterParamNameEnum.NAME]: '',
        [FilterParamNameEnum.TYPE]: '',
    },
    sorting: SortingValsEnum.NAME_ASC,
};

// Slice
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, { payload }: SetFilterActionT): FiltersStateT => {
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
            FilterParamNameEnum.OWNER,
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
    removeFilter: (state, { payload }: RemoveCollectionFilterActionT): FiltersStateT => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [payload.filter]: filter(state.filters[payload.filter], (val) => val !== payload.value)
            }
        }
    },
    resetFilter: (state, { payload }: ResetFilterActionT): FiltersStateT => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [payload]: initialState.filters[payload],
            }
        }
    },
    flushFilters: (state): FiltersStateT => {
        return {
            ...state,
            filters: initialState.filters,
            searchValues: initialState.searchValues,
        }
    },
    setSearchValue: (state, { payload }: SetSearchValueActionT): FiltersStateT => {
        return {
            ...state,
            searchValues: {
                ...state.searchValues,
                [payload.entity]: payload.value,
            }
        }
    },
    setSorting: (state, { payload }: SetSoringActionT): FiltersStateT => {
        return {
            ...state,
            sorting: payload,
        }
    },
  }
});

// Reducers
export default filtersSlice.reducer;

// Actions
export const actions = filtersSlice.actions;
