import { configureStore, combineReducers, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import isNil from 'lodash/isNil';
import { FilterParamNameEnum, ColorEnum } from '../models';
import { updateSearchURL } from './utils/update-search-url';

import cardsReducer, { actions as cardsA } from './cards';
import tradeReducer from './trade';
import filtersReducer, { actions as af} from './filters';
import galleryReducer, { actions as ag} from './gallery';
import uiReducer from './ui';

const filtersChangeMiddleware = createListenerMiddleware();
const galleryPageLoadedMiddleware = createListenerMiddleware();
const filtersRemoveMiddleware  = createListenerMiddleware();

filtersChangeMiddleware.startListening({
    actionCreator: af.setFilter,
    effect: (action, listenerApi) => {
        const store = listenerApi.getState() as RootState;
        updateSearchURL(action.payload.filter, store.filters.filters[action.payload.filter])
    },
});

filtersRemoveMiddleware.startListening({
    actionCreator: af.removeFilter,
    effect: (action, listenerApi) => {
        const store = listenerApi.getState() as RootState;
        updateSearchURL(action.payload.filter, store.filters.filters[action.payload.filter])
    }
})

galleryPageLoadedMiddleware.startListening({
    actionCreator: ag.galleryPageLoaded,
    effect: (_action, { dispatch }) => {
        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get(FilterParamNameEnum.COLOR);
        const byTypeSearch = urlParams.get(FilterParamNameEnum.TYPE);
        const byCollectionSearch = urlParams.get(FilterParamNameEnum.COLLECTION);
        const byNameSearch = urlParams.get(FilterParamNameEnum.NAME);
        const byLanguageSearch = urlParams.get(FilterParamNameEnum.LANG);
        const bySetsSearch = urlParams.get(FilterParamNameEnum.SET);

        if (!isNil(byColorsSearch)) {
            const colorFilters = byColorsSearch.split(',') as Array<ColorEnum>;
            colorFilters.forEach((color) => {
                dispatch(af.setFilter({
                    filter: FilterParamNameEnum.COLOR,
                    value: color
                }));
            });
        }
        if (!isNil(byTypeSearch)) {
            const typesFilter = byTypeSearch.split(',');
            typesFilter.forEach((value) => {
                dispatch(af.setFilter({
                    filter: FilterParamNameEnum.TYPE,
                    value
                }))
            });
        }
        if (!isNil(bySetsSearch)) {
            const setsFilter = bySetsSearch.split(',');
            setsFilter.forEach((value) => {
                dispatch(af.setFilter({
                    filter: FilterParamNameEnum.SET,
                    value
                }))
            });
        }
        if (!isNil(byCollectionSearch)) {
            dispatch(af.setFilter({
                filter: FilterParamNameEnum.COLLECTION,
                value: byCollectionSearch,
            }));
        }
        if (!isNil(byLanguageSearch)) {
            dispatch(af.setFilter({
                filter: FilterParamNameEnum.LANG,
                value: byLanguageSearch,
            }));
        }
        if (!isNil(byNameSearch)) {
            dispatch(af.setFilter({
                filter: FilterParamNameEnum.NAME,
                value: byNameSearch,
            }))
        }
    }
})

const rootReducer = combineReducers({
    cards: cardsReducer,
    filters: filtersReducer,
    gallery: galleryReducer,
    trade: tradeReducer,
    ui: uiReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend([
        filtersChangeMiddleware.middleware,
        filtersRemoveMiddleware.middleware,
        galleryPageLoadedMiddleware.middleware,
    ])
});

export type RootState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;
export type Thunk = ThunkAction<void, RootState, null, Action<string>>;

if (typeof window !== 'undefined') {
    window.store = store;
}
export default store;

declare global {
    interface Window {
        store: typeof store;
    }
}
