import { CardThesaurusT, SetListT, LangEnum, CardUniqKey, OwnerName, UserCardMetaT, SetSearchT } from '../../models'; // TODO

export type CardsStateT = {
    isLoaded: boolean;
    cards: Record<CardUniqKey, Record<OwnerName, UserCardMetaT>>;
    thesaurus: {
        cards: CardThesaurusT;
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
        usersCollections: Record<string, Array<string>>;
    }
}
