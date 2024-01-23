import { LangEnum } from '../models';

export function mapCardLangToEnum(cardlang: string): LangEnum {
    switch(cardlang) {
        case 'en':
            return LangEnum.EN;
        case 'ru':
            return LangEnum.RU;
        case 'sp':
            return LangEnum.SP;
        default:
            return LangEnum.OTH;
    }
}
