import { RootState, Thunk, Dispatch } from '../store';

export const allCardsSelector = (state: RootState) => state.cards;
export const selectCardsByUser = (state: RootState, name: string) => {
    // return state.cards[name] || [];

};
export const isDataLoaded = (state: RootState) => state.cards.isLoaded;

export const selectors = {
    allCardsSelector,
    selectCardsByUser,
    isDataLoaded,
};


