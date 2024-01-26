import React, { type FC, useState, useRef, useEffect } from 'react';
import { Row, Col, Text, Select, RadioButton, TextInput, Popup, Menu, Label, Flex, Button, Modal } from '@gravity-ui/uikit';
import { ColorsEnum, TypeEnum, PermamentTypeEnum } from '../../models';
import size from 'lodash/size';
import map from 'lodash/map';

import redMana from '../../images/r.png';
import blackMana from '../../images/b.png';
import colorlessMana from '../../images/c.png';
import greenMana from '../../images/g.png';
import blueMana from '../../images/u.png';
import whiteMana from '../../images/w.png';
import landType from '../../images/l.png';

import './styles.css';

type PropsT = {
    isMobile: boolean;
    isFiltersVisible: boolean;
    colorsFilters: Array<ColorsEnum>;
    collectionFilter: string;
    avalaibleCollections: Array<string>;
    typesFilter: Array<string>;
    avalaibleTypes: Array<string>;
    avalaibleNames: Array<{ name: string; searchBase: string}>;
    defaultByNameValueFromQuery: string;
    handleColorSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterByLandType: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCollectionSelect: (collection: string) => void;
    handleCardTypeSelect: (type: PermamentTypeEnum) => void;
    handleSpellTypeAdd: (type: string) => void;
    handleSpellTypeRemove: (type: string) => void;
    handleSpellNameSet: (name: string) => void;
    handleFiltersClose: () => void;
    handleFiltersFlush: () => void;
}

