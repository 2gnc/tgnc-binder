import { createSelector } from '@reduxjs/toolkit';
import size from 'lodash/size';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import compact from 'lodash/compact';
import map from 'lodash/map';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import includes from 'lodash/includes';
import { RootState } from '../store';
import {
    LangEnum,
    PermamentTypeEnum,
    SortingDirectionEnum,
    SortingValsEnum,
    TypeEnum,
    CardThesaurusItemT,
    GalleryCardT,
    UserCardMetaT,
    GalleryCardMetaT,
} from '../../models';
import { ALL } from '../../constants';
import { sortGalleryCards } from '../../utils/sort-cards';
import { selectors as gallerySelectors } from '../gallery'
import { buildCardThesaurusKey } from '../helpers';

const thesaurus = (state: RootState) => state.cards.thesaurus;
const filters = (state: RootState) => state.filters.filters;
const searchValues = (state: RootState) => state.filters.searchValues;
const sortings = (state: RootState) => state.filters.sorting;
const filtersCount = createSelector([filters], (filters) => {
    let count = 0;
    forEach(filters, (filter) => {
        if (size(filter) && filter[0] !== ALL) {
            count += 1;
        }
    });
    return count;
});

const avalaibleSetTypes = createSelector([thesaurus], (thesaurus) => thesaurus.setTypes);
const avalaibleLanguages = createSelector([thesaurus], (thesaurus) => thesaurus.languages);
const avalaibleSpellTypes = createSelector([thesaurus], (thesaurus) => thesaurus.types);
const parentSetsList = createSelector([thesaurus], (thesaurus) => Object.values(thesaurus.parentSets));
const namesSearchBase = createSelector([thesaurus], (thesaurus) => thesaurus.names);

const setsListSuggest = createSelector([searchValues, parentSetsList, filters], (searchValues, sets, filters) => {
    const searchValue = searchValues.set;
    if (size(searchValue) < 3) {
        return [];
    }

    const re = new RegExp(searchValue, 'gi');
    return sets.filter(({ code, name }) => {
        return (re.test(code) || re.test(name)) && !filters.set.includes(code);
    });
});

const spellNameSuggest = createSelector([searchValues, namesSearchBase], (searchValues, base) => {
    const searchValue = searchValues.name;

    if (size(searchValue) < 3) {
        return [];
    }

    const re = new RegExp(searchValue);
    const found = base
        .filter((name) => re.test(name.searchBase))
        .map(item => item.name);
    
    return uniq(found);
});

const spellTypeSuggest = createSelector([searchValues, avalaibleSpellTypes], (searchValues, base) => {
    const searchValue = searchValues.type;

    if (size(searchValue) < 2) {
        return [];
    }

    const re = new RegExp(searchValue);
    const toExcludeFromSuggest = [
        PermamentTypeEnum.CARD,
        PermamentTypeEnum.TOKEN,
        TypeEnum.LAND,
    ] as Array<string>;
    const found = base
        .filter((item) => {
            const isNotExcluded = !toExcludeFromSuggest.includes(item);
            return isNotExcluded && re.test(item);
        });
    return found;
});

const sorting = createSelector([sortings], (sortings) => {
    const ascSortings = [
        SortingValsEnum.NAME_ASC,
        SortingValsEnum.PRICE_ASC,
    ];
    const sortingDirection = ascSortings.includes(sortings) ? SortingDirectionEnum.ASC : SortingDirectionEnum.DESC;
    return {
        sortingValue: sortings,
        sortingDirection
    };
});

const cardsThesaurus = (state: RootState) => state.cards.thesaurus.cards;
const userCollections = createSelector([gallerySelectors.galleryOwner, thesaurus], (owner, thesaurus) => {
    if (!owner) {
        return [ALL];
    }
    return thesaurus.usersCollections[owner.name].concat([ALL]) || [ALL];
});
const allCards = (state: RootState) => state.cards.cards;

