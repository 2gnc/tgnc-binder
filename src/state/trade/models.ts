import { OwnerName, UserCardMetaT } from '../../models';
import { CardThesaurusItemT, TradeItemT } from '../../models';

export type TradeStateT = {
    deals: Record<OwnerName, Array<TradeItemT>>;
}
