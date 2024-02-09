import forEach from 'lodash/forEach';
import { RarityEnum, ConditionEnum, TypeEnum, LangEnum, CardThesaurusT, UserCardsT } from '../models';
import { mapCardColorToEnum } from './map-card-color-to-enum';
import { mapCardLangToEnum } from './map-card-lang-to-enum';
import { buildPeculiarities } from './build-peculiarities';
import { safeNumParse  } from './safe-parse';
import uniq from 'lodash/uniq';

export function parseRawCardsResponse(cards: Array<Record<string, string>>, parents: Record<string, string>, owner = ''): {
    collections: Array<string>;
    types: Array<string>;
    names: Array<{ name: string; searchBase: string}>;
    cardsThesaurus: CardThesaurusT;
    userCards: UserCardsT;
} {
    const cardsThesaurus: CardThesaurusT = {};
    const userCards: UserCardsT = {};

    const allCollections: Array<string> = [];
    const allTypes: Array<string> = [];
    const allNames: Array<{ name: string;searchBase: string}> = [];

    forEach(cards, card => {
        const quantity = safeNumParse(card.quantity);
        const types = card.types ? [...new Set(
            card.types.split(' ')
                .filter(item => item.trim() !== '—' && item.trim() !== '//')
                .map(item => item.toLowerCase())
            )] as Array<TypeEnum> : [];
        const keywords = card.keywords ? card.keywords.split(',').filter((word) => word.length).map(keyword => keyword.trim()) : [];
        const isFoil = card.is_foil === 'true';
        const perticularities = buildPeculiarities(isFoil, card.frame);
        const frameEffects = card.frame ? card.frame.split(',').map(effect => effect.trim()) : [];
        const rarity = card.rarity as RarityEnum;
        const lang = mapCardLangToEnum(card.lang);
        const usdNonFoil = safeNumParse(card.price_usd);
        const usdFoil = safeNumParse(card.price_usd_foil);
        const usdEtched = safeNumParse(card.price_usd_etched);
        const eurNonFoil = safeNumParse(card.price_eur);
        const eurFoil = safeNumParse(card.price_eur_foil);
        const eurEtched = safeNumParse(card.price_eur_etched);
        const collections = card.collection ? card.collection.split(',').map(col => col.trim().toLowerCase()) : [];
        allCollections.push(...collections);
        allTypes.push(...types);
        allNames.push({
            name: card.name,
            searchBase: `${card.name.toLowerCase()} ${card.ru_name?.toLowerCase()}`
        });
        const promoTypes = card.promo_types?.split(',').filter((word) => word.length && word !== 'undefined').map(keyword => keyword.trim()) || [];
        const number = parseInt(card.number, 10);
        const condition = card.condition as ConditionEnum;
        const ruName = card.ru_name !== 'undefined' ? card.ru_name : card.name;
        const edhRank = parseInt(card.edhrec_rank, 10);
        const colors = mapCardColorToEnum(card.colors);
        const isEtched = frameEffects.includes('etched');
        const isList = card.is_list === 'true';
        const isToken = types.includes(TypeEnum.TOKEN);
        const isLand = types.includes(TypeEnum.LAND);
        const imageUrl = card.image_url;
        const setName = card.set_name;
        const set = card.set;
        const setParent = parents[card.set];
        const name = card.name;
        const artist = card.artist;
        const id = card.id;
        const tradable = collections.includes('binder');

        const uniqKey = `${card.set}-${number}-${isFoil}-${lang}`;

        cardsThesaurus[uniqKey] = { ruName, name, set, setParent, setName, number, edhRank, colors, isEtched, isFoil, isLand, isList, isToken, lang, rarity, usdEtched, usdFoil, usdNonFoil, eurEtched, eurFoil, eurNonFoil, types, keywords, imageUrl, id, perticularities, frameEffects, artist, promoTypes };
        if (uniqKey === 'iko-39-false-ru') {
            console.log(card)
        }
        if (!userCards[uniqKey]) {
            userCards[uniqKey] = {};
            userCards[uniqKey][owner] = {
                userName: owner,
                key: uniqKey,
                quantity,
                condition,
                collections,
                tradable,
            }
        } else {
            const updatedCollections = uniq(userCards[uniqKey][owner].collections.concat(collections));
            userCards[uniqKey][owner].quantity += quantity;
            userCards[uniqKey][owner].collections = updatedCollections;
        }
    });

    return {
        collections: [...new Set(allCollections)],
        types: [...new Set(allTypes)],
        names: [...new Set(allNames)],
        cardsThesaurus,
        userCards,
    }
}
