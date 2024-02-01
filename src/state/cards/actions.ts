import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardT, SetRawT } from '../../models';

type PopullateCardsActionPayloadT = {
    rawSets: Array<SetRawT>;
    rawCards: Array<Record<string, string>>;
    owner: string;
}

export type PopullateCardsActionT = PayloadAction<PopullateCardsActionPayloadT>;
export type SetIsLoadingActionT = PayloadAction<boolean>;
