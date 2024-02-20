import { PayloadAction } from '@reduxjs/toolkit';
import { GalleryCardT, OwnerT,  ConditionEnum, CardUniqKey, CardInDealT } from '../../models';

export type AddCardToDealActionT = PayloadAction<{
    cardKey: CardUniqKey;
    owner: string;
    condition: ConditionEnum;
}>;

export type RemoveCardFromDealActionT = PayloadAction<{
    key: string;
    condition: ConditionEnum;   
    owner: string;
}>;

export type RequestTradeActionT = PayloadAction<{
    cardKey: CardUniqKey;
    owner: string;
    condition: ConditionEnum;
}>;

export type SetOrderingCardActionT = PayloadAction<Nullable<GalleryCardT>>;