const CollectionFilters: FC<PropsT> = ({
    isMobile,
    isFiltersVisible,
    colorsFilters,
    collectionFilter,
    avalaibleCollections,
    typesFilter,
    avalaibleTypes,
    avalaibleNames,
    defaultByNameValueFromQuery,
    handleColorSelect,
    handleFilterByLandType,
    handleCollectionSelect,
    handleCardTypeSelect,
    handleSpellTypeAdd,
    handleSpellTypeRemove,
    handleSpellNameSet,
    handleFiltersClose,
    handleFiltersFlush,
}) => {
    const spellTypeSearchRef = useRef(null);
    const spellNameSearchRef = useRef(null);
    const [spellTypeSearch, setSpellTypeSearch] = useState('');
    const [spellNameSearch, setSpellNameSearch] = useState(defaultByNameValueFromQuery);
    const [isTypeSuggestOpen, setTypeSuggestOpen] = useState(false);
    const [isNameSuggestOpen, setNameSuggestOpen] = useState(false);
    const [nameSuggest, setNameSuggest] = useState<Array<string>>([]);

    useEffect(() => {
        setTypeSuggestOpen(size(spellTypeSearch) > 2)
    }, [spellTypeSearch]);

    useEffect(() => {
        if (!size(spellNameSearch)) {
            handleSpellNameSet('');
        }
        
        if (size(spellNameSearch) < 3) return;
        const found = avalaibleNames
            .filter((name) => new RegExp(spellNameSearch).test(name.searchBase))
            .map(item => item.name);
        
        setNameSuggest([... new Set(found)]);                
        setNameSuggestOpen(true);
    }, [spellNameSearch]);

    const checkIsColorFilterSet = (color: ColorsEnum): boolean => {
        return colorsFilters.includes(color);
    }

    const closeTypeSuggest = () => {
        setTypeSuggestOpen(false);
    }

    const closeNameSuggest = () => {
        setNameSuggestOpen(false);
    }

    const onSpellTypeAdd = (item: string) => {
        handleSpellTypeAdd(item);
        setSpellTypeSearch('');
    }

    const onSpellNameSet = (name: string) => {
        handleSpellNameSet(name);
        handleFiltersClose();
    }

    const onFiltersFlush = () => {
        handleFiltersFlush();
        setSpellNameSearch('');
    }

    const renderContent = () => (
        <>
        <Row space={isMobile ? '2' : '5'} style={{
            marginTop: !isMobile ? '45px' : '0'
        }}>
            <Col s='12' l='3' className='colorsCol_desktop'>
                <div className='hidden'>
                    <input type='checkbox' name={ColorsEnum.BLACK} id={ColorsEnum.BLACK} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.BLACK)} />
                    <input type='checkbox' name={ColorsEnum.BLUE} id={ColorsEnum.BLUE} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.BLUE)} />
                    <input type='checkbox' name={ColorsEnum.COLORLESS} id={ColorsEnum.COLORLESS} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.COLORLESS)} />
                    <input type='checkbox' name={ColorsEnum.GREEN} id={ColorsEnum.GREEN} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.GREEN)} />
                    <input type='checkbox' name={ColorsEnum.MULTI} id={ColorsEnum.MULTI} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.MULTI)} />
                    <input type='checkbox' name={ColorsEnum.RED} id={ColorsEnum.RED} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.RED)} />
                    <input type='checkbox' name={ColorsEnum.WHITE} id={ColorsEnum.WHITE} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.WHITE)} />
                    <input type='checkbox' name={TypeEnum.LAND} id={TypeEnum.LAND} onChange={handleFilterByLandType} checked={typesFilter.includes(TypeEnum.LAND)} />
                </div>
                <div className='manaLabels'>
                    <label htmlFor={ColorsEnum.WHITE}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.WHITE) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={whiteMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={ColorsEnum.BLUE}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.BLUE) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={blueMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={ColorsEnum.BLACK}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.BLACK) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={blackMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={ColorsEnum.RED}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.RED) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={redMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={ColorsEnum.GREEN}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.GREEN) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={greenMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={ColorsEnum.COLORLESS}>
                        <div className={`manaCheckbox ${checkIsColorFilterSet(ColorsEnum.COLORLESS) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={colorlessMana} className='manaSymbol' />
                        </div>
                    </label>
                    <label htmlFor={TypeEnum.LAND}>
                        <div className={`manaCheckbox ${typesFilter.includes(TypeEnum.LAND) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={landType} className='manaSymbol' />
                        </div>
                    </label>
                </div>
            </Col>
            <Col s='6' l='1'>
                <Text variant='subheader-2' className='filterHeader'>Collection: </Text>
                <Select
                    value={[collectionFilter]}
                    placeholder='Collection'
                    options={
                        avalaibleCollections.map(coll => ({
                            value: coll,
                            content: coll,
                        }))
                    }
                    onUpdate={([nextValue]) => handleCollectionSelect(nextValue)}
                    size={isMobile ? 'l' : 's'}
                    className='collectionPopup'
                />
            </Col>
            <Col s='6' l='1'>
                <Text variant='subheader-2' className='filterHeader'>Card type: </Text>
                <RadioButton
                    size={isMobile ? 'l' : 's'}
                    onUpdate={handleCardTypeSelect}
                    options={[
                        {
                            value: PermamentTypeEnum.CARD,
                            content: 'card'
                        },
                        {
                            value: PermamentTypeEnum.TOKEN,
                            content: 'token'
                        }
                    ]}
                    value={ typesFilter.includes(TypeEnum.TOKEN) ? PermamentTypeEnum.TOKEN : PermamentTypeEnum.CARD }
                />
            </Col>
            <Col s='12' l='2'>
                <Text variant='subheader-2' className='filterHeader'>Spell type: </Text>
                <TextInput
                    ref={spellTypeSearchRef}
                    size={isMobile ? 'l' : 's'}
                    onChange={(event) => {
                        setSpellTypeSearch(event.target.value.toLowerCase());
                    }}
                    value={spellTypeSearch}
                    onBlur={closeTypeSuggest}
                    placeholder='instant'
                />
                <Flex space={3} style={{
                    paddingTop: '5px',
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                }}>
                    {
                        map(typesFilter, (type) => (
                            <Label
                                key={type}
                                type='close'
                                onClose={() => handleSpellTypeRemove(type)}
                            >
                                {type}
                            </Label>
                        ))
                    }
                </Flex>
                <Popup
                    open={isTypeSuggestOpen}
                    anchorRef={spellTypeSearchRef}
                    placement='bottom-start'
                >
                    <Menu size='l'>
                        {
                            avalaibleTypes
                                .filter((type) => {
                                    return new RegExp(spellTypeSearch).test(type) && !typesFilter.includes(type)}
                                )
                                .map(item => (
                                    <Menu.Item key={item} onClick={() => onSpellTypeAdd(item)}>
                                        {item}
                                    </Menu.Item>
                                ))
                        }
                    </Menu>
                </Popup>
            </Col>
            <Col s='12' l='3'>
                <Text variant='subheader-2' className='filterHeader'>Spell name: </Text>
                <TextInput
                    ref={spellNameSearchRef}
                    size={isMobile ? 'l' : 's'}
                    onChange={(event) => {
                        setSpellNameSearch(event.target.value.toLowerCase());
                    }}
                    value={spellNameSearch}
                    onBlur={closeNameSuggest}
                    placeholder='abrade'
                    hasClear
                    
                />
                <Popup
                    open={isNameSuggestOpen}
                    anchorRef={spellNameSearchRef}
                    placement='bottom-start'
                >
                    <Menu size='l'>
                        {
                            nameSuggest.map((item) => (
                                <Menu.Item key={item} onClick={() => onSpellNameSet(item)}>
                                    {item}
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Popup>
            </Col>
        </Row>
        {
            isMobile && (
                <Row space={5}>
                    <Col s={12}>
                        <Flex justifyContent='center' className='buttonRow' >
                            <Button view='outlined-danger' size='l' onClick={ onFiltersFlush }>
                                Reset
                            </Button>
                            <Button view='action' size='l' onClick={ handleFiltersClose }>
                                Apply
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            )
        }
       
        </>
    );


    if (isMobile) {
        return (
            <Modal open={ isFiltersVisible } contentClassName='filtersModal' onClose={ handleFiltersClose }>
                <>
                    <div className='filtersModalHeader'>
                        <Text variant='header-1' >Filters:</Text>
                    </div>
                    { renderContent() }
                </>
            </Modal>
        )
    }

    return renderContent();
};

export default CollectionFilters;
