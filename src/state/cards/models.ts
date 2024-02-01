import { CardThesaurusT, SetListT, LangEnum, CardUniqKey, OwnerName, UserCardT, SetSearchT } from '../../models';

export type CardsStateT = {
    isLoaded: boolean;
    cards: Record<CardUniqKey, Record<OwnerName, UserCardT>>;
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
    }
}
