import { CardT } from '../models';
import { SortingDirectionEnum, SortingValsEnum } from '../models';
import { tunePrice } from './tune-price';
import orderBy from 'lodash/orderBy';

export const sortCards = (cards: Array<CardT>, sortingValue: SortingValsEnum, direction: SortingDirectionEnum): Array<CardT> => {
    const isByNameSort = [SortingValsEnum.NAME_ASD, SortingValsEnum.NAME_DESC].includes(sortingValue);

    if (isByNameSort) {
        return orderBy(...[cards], 'name', direction === SortingDirectionEnum.DESC ? 'desc' : 'asc');
    }

    const byPriceSorter = (cardA: CardT, cardB: CardT) => {
        const priceA = tunePrice(cardA);
        const priceB = tunePrice(cardB);
        return direction === SortingDirectionEnum.DESC ? priceA - priceB : priceB - priceA;
    };

    return [...cards].sort(byPriceSorter);
}
