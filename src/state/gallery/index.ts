import { createSlice } from '@reduxjs/toolkit';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import { FilterParamNameEnum, LangEnum, PermamentTypeEnum, SortingValsEnum } from '../../models';
import { ALL } from '../../constants';
export { selectors } from './selectors';
import {
    SetOwnerActionT,
} from './actions';
import { GalleryStateT } from './models';

const initialState: GalleryStateT = {
    owner: null,
};

// Slice
const filtersSlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setOwner: (state, { payload }: SetOwnerActionT): GalleryStateT => {
        return {
            ...state,
            owner: payload.owner
        }
    },
    galleryPageLoaded: (state): GalleryStateT => {
        return state
    }
  }
});

// Reducers
export default filtersSlice.reducer;

// Actions
export const actions = filtersSlice.actions;
