import { LangEnum } from '../models';

export function mapCardLangToEnum(cardlang: string): LangEnum {
    switch(cardlang) {
        case 'en':
            return LangEnum.EN;
        case 'ru':
            return LangEnum.RU;
        default:
            return LangEnum.OTH;
    }
}
