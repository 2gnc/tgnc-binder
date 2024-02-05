import { FilterParamNameEnum, OwnerT, LangEnum, PermamentTypeEnum, ColorEnum, SortingValsEnum } from '../../models';

export type CardsStateT = {
    owner: Nullable<OwnerT>;
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
    sorting: SortingValsEnum,
};
