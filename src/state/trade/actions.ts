import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParamNameEnum, OwnerT, SetRawT, ConditionEnum, TradeItemT, CardThesaurusItemT, CardUniqKey } from '../../models';

export type AddCardToDealActionT = PayloadAction<{
    cardKey: CardUniqKey;
    owner: OwnerT;
    condition: ConditionEnum;
}>;

export type RemoveCardFromDealActionT = PayloadAction<{
    tradeItem: TradeItemT,
    owner: string;
}>;
