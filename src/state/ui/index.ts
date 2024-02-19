import { createSlice } from '@reduxjs/toolkit';
export { selectors } from './selectors';
import {
    SetIsFilterModalOpenActionT,
    SetIsTradeModalOpenActionT,
    SetIsOrderModalOpenActionT,
} from './actions';
import { UiStateT } from './models';

const initialState: UiStateT = {
    isFiltersModalOpen: false,
    isTradeModalOpen: false,
    isOrderModalOpen: false,
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
    setIsOrderModalOpen: (state, { payload }: SetIsOrderModalOpenActionT) => {
        return {
            ...state,
            isOrderModalOpen: payload,
        }
    },
  }
});

// Reducers
export default uiSlice.reducer;

// Actions
export const actions = uiSlice.actions;
