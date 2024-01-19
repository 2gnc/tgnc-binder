import React, { useEffect, useState } from 'react';
import UAParser from 'ua-parser-js';
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import {Container, Row, Col, Card, ThemeProvider, Text, Button, Link, Icon, Modal, Label} from '@gravity-ui/uikit';
import { HelpPopover } from '@gravity-ui/components';
import {LogoTelegram, Copy} from '@gravity-ui/icons';
import { tunePrice } from '../utils/tune-price';
import intersection from 'lodash/intersection';
import size from 'lodash/size';
import redMana from '../images/r.png';
import blackMana from '../images/b.png';
import colorlessMana from '../images/c.png';
import greenMana from '../images/g.png';
import blueMana from '../images/u.png';
import whiteMana from '../images/w.png';

import './gallery.css';

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

export const queryCards = graphql`
  query {
    allCardsCsv(filter: {}) {
        nodes {
          Qtty
          Name
          Set_name
          Image
          Price1
          Price2
          Price3
          Price4
          Collection
          Is_foil
          Keywords
          Lang
          Artist
          EDHREC
          Rarity
          id
          Frame
          List
          Colors
          Type
          Is_land
          Number
          Is_token
        }
      }
}`;

enum ColorsEnum {
    RED = 'red',
    GREEN = 'green',
    WHITE = 'white',
    BLACK = 'black',
    BLUE = 'blue',
    COLORLESS = 'colorless',
    MULTI  = 'multi'
}