const ownersCards = createSelector([allCards, cardsThesaurus, filters], (cards, thesaurus, filters) => {
    const owners = filters.owner;
    const allUsersCards: Array<{
        card: CardThesaurusItemT;
        meta: UserCardMetaT;
    }> = [];

    if (!size(owners)) {
        forEach(values(cards), (card, i) => {
            forEach(values(card), (meta) => {
                allUsersCards.push({
                    card: thesaurus[meta.key],
                    meta
                })
            })
        })
    } else {
        forEach(owners, (ownerName) => {
            const ownerCards = compact(map(values(cards), (item) => {
                const meta: UserCardMetaT = item[ownerName];
                if (!meta) return;
                return {
                    card: thesaurus[meta.key],
                    meta,
                }
            }));
            allUsersCards.push(...ownerCards);
        });
    }

    const hash = {} as Record<string, GalleryCardT>;

    forEach(allUsersCards, (card) => {
        const { condition } = card.meta;
        const uniqKey = buildCardThesaurusKey(card.card);

        if (!hash[uniqKey]) {
            hash[uniqKey] = {
                card: card.card,
                meta: {
                    [condition]: [card.meta]
                } as GalleryCardMetaT
            }
        } else if (!hash[uniqKey].meta[condition]) {
            hash[uniqKey].meta[condition] = [card.meta];
        } else {
            hash[uniqKey].meta[condition]!.push(card.meta);
        }
    });

    return values(hash);
});

const filtredCards = createSelector([ownersCards, filters, sorting], (ownerCards, filters, sorting) => {
    const { sortingDirection, sortingValue } = sorting;
    const isMatchByColor = (card: GalleryCardT) => {
        if (!size(filters.color)) {
            return true;
        }
        return Boolean(size(intersection(filters.color, card.card.colors)));
    };

    const isMatchByTypes = (card: GalleryCardT) => {
        if (!size(filters.type)) {
            return true;
        }

        const foundTypes = intersection(filters.type, card.card.types);
        return Boolean(size(foundTypes) && size(foundTypes) === size(filters.type));
    };

    const isMatchByName = (card: GalleryCardT) => {
        if (!size(filters.name)) {
            return true;
        }
        const reArr = map(filters.name, (name) => new RegExp(name.toLowerCase()).test(card.card.name.toLowerCase()));
        return includes(reArr, true);
    };

    const isMatchByLanguage = (card: GalleryCardT) => {
        if (filters.lang[0] === ALL as LangEnum) {
            return true;
        }
        return card.card.lang === filters.lang[0];
    };

    const isMatchBySetCode = (card: GalleryCardT) => {
        if (!size(filters.set)) {
            return true;
        }
        return filters.set.includes(card.card.setParent);
    };

    const isMatchByCollection = (card: GalleryCardT) => {
        if (!size(filters.collection)) {
            return true;
        }
        if (size(filters.collection) === 1 && filters.collection[0] === ALL) {
            return true;
        }
        const metas = values(card.meta);
        // тут учесть, что это массив
        const collections: Array<string> = [];
        forEach(flatMap(metas), (metaItm) => {
            collections.push(...metaItm.collections);
        })

        return !isEmpty(intersection(collections, filters.collection));
    }

    const isLandTypeIncluded = filters.type.includes(TypeEnum.LAND);
    const isTokenTypeIncluded = filters.type.includes(TypeEnum.TOKEN);

    const isNotLand = (card: CardThesaurusItemT) => !card.types.includes(TypeEnum.LAND);
    const isNotToken = (card: CardThesaurusItemT) => !card.types.includes(TypeEnum.TOKEN);

    const found = ownerCards.filter((cardItem) => {
        const hasColorsMatch = isMatchByColor(cardItem);
        const isMatchByType = isMatchByTypes(cardItem);
        const hasNameMatch = isMatchByName(cardItem);
        const hasLanguageMatch = isMatchByLanguage(cardItem);
        const hasSetCodeMatch = isMatchBySetCode(cardItem);
        const hasCollectionMatch = isMatchByCollection(cardItem);

        const shouldIncludeLand = isLandTypeIncluded ? true : isNotLand(cardItem.card);
        const shouldIncludeTokens = isTokenTypeIncluded ? true : isNotToken(cardItem.card);

        return hasColorsMatch && isMatchByType && shouldIncludeLand && shouldIncludeTokens && hasNameMatch && hasLanguageMatch && hasSetCodeMatch && hasCollectionMatch;
    });

    return sortGalleryCards(found, sortingValue, sortingDirection);
});

export const selectors = {
    userCollections,
    filters,
    filtersCount,
    avalaibleSetTypes,
    avalaibleLanguages,
    searchValues,
    setsListSuggest,
    spellNameSuggest,
    spellTypeSuggest,
    sorting,
    ownersCards,
    filtredCards,
};
