import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import size from 'lodash/size';
import interception from 'lodash/intersection';
import uniq from 'lodash/uniq';
import { RootState, Thunk, Dispatch } from '../store';
import { CardT, FilterParamNameEnum, OwnerT, SetRawT, SetListT, SetSearchT, LangEnum } from '../../models';
import { ALL } from '../../constants';

const gallery = (state: RootState) => state.gallery;
const userCollections = (state: RootState) => state.gallery.thesaurus.collections;
const userCards = (state: RootState) => state.gallery.cards;
const collectionFilter = (state: RootState) => state.gallery.filters[FilterParamNameEnum.COLLECTION];
const filters = createSelector([gallery], (gallery) => gallery.filters);
const filtersCount = createSelector([filters], (filters) => size(filters));
const owner = createSelector([gallery], (gallery) => gallery.owner);
const avalaibleTypes = createSelector([gallery], (gallery) => gallery.thesaurus.setTypes);
const avalaibleLanguages = createSelector([gallery], (gallery) => gallery.thesaurus.languages);
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
    return cards.filter((card) => size(interception(card.collections, collections)));
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

export const selectors = {
    gallery,
    userCollections,
    userCards,
    cardsFiltredByCollection,
    filters,
    filtersCount,
    owner,
    avalaibleTypes,
    avalaibleLanguages,
    searchValues,
    setsListSuggest,
    spellNameSuggest,
};
