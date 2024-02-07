import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import { CardThesaurusItemT, ConditionEnum, CardUniqKey } from '../../models';

const KEY_SEPARATOR = '-';

export const nonEmptyStringsArrTransformer = (arr: Array<string>): Array<string> => filter(arr, el => !isEmpty(el));

export const buildCardThesaurusKey = (card: CardThesaurusItemT): CardUniqKey => {
    return `${card.set}${KEY_SEPARATOR}${card.number}${KEY_SEPARATOR}${card.isFoil}${KEY_SEPARATOR}${card.lang}`;
};

export const parseCardThesaurusKey = (key: CardUniqKey) => {
    const [set, number, isFoil, lang] = key.split(KEY_SEPARATOR);
    return { set, number, isFoil, lang };
};
