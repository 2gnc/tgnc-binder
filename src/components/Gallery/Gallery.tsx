import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import UAParser from 'ua-parser-js';
import type { HeadFC, PageProps } from "gatsby";
import {Container, ThemeProvider, Modal, Button } from '@gravity-ui/uikit';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';
import { CardT, ColorsEnum, OwnerT, PermamentTypeEnum, TypeEnum } from '../../models';
import { SelectedCardsView  } from '../SelectedCadsView/SelectedCadsView';
import intersection from 'lodash/intersection';
import size from 'lodash/size';
import isNil from 'lodash/isNil';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';

import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import GalleryTable from '../../components/GalleryTable/GalleryTable';

import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';

import './gallery.css';

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

const ALL_COLLECTIONS = 'all';

function updateSearchURL(param: string, value: Array<string>) {
    const urlParams = new URLSearchParams(window.location.search);

    if (!value.length) {
        urlParams.delete(param);
    } else {
        const filtersStr = value.join(',');
        urlParams.set(param, filtersStr);
    }
    const stringifiedParams = urlParams.toString();
    const refresh = window.location.protocol + '//' + window.location.host + window.location.pathname + (stringifiedParams.length ? '?' : '') + stringifiedParams;
    window.history.pushState({ path: refresh }, '', refresh);
}

type PropsT = PageProps & {
    owner: OwnerT;
    queryName: string;
}

