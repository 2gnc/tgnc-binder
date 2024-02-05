import { OwnerName, UserCardMetaT } from '../../models';

export type TradeItemT = {
    key: string;
    quantity: number;
}

export type TradeStateT = {
    deals: Record<OwnerName, Array<TradeItemT>>;
}
