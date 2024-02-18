import forEach from 'lodash/forEach';
import values from 'lodash/values';
import map from 'lodash/map';
import { CardThesaurusItemT, UserCardMetaT, GalleryCardT } from '../../models';
import { calculatePrice } from '../../utils/tune-price';

export const renderCardMainInfo = (card: CardThesaurusItemT, isMobile = false) => {
    const { name, number } = card;
    if (isNaN(number)) {
        return name;
    }
    return `${name}${!isMobile ? `#${number}` : ''}`
};

export const prepareTableData = (cards: Array<GalleryCardT>) => {
    const data = [] as Array<TableRow>;

    forEach(cards, (cc) => {
        const { meta, card} = cc;
        forEach(values(meta), (metaVal) => {
            data.push(...map(metaVal, (meta) => {
                return {
                    meta,
                    card,
                    price: calculatePrice(cc)
                }
            }));
        })
    });

    return data;
}

export type TableRow = {
    meta: UserCardMetaT;
    card: CardThesaurusItemT;
    price: number;
}
