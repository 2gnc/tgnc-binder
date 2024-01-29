import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store from '../store';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT } from '../../models';

type PopullateCardsActionPayloadT = {
    owner: string;
    cards: Array<CardT>;
}
type PopullateCardsActionT = PayloadAction<PopullateCardsActionPayloadT>;

type CardsStateT = Record<string, Array<CardT>>

const initialState: CardsStateT = {};

// Slice
const cardsSlice = createSlice({
  name: 'cardsByOwner',
  initialState,
  reducers: {
    setCards: (state, { payload }: PopullateCardsActionT) => {
        state[payload.owner] = payload.cards;
    },
    flushCards: (state, {payload}) => {
        state[payload] = [];
    }
  }
});

// Reducers
export default cardsSlice.reducer;

// Selectors
export const allCardsSelector = (state: RootState) => state.cards;
export const selectCardsByUser = (state: RootState, name: string) => {
    return state.cards[name] || [];
};

// Actions
const { setCards, flushCards } = cardsSlice.actions;

// Thunks
export const popullateCardsOnOwner = (payload: PopullateCardsActionPayloadT): Thunk => (dispatch: Dispatch) => {
    dispatch(setCards(payload));
}
export const flushAllCards = (payload: string): Thunk => (dispatch: Dispatch) => {
    console.log('here')
    dispatch(flushCards(payload));
}
