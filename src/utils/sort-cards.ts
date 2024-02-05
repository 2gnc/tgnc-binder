import { GalleryCardT } from '../models';
import { SortingDirectionEnum, SortingValsEnum } from '../models';
import { calculatePrice } from './tune-price';
import orderBy from 'lodash/orderBy';

export const sortGalleryCards = (cards: Array<GalleryCardT>, sortingValue: SortingValsEnum, direction: SortingDirectionEnum): Array<GalleryCardT> => {
    if (sortingValue === SortingValsEnum.EDHEC_RANK) {
        return orderBy(...[cards], 'edhRank', 'asc');
    }

    const isByNameSort = [SortingValsEnum.NAME_ASC, SortingValsEnum.NAME_DESC].includes(sortingValue);

    if (isByNameSort) {
        return orderBy(...[cards], 'card.name', direction);
    }

    const byPriceSorter = (cardA: GalleryCardT, cardB: GalleryCardT) => {
        const priceA = calculatePrice(cardA);
        const priceB = calculatePrice(cardB);
        return direction === SortingDirectionEnum.DESC ? priceA - priceB : priceB - priceA;
    };

    return [...cards].sort(byPriceSorter);
}
