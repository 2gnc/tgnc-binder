
export type CardT = {
    name: string;
    set: string;
    setName: string;
    number: number;
    edhRank: number;
    colors: Array<ColorsEnum>;
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

export enum ColorsEnum {
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
    NAME_ASD = 'name_asd',
    NAME_DESC = 'name_desc',
    PRICE_ASD = 'price_asd',
    PRICE_DESC = 'price_desc'
}

export enum SortingDirectionEnum {
    ASC = 'asc',
    DESC = 'desc'
}
