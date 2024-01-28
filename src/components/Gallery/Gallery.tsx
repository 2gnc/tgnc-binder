import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import UAParser from 'ua-parser-js';
import type { HeadFC, PageProps } from "gatsby";
import { Container, ThemeProvider, Modal } from '@gravity-ui/uikit';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import { parseRawCardsResponse } from '../../utils/parse-raw-cards-response';
import { parseRawSetsResponse } from '../../utils/parse-raw-sets-response';
import { CardT, ColorsEnum, OwnerT, PermamentTypeEnum, TypeEnum, SortingValsEnum, SortingDirectionEnum, LangEnum } from '../../models';
import { SelectedCardsView  } from '../SelectedCadsView/SelectedCadsView';
import intersection from 'lodash/intersection';
import size from 'lodash/size';
import isNil from 'lodash/isNil';

import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import GalleryTable from '../../components/GalleryTable/GalleryTable';
import { Footer } from '../Footer/Footer';
import { GoUpButton } from '../GoUpButton/GoUpButton';

import { sortCards } from '../../utils/sort-cards';

import './gallery.css';

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

const ALL = 'all';
const LOAD_AMOUNT = 10;

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
}

const GalleryPage: React.FC<PropsT> = ({ data, owner, path }) => {
    const { sets, setTypes, setBlocks, codesParents, parentSets } = parseRawSetsResponse(data.sets.nodes);
    const { cards, collections, types, names, languages } = parseRawCardsResponse(data.cards.nodes, codesParents);
    const allCollections = [...collections.filter(coll => coll.length), ALL];
    
    const initialCards = useRef(cards);

    // Client side rendering guarantee
    const [isRendered, setIsRendered] = useState(false);

    const [selectedCardsToDisplay, setSelectedCardsToDisplay] = useState<Array<CardT>>(initialCards.current);

    // Interface state
    const [isCopyPanelOpen, setCopyPanelOpen] = useState(false);

    // Filters
    const [colorsFilters, setColorsFilters] = useState<Array<ColorsEnum>>([]);
    const [collectionFilter, setCollectionFilter] = useState<string>(ALL);
    const [typesFilter, setTypesFilter] = useState<Array<string>>([]);
    const [setCodesFilter, setSetCodesFilter] = useState<Array<string>>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [filtersUsedCount, setFiltersUsedCount] = useState(0);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [languageFilter, setLanguageFilter] = useState(ALL as LangEnum)
    
    const [selectedCards, setSelectedCards] = useState<Array<CardT>>([]);

    // Infinite scroll
    const [currentChunk, setCurrentChunk] = useState(0);

    // Sorting
    const [sortingValue, setSortingValue] = useState(SortingValsEnum.NAME_ASC);
    const [sortingDirection, setSortingDirection] = useState(SortingDirectionEnum.ASC);

    const handleLoadMore = () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setCurrentChunk(currentChunk +1);
                resolve();
            }, 500);
        })
    }

    const getChunk = () => {
        return selectedCardsToDisplay.slice(0, currentChunk * LOAD_AMOUNT + LOAD_AMOUNT);
    }

    useEffect(() => {
        setIsRendered(true);
    }, [])

    // парсим фильтры в стейт при загрузке страницы
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get('color');
        const byTypeSearch = urlParams.get('type');
        const byCollectionSearch = urlParams.get('collection');
        const byNameSearch = urlParams.get('name');
        const byLanguageSearch = urlParams.get('lang');
        const bySetsSearch = urlParams.get('set');

        if (!isNil(byColorsSearch)) {
            const colorFilters = byColorsSearch.split(',') as Array<ColorsEnum>;
            setColorsFilters(colorFilters || []);
        }
        if (!isNil(byTypeSearch)) {
            const typesFilter = byTypeSearch.split(',');
            setTypesFilter(typesFilter);
        }
        if (!isNil(bySetsSearch)) {
            const setsFilter = bySetsSearch.split(',');
            setSetCodesFilter(setsFilter);
        }
        if (!isNil(byCollectionSearch)) {
            setCollectionFilter(byCollectionSearch);
        }
        if (!isNil(byLanguageSearch)) {
            setLanguageFilter(byLanguageSearch as LangEnum);
        }
        if (!isNil(byNameSearch)) {
            setNameFilter(byNameSearch);
        }
    }, []);

    // Сортировка
    useEffect(() => {
        const sorted = sortCards(selectedCardsToDisplay, sortingValue, sortingDirection);
        setSelectedCardsToDisplay(sorted);
    }, [sortingValue]);

    // обновляем список карт по фильтрам
    useEffect(() => {
        let filtredByCollectionCards = [...initialCards.current];
        // отбираем по коллекции
        if (collectionFilter) {
            if (collectionFilter !== ALL) {
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

        const isMatchByName = (card: CardT) => {
            const re = new RegExp(nameFilter.toLowerCase())
            return re.test(card.name.toLowerCase());
        }

        const isMatchByLanguage = (card: CardT) => {
            if (languageFilter === ALL as LangEnum) return true;
            return card.lang === languageFilter;
        }

        const isMatchBySetCode = (card: CardT) => {
            if (!size(setCodesFilter)) {
                return true;
            }
            return setCodesFilter.includes(card.setParent);
        }

        const isLandTypeIncluded = typesFilter.includes(TypeEnum.LAND);
        const isTokenTypeIncluded = typesFilter.includes(TypeEnum.TOKEN);

        const isNotLand = (card: CardT) => !card.types.includes(TypeEnum.LAND);
        const isNotToken = (card: CardT) => !card.types.includes(TypeEnum.TOKEN);

        filtredByCollectionCards = filtredByCollectionCards.filter((card) => {
            const hasColorsMatch = isMatchByColor(card);
            const isMatchByType = isMatchByTypes(card);
            const hasNameMatch = isMatchByName(card);
            const hasLanguageMatch = isMatchByLanguage(card);
            const hasSetCodeMatch = isMatchBySetCode(card);

            const shouldIncludeLand = isLandTypeIncluded ? true : isNotLand(card);
            const shouldIncludeTokens = isTokenTypeIncluded ? true : isNotToken(card);

            return hasColorsMatch && isMatchByType && shouldIncludeLand && shouldIncludeTokens && hasNameMatch && hasLanguageMatch && hasSetCodeMatch;
        });

        const sorted = sortCards(filtredByCollectionCards, sortingValue, sortingDirection);
        setSelectedCardsToDisplay(sorted);
        setCurrentChunk(1);
    }, [colorsFilters, collectionFilter, typesFilter, nameFilter, languageFilter, setCodesFilter]);

    const handleFilterButtonClick = () => {
        setIsFiltersVisible(true);
    }

    const handleFiltersClose = () => {
        setIsFiltersVisible(false);
        window?.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleCollectionSelect = (collection: string) => {
        setCollectionFilter(collection);
        updateSearchURL('collection', [collection]);
    };

    const handleLanguageFilterSelect = (language: LangEnum) => {
        setLanguageFilter(language);
        updateSearchURL('lang', [language]);
    }

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

    const handleSetCodeAdd = (code: string) => {
        const setCodesFilterVal = [...setCodesFilter, code];
        setSetCodesFilter(setCodesFilterVal);
        updateSearchURL('set', setCodesFilterVal);
    }

    const handleSetCodeRemove = (code: string) => {
        const setCodesFilterVal = [...setCodesFilter].filter((item) => item !== code);
        setSetCodesFilter(setCodesFilterVal);
        updateSearchURL('set', setCodesFilterVal);
    }

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

    const flushFilters = () => {
        setColorsFilters([]);
        updateSearchURL('color', []);

        setCollectionFilter(ALL);
        updateSearchURL('collection', [ALL]);

        setTypesFilter([]);
        updateSearchURL('type', []);

        setNameFilter('');
        updateSearchURL('name', []);

        setLanguageFilter(ALL as LangEnum);
        updateSearchURL('lang', []);

        setSetCodesFilter([]);
        updateSearchURL('set', []);

        setFiltersUsedCount(0);
    };

    useEffect(() => {
        let count = 0;

        if (size(colorsFilters)) {
            setFiltersUsedCount(count += 1)
        };
        if (collectionFilter.length && collectionFilter !== ALL) {
            setFiltersUsedCount(count += 1)
        };
        if (languageFilter.length && languageFilter !== ALL as LangEnum) {
            setFiltersUsedCount(count += 1)
        };
        if (size(typesFilter)) {
            setFiltersUsedCount(count += 1);
        }
        if (size(nameFilter)) {
            setFiltersUsedCount(count += 1);
        }
        if (size(setCodesFilter)) {
            setFiltersUsedCount(count += 1);
        }

    }, [colorsFilters, collectionFilter, typesFilter, nameFilter, flushFilters, languageFilter, setCodesFilter]);

    const openCopyPanel = () => {
        setCopyPanelOpen(true);
    }
    const closeCopyPanel = () => {
        setCopyPanelOpen(false);
    }

    const flushSelected = () => {
        setSelectedCards([]);
    }

    const removeOneSelectedCard = (id: string) => {
        const candidat = selectedCards.findIndex(card => card.id === id);
        const arr = [...selectedCards];
        arr.splice(candidat, 1)
        setSelectedCards(arr);
    }

    const handleCardClick = (id: string) => {
        const found = cards.find((card) => card.id === id);
        if (found) {
            const updatedSelectedCards = [...selectedCards, found];
            setSelectedCards(updatedSelectedCards);
            toaster.add({
                name: found.id,
                title: 'Added to exchange',
                autoHiding: 1000,
                type: 'success',
                content: found.name
            })
        }
    }

    const handleFilterByName = (name: string) => {
        setNameFilter(name);
        updateSearchURL('name', name ? [name] : []);
    }

    const handleSortingValueSelect = (value: SortingValsEnum) => {
        setSortingValue(value);
        if (value === SortingValsEnum.NAME_ASC || value === SortingValsEnum.PRICE_ASC) {
            setSortingDirection(SortingDirectionEnum.ASC);
        } else {
            setSortingDirection(SortingDirectionEnum.DESC);
        }
    }

    if (!isRendered) {
        return null;
    }

    return (
        <ThemeProvider theme="light">
            <Container spaceRow={ IS_MOBILE ? '4' : '6' } style={{
                height: '100vh',
                maxHeight: '100vh',
            }}>
                <CollectionHeader
                    isMobile={ IS_MOBILE }
                    owner={owner}
                    collection={ collectionFilter }
                    path={ path }
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
                    avalaibleNames={ names }
                    handleSpellNameSet={ handleFilterByName }
                    defaultByNameValueFromQuery={new URLSearchParams(window.location.search).get('name') || ''}
                    handleFiltersClose={ handleFiltersClose }
                    isFiltersVisible={ isFiltersVisible }
                    handleFiltersFlush={ flushFilters }
                    avalaibleLanguages={ languages }
                    languageFilter={ languageFilter }
                    handleLanguageSelect={ handleLanguageFilterSelect }
                    avalaibleSets={ Object.values(parentSets) }
                    handleSetCodeRemove={ handleSetCodeRemove }
                    setCodesFilter={ setCodesFilter }
                    handleSetCodeAdd={ handleSetCodeAdd }
                />
                <GalleryTable
                    cards={ getChunk() }
                    handleCardClick={ handleCardClick }
                    handleLoadMore={ handleLoadMore }
                    total={ selectedCardsToDisplay.length }
                    sortingValue={ sortingValue }
                />
                <Footer
                    isMobile={ IS_MOBILE }
                    owner={ owner }
                    filtersUsedCount={ filtersUsedCount }
                    handleOpenCopyPanel={ openCopyPanel}
                    selectionSize={ size(selectedCards) }
                    handleFilterButtonClick={ handleFilterButtonClick }
                    handleSortingValueSelect={ handleSortingValueSelect }
                    sortingDirection={ sortingDirection }
                />
            </Container>
            <GoUpButton />
            <Modal
                open={isCopyPanelOpen}
                onOutsideClick={ closeCopyPanel }
                contentClassName='copyModal'
            >
                <SelectedCardsView
                    cards={ selectedCards }
                    handleClose={ closeCopyPanel }
                    handleClear={ flushSelected }
                    handleRemoveItem={ removeOneSelectedCard }
                />
            </Modal>
        </ThemeProvider>
    );
}

export default GalleryPage;
export const Head: HeadFC = () => <title>Gallery</title>
