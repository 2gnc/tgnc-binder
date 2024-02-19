import { ConditionEnum, OwnerName, UserCardMetaT } from '../../models';
import { GalleryCardT, TradeItemT, CardUniqKey } from '../../models';

export type DealByCardT = Record<ConditionEnum, Record<string, number>>;
export type TradeStateT = {
    dealsByOwners: Record<OwnerName, Array<TradeItemT>>;
    dealsByCards: Record<CardUniqKey, DealByCardT>;
    orderingCard: Nullable<GalleryCardT>;
    requestsByOwners: Record<OwnerName, Array<TradeItemT>>;
    requestsByCards: Record<CardUniqKey, DealByCardT>;
}
