import { SortingValsEnum } from './models';

export const sortingMenuValues = [
    {
        text: 'Spell Name (A-Z)',
        value: SortingValsEnum.NAME_ASD,
    },
    {
        text: 'Spell Name (Z-A)',
        value: SortingValsEnum.NAME_DESC,
    },
    {
        text: 'Price (high to low)',
        value: SortingValsEnum.PRICE_ASD,
    },
    {
        text: 'Price (low to high)',
        value: SortingValsEnum.PRICE_DESC,
    }
];
