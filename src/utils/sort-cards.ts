import { CardT } from '../models';
import { SortingDirectionEnum, SortingValsEnum } from '../models';
import { tunePrice } from './tune-price';
import orderBy from 'lodash/orderBy';

export const sortCards = (cards: Array<CardT>, sortingValue: SortingValsEnum, direction: SortingDirectionEnum): Array<CardT> => {
    if (sortingValue === SortingValsEnum.EDHEC_RANK) {
        return orderBy(...[cards], 'edhRank', 'asc');
    }

    const isByNameSort = [SortingValsEnum.NAME_ASC, SortingValsEnum.NAME_DESC].includes(sortingValue);

    if (isByNameSort) {
        return orderBy(...[cards], 'name', direction);
    }

    const byPriceSorter = (cardA: CardT, cardB: CardT) => {
        const priceA = tunePrice(cardA);
        const priceB = tunePrice(cardB);
        return direction === SortingDirectionEnum.DESC ? priceA - priceB : priceB - priceA;
    };

    return [...cards].sort(byPriceSorter);
}