function updateSearchURL(param: string, value: Array<string>) {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersStr = value.join(',');
    urlParams.set(param, filtersStr);
    const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${urlParams.toString()}`;
    window.history.pushState({ path: refresh }, '', refresh);
}

function mapCardColorToEnum(cardColor: string): Array<ColorsEnum> {
    const colors = cardColor.split(',');
    const enumColors: Array<ColorsEnum> = [];

    colors.forEach((color) => {
        let currentColor;
        switch(color) {
            case 'R':
                currentColor = ColorsEnum.RED;
                break;
            case 'W':
                currentColor = ColorsEnum.WHITE;
                break;
            case 'B':
                currentColor = ColorsEnum.BLACK;
                break;
            case 'U':
                currentColor = ColorsEnum.BLUE;
                break;
            case 'G':
                currentColor = ColorsEnum.GREEN;
                break;
            default:
                currentColor = ColorsEnum.COLORLESS;
        }
        enumColors.push(currentColor);
    })
    return enumColors;
}

const GalleryPage: React.FC<PageProps> = ({ data }) => {
    const [cardsToDisplay, setCardsToDisplay] = useState(data.allCardsCsv.nodes);
    const [isCopyPanelOpen, setCopyPanelOpen] = useState(false);
    const [colorsFilters, setColorsFilters] = useState<Array<ColorsEnum>>([]);

    // парсим фильтры при загрузке страницы
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const colorsSearch = urlParams.get('color');
        if (!size(colorsSearch)) {
            return;
        }
        const colorFilters = colorsSearch.split(',') as Array<ColorsEnum>;
        setColorsFilters(colorFilters || []);
    }, []);

    // обновляем список карт по фильтрам
    useEffect(() => {
        // цвета
        if (colorsFilters.length) {
            const updatedCardsToDisplay = data.allCardsCsv.nodes.filter((card) => {
                const cardColors = mapCardColorToEnum(card.Colors);
                return size(intersection(colorsFilters, cardColors))
            });
            setCardsToDisplay(updatedCardsToDisplay);
        } else {
            setCardsToDisplay(data.allCardsCsv.nodes);
        }

    }, [colorsFilters])

    const handleColorSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    }

    const checkIsColorFilterSet = (val: ColorsEnum): boolean => {
        return colorsFilters.includes(val);
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
                <Row space="5">
                    <Col s="4">
                        <Text variant='header-1'>Binder</Text>
                    </Col>
                    <Col s="5">
                        <Link href='https://telegram.me/KseniaPolyakova' target="_blank">
                            <Button size="l" view="outlined">
                                <Icon data={LogoTelegram} />
                                {!IS_MOBILE && <Text>Написать владельцу</Text>}
                            </Button>
                            <HelpPopover className='helpButton' contentClassName='helpContent' openOnHover size='s' content='Откроется Telegram' />      
                        </Link>
                    </Col>
                    <Col s="3">
                        <Button size="l" view="raised" /*onClick={openCopyPanel}*/>
                            <Icon data={Copy} />
                            {!IS_MOBILE && <Text>Отобранные карты</Text>}
                        </Button>
                        <HelpPopover className='helpButton' contentClassName='helpContent' openOnHover size='s' content='Посмотреть и скопировать список отобранных карт (скоро)' />  
                    </Col>
                </Row>
                <Row space="10">
                    <Col>
                        <div className='hidden'>
                            <input type='checkbox' name={ColorsEnum.BLACK} id={ColorsEnum.BLACK} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.BLACK)} />
                            <input type='checkbox' name={ColorsEnum.BLUE} id={ColorsEnum.BLUE} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.BLUE)} />
                            <input type='checkbox' name={ColorsEnum.COLORLESS} id={ColorsEnum.COLORLESS} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.COLORLESS)} />
                            <input type='checkbox' name={ColorsEnum.GREEN} id={ColorsEnum.GREEN} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.GREEN)} />
                            <input type='checkbox' name={ColorsEnum.MULTI} id={ColorsEnum.MULTI} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.MULTI)} />
                            <input type='checkbox' name={ColorsEnum.RED} id={ColorsEnum.RED} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.RED)} />
                            <input type='checkbox' name={ColorsEnum.WHITE} id={ColorsEnum.WHITE} onChange={handleColorSelect} checked={checkIsColorFilterSet(ColorsEnum.WHITE)} />
                        </div>
                        <div className='manaLabels'>
                            {!IS_MOBILE && <Text variant='subheader-2' className='filterHeader'>Фильтры по цвету: </Text>}
                            <label htmlFor={ColorsEnum.RED}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.RED) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={redMana} className='manaSymbol' />
                                </div>
                            </label>
                            <label htmlFor={ColorsEnum.BLUE}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.BLUE) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={blueMana} className='manaSymbol' />
                                </div>
                            </label>
                            <label htmlFor={ColorsEnum.COLORLESS}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.COLORLESS) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={colorlessMana} className='manaSymbol' />
                                </div>
                            </label>
                            <label htmlFor={ColorsEnum.GREEN}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.GREEN) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={greenMana} className='manaSymbol' />
                                </div>
                            </label>
                            {/* <label htmlFor={ColorsEnum.MULTI}>
                                MULTI
                            </label> */}
                            <label htmlFor={ColorsEnum.BLACK}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.BLACK) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={blackMana} className='manaSymbol' />
                                </div>
                            </label>
                            <label htmlFor={ColorsEnum.WHITE}>
                                <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.WHITE) ? 'manaCheckbox_checked' : ''}`}>
                                    <img src={whiteMana} className='manaSymbol' />
                                </div>
                            </label>
                        </div>
                    </Col>
                </Row>
                {/* <Row space="10">
                    <Col s="12">
                        Filters
                        по цвету (чекбоксы)
                        по типу 
                        по сету (выпадающий список с автокомплитом)
                        по ключевым словам
                        по названию
                        по языку
                        пайло не пайло

                    </Col>
                </Row> */}
                <Row space="5">
                    {
                        cardsToDisplay.map((card) => {
                            const isFoil = card.Is_foil === 'true';
                            const calculatedPrice = tunePrice({
                                isFoil,
                                isRu: card.Lang === 'ru',
                                isRare: card.Rarity === 'rare',
                                isMyphic: card.Rarity === 'myphic',
                                tcgFoil: parseInt(card.Price2, 10),
                                tcgNonFoil: parseInt(card.Price1, 10),
                                cardMarketFoil: parseInt(card.Price4, 10),
                                cardMarketNonFoil: parseInt(card.Price3, 10),
                            });
                            const edhrec = card.EDHREC < 200 ? card.EDHREC : '-';
                            return (
                                <Col s="12" m="4" l='3' key={card.id}>
                                    <Card type='container' theme='normal' view='raised' className='card'>
                                        
                                        <img src={card.Image} style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '16px',
                                        }} />
                                        <Row space={5}>
                                            <Col>
                                                <Text variant='subheader-3'>{card.Name}</Text>
                                            </Col>
                                        </Row>
                                        <Row space={5}>
                                            <Col>
                                                <Text variant='body-1'>
                                                    {card.Set_name}
                                                </Text>
                                            </Col>
                                        </Row>
                                        <Row space={1}>
                                            <Col>
                                                {
                                                    card.Type.split(' ').filter(item => item !== '—' && item !== '//').map((item, i) => <Label key={item + i} className='label' theme="normal">{item}</Label>)
                                                }
                                                {
                                                    card.Keywords.split(',').map((item, i) => <Label key={item + i} size='xs' className='label' theme="info">{item}</Label>)
                                                }
                                            </Col>
                                        </Row>
                                        <Row space={5} className='detailsRow'>
                                            <Col s='1'>{card.Lang}</Col>
                                            <Col s='3'>{card.Is_foil === 'false' ? 'non-foil' : 'foil'}</Col>
                                            <Col s='3'>{card.Rarity}</Col>
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
                                                    {`В наличии: ${card.Qtty}`}
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
