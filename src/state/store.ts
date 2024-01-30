import { configureStore, combineReducers, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import isNil from 'lodash/isNil';
import { FilterParamNameEnum, ColorEnum } from '../models';
import { updateSearchURL } from './utils/update-search-url';

import cardsReducer from './cards'; // todo
import galleryReducer, { actions as a} from './gallery';

const filtersChangeMiddleware = createListenerMiddleware();
const galleryPageDataReceivedMiddleware = createListenerMiddleware();

filtersChangeMiddleware.startListening({
    actionCreator: a.setFilter,
    effect: (action, listenerApi) => {
        const store = listenerApi.getState() as RootState;
        updateSearchURL(action.payload.filter, store.gallery.filters[action.payload.filter])
    }
});

galleryPageDataReceivedMiddleware.startListening({
    actionCreator: a.galleryPageDataReceived,
    effect: (action, listenerApi) => {
        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get(FilterParamNameEnum.COLOR);
        const byTypeSearch = urlParams.get(FilterParamNameEnum.TYPE);
        const byCollectionSearch = urlParams.get(FilterParamNameEnum.COLLECTION);
        const byNameSearch = urlParams.get('name');
        const byLanguageSearch = urlParams.get(FilterParamNameEnum.LANG);
        const bySetsSearch = urlParams.get(FilterParamNameEnum.SET);

        if (!isNil(byColorsSearch)) {
            const colorFilters = byColorsSearch.split(',') as Array<ColorEnum>;
            colorFilters.forEach((color) => {
                listenerApi.dispatch(a.setFilter({
                    filter: FilterParamNameEnum.COLOR,
                    value: color
                }));
            });
        }
        // if (!isNil(byTypeSearch)) {
        //     const typesFilter = byTypeSearch.split(',');
        //     setTypesFilter(typesFilter);
        // }
        if (!isNil(bySetsSearch)) {
            const setsFilter = bySetsSearch.split(',');
            setsFilter.forEach((value) => {
                listenerApi.dispatch(a.setFilter({
                    filter: FilterParamNameEnum.SET,
                    value
                }))
            });
        }
        if (!isNil(byTypeSearch)) {
            listenerApi.dispatch(a.setFilter({
                filter: FilterParamNameEnum.TYPE,
                value: byTypeSearch,
            }))
        }
        if (!isNil(byCollectionSearch)) {
            listenerApi.dispatch(a.setFilter({
                filter: FilterParamNameEnum.COLLECTION,
                value: byCollectionSearch,
            }));
        }
        if (!isNil(byLanguageSearch)) {
            listenerApi.dispatch(a.setFilter({
                filter: FilterParamNameEnum.LANG,
                value: byLanguageSearch
            }));
        }
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
