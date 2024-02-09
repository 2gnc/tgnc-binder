import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParamNameEnum, OwnerT, SetRawT, SortingValsEnum } from '../../models';

export type GalleryPageLoadedActionT = PayloadAction<{
    owner: OwnerT;
}>;
export type SetFilterActionT = PayloadAction<{
    filter: FilterParamNameEnum;
    value: string;
}>;
export type RemoveCollectionFilterActionT = PayloadAction<{
    filter: FilterParamNameEnum;
    value: string;
}>;

export type ResetFilterActionT = PayloadAction<FilterParamNameEnum>;

export type SetSearchValueActionT = PayloadAction<{
    entity: FilterParamNameEnum;
    value: string;
}>;

export type SetSoringActionT = PayloadAction<SortingValsEnum>;
