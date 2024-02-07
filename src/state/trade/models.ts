import { ConditionEnum, OwnerName, UserCardMetaT } from '../../models';
import { CardThesaurusItemT, TradeItemT, CardUniqKey } from '../../models';

export type DealByCardT = Record<ConditionEnum, Record<string, number>>;
export type TradeStateT = {
    dealsByOwners: Record<OwnerName, Array<TradeItemT>>;
    dealsByCards: Record<CardUniqKey, DealByCardT>;
}
