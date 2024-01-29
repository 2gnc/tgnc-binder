import { configureStore, combineReducers, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import isNil from 'lodash/isNil';
import { FilterParamNameEnum } from '../models';
import { updateSearchURL } from './utils/update-search-url';

import cardsReducer from './cards'; // todo
import galleryReducer, { galleryPageDataReceived, setFilter } from './gallery';

const filtersChangeMiddleware = createListenerMiddleware();
const galleryPageDataReceivedMiddleware = createListenerMiddleware();

filtersChangeMiddleware.startListening({
    actionCreator: setFilter,
    effect: (action) => {
        updateSearchURL(action.payload.filter, [action.payload.value])
    }
});

galleryPageDataReceivedMiddleware.startListening({
    actionCreator: galleryPageDataReceived,
    effect: (action, listenerApi) => {
        console.log(action);

        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get('color');
        const byTypeSearch = urlParams.get('type');
        const byCollectionSearch = urlParams.get(FilterParamNameEnum.COLLECTION);
        const byNameSearch = urlParams.get('name');
        const byLanguageSearch = urlParams.get('lang');
        const bySetsSearch = urlParams.get('set');

        // if (!isNil(byColorsSearch)) {
        //     const colorFilters = byColorsSearch.split(',') as Array<ColorsEnum>;
        //     setColorsFilters(colorFilters || []);
        // }
        // if (!isNil(byTypeSearch)) {
        //     const typesFilter = byTypeSearch.split(',');
        //     setTypesFilter(typesFilter);
        // }
        // if (!isNil(bySetsSearch)) {
        //     const setsFilter = bySetsSearch.split(',');
        //     setSetCodesFilter(setsFilter);
        // }
        if (!isNil(byCollectionSearch)) {
            listenerApi.dispatch(setFilter({
                filter: FilterParamNameEnum.COLLECTION,
                value: byCollectionSearch,
            }));
            // setCollectionFilter(byCollectionSearch);
        }
        // if (!isNil(byLanguageSearch)) {
        //     setLanguageFilter(byLanguageSearch as LangEnum);
        // }
        // if (!isNil(byNameSearch)) {
        //     setNameFilter(byNameSearch);
        // }
    }
})

const rootReducer = combineReducers({
    cards: cardsReducer,
    gallery: galleryReducer
});

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend([
        filtersChangeMiddleware.middleware,
        galleryPageDataReceivedMiddleware.middleware,
    ])
});

export type RootState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;
export type Thunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
