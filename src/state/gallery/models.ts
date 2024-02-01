import { CardT, FilterParamNameEnum, OwnerT, SetListT, SetSearchT, LangEnum, PermamentTypeEnum, ColorEnum } from '../../models';

export type CardsStateT = {
    owner: Nullable<OwnerT>;
    cards: Array<CardT>;
    filters: {
        [FilterParamNameEnum.COLLECTION]: Array<string>;
        [FilterParamNameEnum.TYPE]: Array<string | PermamentTypeEnum>;
        [FilterParamNameEnum.COLOR]: Array<ColorEnum>;
        [FilterParamNameEnum.LANG]: Array<LangEnum>;
        [FilterParamNameEnum.SET]: Array<string>;
        [FilterParamNameEnum.NAME]: Array<string>;
    };
    searchValues: {
        [FilterParamNameEnum.SET]: string;
        [FilterParamNameEnum.NAME]: string;
        [FilterParamNameEnum.TYPE]: string;
    };
    thesaurus: {
        collections: Array<string>;
        sets: SetListT;
        setTypes: Array<string>;
        setBlocks: Array<string>;
        parentSets: Record<string, SetSearchT>;
        languages: Array<LangEnum>;
        names: Array<{
            name: string;
            searchBase: string;
        }>;
        types: Array<string>;
    };
};
