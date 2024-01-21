import React, { useEffect, useState, useCallback, useRef } from 'react';
import UAParser from 'ua-parser-js';
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import {Container, Row, Col, Card, ThemeProvider, Text, Modal, Label} from '@gravity-ui/uikit';
import { tunePrice } from '../utils/tune-price';
import { parseRawCardsResponse } from '../utils/parse-raw-cards-response';
import { CardT, ColorsEnum, TypeEnum } from '../models';
import intersection from 'lodash/intersection';
import size from 'lodash/size';
import isNil from 'lodash/isNil';

import CollectionHeader from '../components/CollectionHeader/CollectionHeader';
import CollectionFilters from '../components/CollectionFilters/CollectionFilters';

import './gallery.css';

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

export const queryCards = graphql`
    query {
        allCardsCsv(filter: {}) {
            nodes {
                set
                quantity
                name
                set_name
                image_url
                price_usd
                price_usd_foil
                price_usd_etched
                price_eur
                price_eur_foil
                price_eur_etched
                collection
                is_list
                frame
                is_foil
                keywords
                lang
                artist
                edhrec_rank
                rarity
                id
                colors
                types
                condition
                number
            }
        }
    }
`;

function updateSearchURL(param: string, value: Array<string>) {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersStr = value.join(',');
    urlParams.set(param, filtersStr);
    const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${urlParams.toString()}`;
    window.history.pushState({ path: refresh }, '', refresh);
}

const GalleryPage: React.FC<PageProps> = ({ data }) => {
    const initialCards = useRef(parseRawCardsResponse(data.allCardsCsv.nodes));
    const [cardsToDisplay, setCardsToDisplay] = useState<Array<CardT>>(initialCards.current);
    const [isCopyPanelOpen, setCopyPanelOpen] = useState(false);
    const [colorsFilters, setColorsFilters] = useState<Array<ColorsEnum>>([]);
    const [isLandTypeFilterSelected, setIsLandTypeFilterSelected] = useState(false);

    // парсим фильтры при загрузке страницы
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const byColorsSearch = urlParams.get('color');
        const byTypeSearch = urlParams.get('type');
        if (!isNil(byColorsSearch)) {
            const colorFilters = byColorsSearch.split(',') as Array<ColorsEnum>;
            setColorsFilters(colorFilters || []);
        }
        if (!isNil(byTypeSearch)) {
            const typesFilter = byTypeSearch.split(',');
            if (typesFilter.includes(TypeEnum.LAND)) {
                setIsLandTypeFilterSelected(true);
            }
        }
    }, []);

    // обновляем список карт по фильтрам
    useEffect(() => {
        // цвета
        if (colorsFilters.length) {
            const updatedCardsToDisplay = cardsToDisplay.filter((card) => {
                return size(intersection(colorsFilters, card.colors))
            });
            setCardsToDisplay(updatedCardsToDisplay);
        // показываем все, что есть
        // только земли
        } else if (isLandTypeFilterSelected) {
            const updatedCardsToDisplay = initialCards.current.filter((card) => {
                return card.types.includes(TypeEnum.LAND)
            });
            setCardsToDisplay(updatedCardsToDisplay);
        } else {
            setCardsToDisplay(initialCards.current);
        }

    }, [colorsFilters, isLandTypeFilterSelected])

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

    const handleFilterByLandType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked} = event.target;
        setIsLandTypeFilterSelected(checked);
        updateSearchURL('type', checked ? [TypeEnum.LAND] : []);
    }

    const openCopyPanel = () => {
        setCopyPanelOpen(true);
    }
    const closeCopyPanel = () => {
        setCopyPanelOpen(false);
    }
    return (
        <ThemeProvider theme="light">
            <Container spaceRow="10">
                <CollectionHeader
                    isMobile={ IS_MOBILE }
                    owner={{ name: 'Ksenia', contactLink: 'https://telegram.me/KseniaPolyakova' }}
                    collectionName='Обменник'
                />
                <CollectionFilters
                    isMobile={ IS_MOBILE }
                    handleColorSelect={handleColorSelect}
                    handleFilterByLandType={handleFilterByLandType}
                    colorsFilters={ colorsFilters }
                    onlyLandFilter={ isLandTypeFilterSelected }
                />

                <Row space="5">
                    {
                        cardsToDisplay.map((card) => {
                            const { edhRank, imageUrl, name, id, setName, types, keywords, lang, isFoil, isEtched, rarity, quantity } = card;

                            const calculatedPrice = tunePrice(card);
                            const edhrec = edhRank < 200 ? edhRank : '-';

                            return (
                                <Col s="12" m="4" l='3' key={id}>
                                    <Card type='container' theme='normal' view='raised' className='card'>
                                        
                                        <img src={imageUrl} style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '16px',
                                        }} />
                                        <Row space={5}>
                                            <Col>
                                                <Text variant='subheader-3'>{name}</Text>
                                            </Col>
                                        </Row>
                                        <Row space={5}>
                                            <Col>
                                                <Text variant='body-1'>
                                                    {setName}
                                                </Text>
                                            </Col>
                                        </Row>
                                        <Row space={1}>
                                            <Col>
                                                {
                                                    types.map((item, i) => <Label key={item + i} className='label' theme="normal">{item}</Label>)
                                                }
                                                {
                                                    keywords.map((item, i) => <Label key={item + i} size='xs' className='label' theme="info">{item}</Label>)
                                                }
                                            </Col>
                                        </Row>
                                        <Row space={5} className='detailsRow'>
                                            <Col s='1'>{lang}</Col>
                                            <Col s='3'>{isEtched ? 'etched' : isFoil ? 'foil' : 'non-foil'}</Col>
                                            <Col s='3'>{rarity}</Col>
                                            <Col s='5'>
                                                <Text>
                                                    {`EDHREC rank: ${edhrec}`}
                                                </Text>
                                            </Col>
                                        </Row>
                                        <Row space={5}>
                                            <Col>
                                                
                                            </Col>
                                        </Row>
                                        <Row space={5} className='priceRow'>
                                            <Col>
                                                <Text variant='body-1'>
                                                    {`В наличии: ${quantity}`}
                                                </Text>
                                            </Col>
                                            <Col className='priceCol'>
                                                <Text variant='subheader-2'>{`${calculatedPrice} руб.`}</Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
            <Modal open={isCopyPanelOpen} onOutsideClick={closeCopyPanel}>
                123
            </Modal>
        </ThemeProvider>
    );
}

export default GalleryPage;
export const Head: HeadFC = () => <title>Gallery</title>
