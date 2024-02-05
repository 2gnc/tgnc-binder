import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParamNameEnum, OwnerT, SetRawT, ConditionEnum } from '../../models';

export type AddCardToDealActionT = PayloadAction<{
    cardCode: string;
    owner: OwnerT;
}>;
