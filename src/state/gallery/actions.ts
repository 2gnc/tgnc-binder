import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParamNameEnum, OwnerT, SetRawT, SortingValsEnum } from '../../models';

export type GalleryDataReceivedActionT = PayloadAction<{
    rawSets: Array<SetRawT>;
    rawCards: Array<Record<string, string>>;
    owner: OwnerT;
}>;
export type SetCollectionFilterActionT = PayloadAction<{
    filter: FilterParamNameEnum;
    value: string;
}>;
export type RemoveCollectionFilterActionT = PayloadAction<{
    filter: FilterParamNameEnum;
    value: string;
}>;

export type ResetCollectionFilterActionT = PayloadAction<FilterParamNameEnum>;

export type SetSearchValueActionT = PayloadAction<{
    entity: FilterParamNameEnum;
    value: string;
}>;

export type SetSoringActionT = PayloadAction<SortingValsEnum>;

export type SetLastPickedForTradeActionT = PayloadAction<string>;
