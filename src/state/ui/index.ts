import { createSlice } from '@reduxjs/toolkit';
export { selectors } from './selectors';
import {
    SetIsFilterModalOpenActionT,
    SetIsTradeModalOpenActionT,
} from './actions';
import { UiStateT } from './models';

const initialState: UiStateT = {
    isFiltersModalOpen: false,
    isTradeModalOpen: false,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFiltersModalOpen: (state, { payload }: SetIsFilterModalOpenActionT): UiStateT => {
        return {
            ...state,
            isFiltersModalOpen: payload,
        }
    },
    setIsTradeModalOpen: (state, { payload }: SetIsTradeModalOpenActionT) => {
        return {
            ...state,
            isTradeModalOpen: payload,
        }
    },
  }
});

// Reducers
export default uiSlice.reducer;

// Actions
export const actions = uiSlice.actions;
