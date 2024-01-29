import { SortingValsEnum } from './models';

export const sortingMenuValues = [
    {
        text: 'Spell Name (A-Z)',
        value: SortingValsEnum.NAME_ASC,
    },
    {
        text: 'Spell Name (Z-A)',
        value: SortingValsEnum.NAME_DESC,
    },
    {
        text: 'Price (high to low)',
        value: SortingValsEnum.PRICE_ASC,
    },
    {
        text: 'Price (low to high)',
        value: SortingValsEnum.PRICE_DESC,
    },
    {
        text: 'EDHREC rank',
        value: SortingValsEnum.EDHEC_RANK,
    }
];

export const ALL = 'all';
