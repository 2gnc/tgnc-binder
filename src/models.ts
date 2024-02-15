
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

export type GalleryCardMetaT = Partial<Record<ConditionEnum, Array<UserCardMetaT>>>;

export type GalleryCardT = {
    card: CardThesaurusItemT,
    meta: GalleryCardMetaT;
}

export type CardThesaurusItemT = {
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
export type CardThesaurusT = Record<CardUniqKey, CardThesaurusItemT>;

export type CardUniqKey = string;
export type OwnerName = string;

export type UserCardMetaT = {
    userName: string;
    key: string;
    quantity: number;
    condition: ConditionEnum;
    collections: Array<string>;
    tradable: boolean;
}

export type UserCardsT = Record<CardUniqKey, Record<OwnerName, UserCardMetaT>>;

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
    CH = 'ch', 
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
    NM = 'nm',
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
    OWNER = 'owner',
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

export type CardInDealT = {
    card: CardThesaurusItemT;
    condition: ConditionEnum;
    quantity: number;
};

export type UsersDealsT = Array<{
    owner: string;
    cards: Array<CardInDealT>;
}>

export type TradeItemT = {
    key: string;
    quantity: number;
    condition: ConditionEnum;
}