const GalleryPage: React.FC<PropsT> = ({ data, owner, queryName }) => {
    const { cards, collections, types } = parseRawCardsResponse(data[queryName].nodes);
    const allCollections = [...collections.filter(coll => coll.length), ALL_COLLECTIONS];
    const initialCards = useRef(cards);
    const [cardsToDisplay, setCardsToDisplay] = useState<Array<CardT>>(initialCards.current);
    const [isCopyPanelOpen, setCopyPanelOpen] = useState(false);
    const [colorsFilters, setColorsFilters] = useState<Array<ColorsEnum>>([]);
    const [collectionFilter, setCollectionFilter] = useState<string>(ALL_COLLECTIONS);
    const [typesFilter, setTypesFilter] = useState<Array<string>>([]);
    const [isRendered, setIsRendered] = useState(false);
    const [selectedCards, setSelectedCards] = useState<Array<CardT>>([]);

    useEffect(() => {
        setIsRendered(true);
    }, [])

    // парсим фильтры в стейт при загрузке страницы
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get('color');
        const byTypeSearch = urlParams.get('type');
        const byCollectionSearch = urlParams.get('collection');

        if (!isNil(byColorsSearch)) {
            const colorFilters = byColorsSearch.split(',') as Array<ColorsEnum>;
            setColorsFilters(colorFilters || []);
        }
        if (!isNil(byTypeSearch)) {
            const typesFilter = byTypeSearch.split(',');
            setTypesFilter(typesFilter);
        }
        if (!isNil(byCollectionSearch)) {
            setCollectionFilter(byCollectionSearch);
        }
    }, []);

    // обновляем список карт по фильтрам
    useEffect(() => {
        let filtredByCollectionCards = [...initialCards.current];
        // отбираем по коллекции
        if (collectionFilter) {
            if (collectionFilter !== ALL_COLLECTIONS) {
                filtredByCollectionCards = filtredByCollectionCards.filter(card => card.collections.includes(collectionFilter))
            }
        }

        const isMatchByColor = (card: CardT) => {
            if (!size(colorsFilters)) {
                return true;
            }
            return size(intersection(colorsFilters, card.colors));
        }

        const isMatchByTypes = (card: CardT) => {
            if (!size(typesFilter)) {
                return true;
            }

            const foundTypes = intersection(typesFilter, card.types);
            return size(foundTypes) && size(foundTypes) === size(typesFilter);
        }

        const isLandTypeIncluded = typesFilter.includes(TypeEnum.LAND);
        const isTokenTypeIncluded = typesFilter.includes(TypeEnum.TOKEN);

        const isNotLand = (card: CardT) => !card.types.includes(TypeEnum.LAND);
        const isNotToken = (card: CardT) => !card.types.includes(TypeEnum.TOKEN);

        filtredByCollectionCards = filtredByCollectionCards.filter((card) => {
            const hasColorsMatch = isMatchByColor(card);
            const isMatchByType = isMatchByTypes(card);

            const shouldIncludeLand = isLandTypeIncluded ? true : isNotLand(card);
            const shouldIncludeTokens = isTokenTypeIncluded ? true : isNotToken(card);

            return hasColorsMatch && isMatchByType && shouldIncludeLand && shouldIncludeTokens;
        });

        setCardsToDisplay(filtredByCollectionCards);
    }, [colorsFilters, collectionFilter, typesFilter]);

    const handleCollectionSelect = (collection: string) => {
        setCollectionFilter(collection);
        updateSearchURL('collection', [collection]);
    };

    const handleCardTypeSelect = (type: PermamentTypeEnum) => {
        let typesFilterVal = [...typesFilter, type];

        if (type === PermamentTypeEnum.TOKEN) {
            typesFilterVal.push(TypeEnum.TOKEN);
        } else {
            typesFilterVal = typesFilterVal.filter((type) => type !== TypeEnum.TOKEN && type !== 'card');
        }
        const typesSet = new Set(typesFilterVal);
        setTypesFilter([...typesSet]);
        updateSearchURL('type', [...typesSet]);
    };

    const handleSpellTypeSelect = (type: string) => {
        const typesFilterVal = [...typesFilter, type];
        setTypesFilter(typesFilterVal);
        updateSearchURL('type', typesFilterVal);
    };

    const handleSpellTypeRemove = (type: string) => {
        const typesFilterVal = [...typesFilter].filter((item) => item !== type);
        setTypesFilter(typesFilterVal);
        updateSearchURL('type', typesFilterVal);
    };

    const handleColorSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const filters = [...colorsFilters];
        let updatedFilters;
        if (checked) {
            filters.push(name as ColorsEnum);
            updatedFilters = [...new Set(filters)];
            setColorsFilters(updatedFilters);
        } else {
            updatedFilters = filters.filter(color => color !== name)
            setColorsFilters(updatedFilters);
        }

        updateSearchURL('color', updatedFilters);
    }, [
        colorsFilters,
        setColorsFilters,
    ])

    const handleFilterByLandSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        let typesFilterVal = [...typesFilter];
        if ( checked ) {
            typesFilterVal.push(TypeEnum.LAND)
        } else {
            typesFilterVal = typesFilterVal.filter((type) => type !== TypeEnum.LAND)
        }
        const typesSet = new Set(typesFilterVal);
        updateSearchURL('type', [...typesSet]);
        setTypesFilter([...typesSet]);
    }

    const openCopyPanel = () => {
        setCopyPanelOpen(true);
    }
    const closeCopyPanel = () => {
        setCopyPanelOpen(false);
    }

    const handleCardClick = (id: string) => {
        const found = cards.find((card) => card.id === id);
        if (found) {
            const updatedSelectedCards = [...selectedCards, found];
            setSelectedCards(updatedSelectedCards);
            toaster.add({
                name: found.id,
                title: 'Добавлено к обмену',
                autoHiding: 2000,
                type: 'success',
                content: found.name
            })
        }
    }

    if (!isRendered) {
        return null;
    }

    return (
        <ThemeProvider theme="light">
                <Container spaceRow="10">
                    <CollectionHeader
                        isMobile={ IS_MOBILE }
                        owner={owner}
                        collectionName={collectionFilter}
                        handleOpenPanel={ openCopyPanel }
                    />
                    <CollectionFilters
                        isMobile={ IS_MOBILE }
                        handleColorSelect={handleColorSelect}
                        handleFilterByLandType={handleFilterByLandSelect}
                        colorsFilters={ colorsFilters }
                        collectionFilter={ collectionFilter }
                        handleCollectionSelect={ handleCollectionSelect }
                        avalaibleCollections={allCollections}
                        typesFilter={ typesFilter }
                        handleCardTypeSelect={ handleCardTypeSelect }
                        avalaibleTypes={ types }
                        handleSpellTypeAdd={ handleSpellTypeSelect }
                        handleSpellTypeRemove={ handleSpellTypeRemove }
                    />
                    <GalleryTable cards={ cardsToDisplay } handleCardClick={handleCardClick} />
                </Container>
            <Modal open={isCopyPanelOpen} onOutsideClick={closeCopyPanel} contentClassName='copyModal'>
                <SelectedCardsView cards={ selectedCards } />
            </Modal>            
        </ThemeProvider>
    );
}

export default GalleryPage;
export const Head: HeadFC = () => <title>Gallery</title>
