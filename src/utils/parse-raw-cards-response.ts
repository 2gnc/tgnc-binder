import map from 'lodash/map';
import { RarityEnum, type CardT, ConditionEnum, TypeEnum, LangEnum } from '../models';
import { mapCardColorToEnum } from './map-card-color-to-enum';
import { mapCardLangToEnum } from './map-card-lang-to-enum';
import { buildPeculiarities } from './build-peculiarities';
import { safeNumParse  } from './safe-parse';

export function parseRawCardsResponse(cards: Array<Record<string, string>>, parents: Record<string, string>): {
    cards: Array<CardT>;
    collections: Array<string>;
    types: Array<string>;
    names: Array<{ name: string; searchBase: string}>;
    languages: Array<LangEnum>;
} {
    const allCollections: Array<string> = [];
    const allTypes: Array<string> = [];
    const allNames: Array<{ name: string;searchBase: string}> = [];
    const allLanguages: Array<LangEnum> = [];

    const allCards = map(cards, card => {
        const quantity = safeNumParse(card.quantity);
        const types = [...new Set(
            card.types.split(' ')
                .filter(item => item.trim() !== '—' && item.trim() !== '//')
                .map(item => item.toLowerCase())
            )] as Array<TypeEnum>;
        const keywords = card.keywords.split(',').filter((word) => word.length).map(keyword => keyword.trim());
        const isFoil = card.is_foil === 'true';
        const perticularities = buildPeculiarities(isFoil, card.frame);
        const frameEffects = card.frame.split(',').map(effect => effect.trim());
        const rarity = card.rarity as RarityEnum;
        const lang = mapCardLangToEnum(card.lang);
        const usdNonFoil = safeNumParse(card.price_usd);
        const usdFoil = safeNumParse(card.price_usd_foil);
        const usdEtched = safeNumParse(card.price_usd_etched);
        const eurNonFoil = safeNumParse(card.price_eur);
        const eurFoil = safeNumParse(card.price_eur_foil);
        const eurEtched = safeNumParse(card.price_eur_etched);
        const collections = card.collection.split(',').map(col => col.trim().toLowerCase());
        allCollections.push(...collections);
        allTypes.push(...types);
        allNames.push({
            name: card.name,
            searchBase: `${card.name.toLowerCase()} ${card.ru_name?.toLowerCase()}`
        });
        allLanguages.push(lang);
        const promoTypes = card.promo_types?.split(',').filter((word) => word.length && word !== 'undefined').map(keyword => keyword.trim()) || [];

        const parsed: CardT = {
            name: card.name,
            set: card.set,
            setName: card.set_name,
            number: parseInt(card.number, 10),
            edhRank: parseInt(card.edhrec_rank, 10),
            colors: mapCardColorToEnum(card.colors),
            isFoil,
            isEtched: frameEffects.includes('etched'),
            isList: card.is_list === 'true',
            isToken: types.includes(TypeEnum.TOKEN),
            isLand: types.includes(TypeEnum.LAND),
            lang,
            rarity,
            quantity,
            condition: card.condition as ConditionEnum,
            collections: collections,
            types,
            keywords,
            imageUrl: card.image_url,
            id: card.id,
            perticularities,
            usdNonFoil,
            usdFoil, 
            usdEtched,
            eurNonFoil,
            eurFoil, 
            eurEtched,
            frameEffects,
            artist: card.artist,
            ruName: card.ru_name !== 'undefined' ? card.ru_name : card.name,
            promoTypes,
            setParent: parents[card.set],
        }

        return parsed;
    });

    return {
        cards: allCards,
        collections: [...new Set(allCollections)],
        types: [...new Set(allTypes)],
        names: [...new Set(allNames)],
        languages: [...new Set(allLanguages)],
    }
}
