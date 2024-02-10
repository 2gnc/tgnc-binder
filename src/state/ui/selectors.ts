import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

const uiState = (state: RootState) => state.ui;
const isFiltersModalOpen = createSelector([uiState], (ui) => {
    return ui.isFiltersModalOpen;
});
const isTradeModalOpen = createSelector([uiState], (ui) => {
    return ui.isTradeModalOpen;
});

export const selectors = {
    isFiltersModalOpen,
    isTradeModalOpen,
};
