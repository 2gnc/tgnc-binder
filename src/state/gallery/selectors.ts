import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import size from 'lodash/size';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import compact from 'lodash/compact';
import map from 'lodash/map';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT,
    FilterParamNameEnum,
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
import { sortCards, sortGalleryCards } from '../../utils/sort-cards';
import { flatMap } from 'lodash';

const gallery = (state: RootState) => state.gallery;
const userCollections = (state: RootState) => state.gallery.thesaurus.collections;
const userCards = (state: RootState) => state.gallery.cards;
const collectionFilter = (state: RootState) => state.gallery.filters[FilterParamNameEnum.COLLECTION];
const filters = createSelector([gallery], (gallery) => gallery.filters);
const filtersCount = createSelector([filters], (filters) => size(filters));
const owner = createSelector([gallery], (gallery) => gallery.owner);
const avalaibleSetTypes = createSelector([gallery], (gallery) => gallery.thesaurus.setTypes);
const avalaibleLanguages = createSelector([gallery], (gallery) => gallery.thesaurus.languages);
const avalaibleSpellTypes = createSelector([gallery], (gallery) => gallery.thesaurus.types);
const searchValues = createSelector([gallery], (gallery) => gallery.searchValues);
const parentSetsList = createSelector([gallery], (gallery) => Object.values(gallery.thesaurus.parentSets));
const namesSearchBase = createSelector([gallery], (gallery) => gallery.thesaurus.names);
const cardsFiltredByCollection = createSelector([
    userCards,
    collectionFilter
], (cards, collections) => {
    if (collections.includes(ALL)) {
        return cards;
    }
    return cards.filter((card) => size(intersection(card.collections, collections)));
});
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

const sorting = createSelector([gallery], (gallery) => {
    const sortingValue = gallery.sorting;
    const ascSortings = [
        SortingValsEnum.NAME_ASC,
        SortingValsEnum.PRICE_ASC,
    ];
    const sortingDirection = ascSortings.includes(sortingValue) ? SortingDirectionEnum.ASC : SortingDirectionEnum.DESC;
    return {
        sortingValue,
        sortingDirection
    };
});

const cardsFiltredInSingleGallery = createSelector([cardsFiltredByCollection, filters, sorting], (cardsInCollection, filters, sorting) => {
    const { sortingDirection, sortingValue } = sorting;

    const isMatchByColor = (card: CardT) => {
        if (!size(filters.color)) {
            return true;
        }
        return size(intersection(filters.color, card.colors));
    };

    const isMatchByTypes = (card: CardT) => {
        if (!size(filters.type)) {
            return true;
        }

        const foundTypes = intersection(filters.type, card.types);
        return size(foundTypes) && size(foundTypes) === size(filters.type);
    };

    const isMatchByName = (card: CardT) => {
        const re = new RegExp(filters.name[0]?.toLowerCase());
        return re.test(card.name.toLowerCase());
    };

    const isMatchByLanguage = (card: CardT) => {
        if (filters.lang[0] === ALL as LangEnum) {
            return true;
        }
        return card.lang === filters.lang[0];
    };

    const isMatchBySetCode = (card: CardT) => {
        if (!size(filters.set)) {
            return true;
        }
        return filters.set.includes(card.setParent);
    };

    const isLandTypeIncluded = filters.type.includes(TypeEnum.LAND);
    const isTokenTypeIncluded = filters.type.includes(TypeEnum.TOKEN);

    const isNotLand = (card: CardT) => !card.types.includes(TypeEnum.LAND);
    const isNotToken = (card: CardT) => !card.types.includes(TypeEnum.TOKEN);

    const found = cardsInCollection.filter((card) => {
        const hasColorsMatch = isMatchByColor(card);
        const isMatchByType = isMatchByTypes(card);
        const hasNameMatch = isMatchByName(card);
        const hasLanguageMatch = isMatchByLanguage(card);
        const hasSetCodeMatch = isMatchBySetCode(card);

        const shouldIncludeLand = isLandTypeIncluded ? true : isNotLand(card);
        const shouldIncludeTokens = isTokenTypeIncluded ? true : isNotToken(card);

        return hasColorsMatch && isMatchByType && shouldIncludeLand && shouldIncludeTokens && hasNameMatch && hasLanguageMatch && hasSetCodeMatch;
    });

    return sortCards(found, sortingValue, sortingDirection);
});

export const selectors = {
    gallery,
    userCollections,
    userCards,
    cardsFiltredByCollection,
    filters,
    filtersCount,
    owner,
    avalaibleSetTypes,
    avalaibleLanguages,
    searchValues,
    setsListSuggest,
    spellNameSuggest,
    spellTypeSuggest,
    cardsFiltredInSingleGallery,
    sorting,
};

const galleryOwner = (state: RootState) => state.gallery.owner;
const cardsThesaurus = (state: RootState) => state.cards.thesaurus.cards;
const usersCards = (state: RootState) => state.cards.cards;
const galleryOwnerCards = createSelector([usersCards, galleryOwner, cardsThesaurus], (cards, owner, thesaurus) => {
    const ownername = owner?.name;
    if (!ownername) return [];

    const hash = {} as Record<string, GalleryCardT>;

    const userCards = compact(map(values(cards), (item) => {
        const meta: UserCardMetaT = item[ownername];
        if (!meta) return;
        return {
            card: thesaurus[meta.key],
            meta,
        }
    }));

    forEach(userCards, (card) => {
        const { set, number, lang, isFoil } = card.card;
        const { condition } = card.meta;
        const uniqKey = `${set}${number}${isFoil}${lang}`;

        if (!hash[uniqKey]) {
            hash[uniqKey] = {
                card: card.card,
                meta: {
                    [condition]: card.meta
                } as GalleryCardMetaT
            }
        } else {
            hash[uniqKey].meta[condition] = card.meta;
        }
    });

    return values(hash);
});
const galleryFiltredCards = createSelector([galleryOwnerCards, filters, sorting], (ownerCards, filters, sorting) => {
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
        const re = new RegExp(filters.name[0]?.toLowerCase());
        return re.test(card.card.name.toLowerCase());
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
        const metas = values(card.meta);
        const collections = uniq(flatMap(map(metas, meta => meta.collections)));

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

export const newGallerySelectors = {
    galleryOwner,
    galleryOwnerCards,
    galleryFiltredCards,
};
