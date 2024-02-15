import { CardThesaurusItemT } from '../../../../models';

export const renderCardMainInfo = (card: CardThesaurusItemT) => {
    const { name, number } = card;
    if (isNaN(number)) {
        return name;
    }
    return `${name} #${number}`
}
