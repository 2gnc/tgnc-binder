import { LangEnum } from '../models';

export function mapCardLangToEnum(cardlang: string): LangEnum {
    switch(cardlang) {
        case 'en':
            return LangEnum.EN;
        case 'ru':
            return LangEnum.RU;
        case 'sp':
            return LangEnum.SP;
        case 'pt':
            return LangEnum.PT;
        case 'de':
            return LangEnum.DE;
        case 'it':
            return LangEnum.IT;
        default:
            return LangEnum.OTH;
    }
}
