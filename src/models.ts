
export type CardT = {
    name: string;
    set: string;
    setParent: string;
    setName: string;
    number: number;
    edhRank: number;
    colors: Array<ColorEnum>;
    isFoil: boolean;
    isEtched: boolean;
    isList: boolean;
    isToken: boolean;
    isLand: boolean;
    lang: LangEnum;
    rarity: RarityEnum;
    usdFoil: number;
    usdNonFoil: number;
    usdEtched: number;
    eurFoil: number;
    eurNonFoil: number;
    eurEtched: number;
    quantity: number;
    condition: ConditionEnum;
    collections: Array<string>;
    types: Array<TypeEnum>;
    keywords: Array<string>;
    imageUrl: string;
    id: string;
    perticularities: string;
    frameEffects: Array<string>;
    artist: string;
    ruName?: string;
    promoTypes: Array<string>;
}

export enum FramePerticularitiesEnum {
    SHOWCASE = 'showcase',
    MIRACLE = 'miracle',
    EXTENDED = 'extendedart',
    ETCHED = 'etched',
    SHATTERED = 'shatteredglass'
}

export enum ColorEnum {
    RED = 'red',
    GREEN = 'green',
    WHITE = 'white',
    BLACK = 'black',
    BLUE = 'blue',
    COLORLESS = 'colorless',
    MULTI  = 'multi'
}

export enum TypeEnum {
    LAND = 'land',
    TOKEN = 'token'
}

export enum LangEnum {
    RU = 'ru',
    EN = 'en',
    SP = 'sp',
    PT = 'pt',
    DE = 'de',
    IT = 'it',
    FR = 'fr', // лобавить иконку
    JP = 'jp', // добавить иконку
    OTH = 'oth',
}

export enum RarityEnum {
    COMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    MYTHIC = 'mythic',
    SPECIAL = 'special',
    BONUS = 'bonus',
}

export enum ConditionEnum {
    NM = 'mn',
    SP = 'sp',
    MP = 'mp',
    PL = 'pl',
    HP = 'hp',
    DMG = 'dmg'
}

export type OwnerT = {
    name: string;
    contactLink: string;
}

export enum PermamentTypeEnum {
    CARD = 'card',
    TOKEN = 'token',
}

export enum SortingValsEnum {
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    EDHEC_RANK = 'edhrec_rank',
}

export enum SortingDirectionEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export type SetSearchT = {
    name: string;
    icon: string;
    code: string;
};

export enum FilterParamNameEnum {
    COLLECTION = 'collection',
    TYPE = 'type',
    COLOR = 'color',
    LANG = 'lang',
    SET = 'set',
    NAME = 'name',
}

export type SetRawT = {
    Code: string;
    Name: string;
    ParentSetCode: string;
    Type: string;
    IconURI: string;
    Block: string;
}

export type SetListT = Record<string, SetT>;
export type SetT = {
    code: string;
    parent: Nullable<string>;
    children: Array<SetT>;
    name: string;
    imageUri: string;
    type: string;
    block: string;
};
