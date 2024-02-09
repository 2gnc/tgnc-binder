import React, { type FC, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Text, Select, RadioButton, TextInput, Popup, Menu, Label, Flex, Button, Modal, ControlGroupOption } from '@gravity-ui/uikit';
import map from 'lodash/map';
import { ColorEnum, TypeEnum, PermamentTypeEnum, SetSearchT, FilterParamNameEnum } from '../../models';
import { HighlightedSubstring } from '../HighlightedSubstring/HighlightedSubstring';
import { actions as filtersA, selectors as filtersS } from '../../state/filters';

import redMana from '../../images/r.png';
import blackMana from '../../images/b.png';
import colorlessMana from '../../images/c.png';
import greenMana from '../../images/g.png';
import blueMana from '../../images/u.png';
import whiteMana from '../../images/w.png';
import landType from '../../images/l.png';

const mapColorEnumToImage: Record<ColorEnum, any> = {
    [ColorEnum.BLACK]: blackMana,
    [ColorEnum.BLUE]: blueMana,
    [ColorEnum.COLORLESS]: colorlessMana,
    [ColorEnum.GREEN]: greenMana,
    [ColorEnum.RED]: redMana,
    [ColorEnum.WHITE]: whiteMana,
    [ColorEnum.MULTI]: undefined,
};

const permanentTypeOptions = [
    {
        value: PermamentTypeEnum.CARD,
        content: 'card'
    },
    {
        value: PermamentTypeEnum.TOKEN,
        content: 'token'
    }
];

import './styles.css';

type PropsT = {
    isMobile: boolean;
    isFiltersVisible: boolean;
    handleFiltersClose: () => void;
}

const CollectionFilters: FC<PropsT> = ({
    isMobile,
    isFiltersVisible,
    handleFiltersClose,
}) => {
    const dispatch = useDispatch();
    const {
        collection: currentCollection,
        type: typesFilter,
        color: colorFilter,
        lang: languageFilter,
        set: setsFilter,
    } = useSelector(filtersS.filters);
    const avalaibleLanguages = useSelector(filtersS.avalaibleLanguages);
    const collections = useSelector(filtersS.userCollections);
    const setsListSuggest = useSelector(filtersS.setsListSuggest);
    const spellnameSuggest = useSelector(filtersS.spellNameSuggest);
    const spellTypeSuggest = useSelector(filtersS.spellTypeSuggest);
    const { set: setSearch, name: spellnameSearch, type: spellTypeSearch } = useSelector(filtersS.searchValues);

    const spellTypeSearchRef = useRef(null);
    const spellNameSearchRef = useRef(null);
    const setSearchRef = useRef(null);

    const [isTypeSuggestOpen, setTypeSuggestOpen] = useState(false);
    const [isNameSuggestOpen, setNameSuggestOpen] = useState(false);
    const [isSetSuggestOpen, setSetSuggestOpen] = useState(false);

    // Colors and lands type handle -- start
    const checkIsColorFilterSet = (color: ColorEnum): boolean => {
        return colorFilter.includes(color);
    };
    const handleColorSelect = (color: ColorEnum) => {
        const checked = checkIsColorFilterSet(color);
        const payload = {
            filter: FilterParamNameEnum.COLOR,
            value: color,
        };
        if (!checked) {
            dispatch(filtersA.setFilter(payload));
        } else {
            dispatch(filtersA.removeFilter(payload));
        }

    };
    const handleFilterByLandType = () => {
        const checked = typesFilter.includes(TypeEnum.LAND);
        const payload = {
            filter: FilterParamNameEnum.TYPE,
            value: TypeEnum.LAND,
        }
        if (!checked) {
            dispatch(filtersA.setFilter(payload));
        } else {
            dispatch(filtersA.removeFilter(payload));
        }
    };
    const renderColorCheckboxesList = () => (
        map(Object.values(ColorEnum), (color) => (
            <input
                key={ color }
                type='checkbox'
                name={color}
                id={color}
                onChange={() => handleColorSelect(color)}
                checked={checkIsColorFilterSet(color)}
            />
        ))
    );
    const renderColorIconsList = () => (
        map(Object.values(ColorEnum), (color) => (
            <label htmlFor={ color } key={ color }>
                <div className={`manaCheckbox ${checkIsColorFilterSet(color) ? 'manaCheckbox_checked' : ''}`}>
                    <img src={ mapColorEnumToImage[color] } className='manaSymbol' />
                </div>
            </label>
        ))
    );
    // Colors and lands type handle -- end

    // Language handle -- start
    const handleFilterByLanguage = ([value]: Array<string>) => {
        dispatch(filtersA.setFilter({
            filter: FilterParamNameEnum.LANG,
            value
        }))
    };
    const languageOptions: Array<ControlGroupOption> = avalaibleLanguages.map((lang) => ({
        value: lang,
        content: lang
    }));
    // Language handle -- end

    // Sets search handle -- start
    const handleSetSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSetSuggestOpen(true);
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.SET,
            value: value,
        }));
    };
    const onSetSelect = (set: SetSearchT) => {
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.SET,
            value: '',
        }));
        dispatch(filtersA.setFilter({
            filter: FilterParamNameEnum.SET,
            value: set.code,
        }));
    };
    const onSetRemove = (setCode: string) => {
        dispatch(filtersA.removeFilter({
            filter: FilterParamNameEnum.SET,
            value: setCode,
        }))
    };
    const renderSetsCodes = () => {
        return setsFilter.map((code) => (
            <Label
                key={ code }
                type='close'
                onClose={() => onSetRemove(code)}
            >
                { code }
            </Label>
        ));
    };
    const renderSetsSuggest = () => (
        setsListSuggest.map((set) => {
            const { code, name, icon } = set;
            return (
                <Menu.Item key={ name } onClick={ () => onSetSelect(set) }>
                    <div className='setSuggestItem'>
                       <img src={ icon } className='setIcon' />
                       <Text>{`(${code})`}</Text>
                       <HighlightedSubstring text={ name } substring={ setSearch } color='brand' />
                    </div>
                </Menu.Item>
            )
        })
    );
    // Sets search handle -- end

    // UI handle -- start
    const closeTypeSuggest = () => {
        setTypeSuggestOpen(false);
    }

    const closeSetSuggest = () => {
        setSetSuggestOpen(false);
    }

    const closeNameSuggest = () => {
        setNameSuggestOpen(false);
    }
    // UI handle -- end

    // Spell by name search -- start 
    const onSpellNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNameSuggestOpen(true);
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.NAME,
            value,
        }))
    };
    const onSpellnameSelect = (name: string) => {
        dispatch(filtersA.setFilter({
            filter: FilterParamNameEnum.NAME,
            value: name,
        }));
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.NAME,
            value: '',
        }))
    };
    const renderNamesSuggest = () => {
        return spellnameSuggest.map((item) => (
            <Menu.Item key={item} onClick={() => onSpellnameSelect(item)}>
                 <HighlightedSubstring text={ item } substring={ spellnameSearch } color='brand' />
            </Menu.Item>
        ))
    }
    // Spell by name search -- end

    const onFiltersFlush = () => {
        dispatch(filtersA.flushFilters());
    };

    // Spell type search -- start
    const onSpellTypeSelect = (type: string) => {
        dispatch(filtersA.setFilter({
            filter: FilterParamNameEnum.TYPE,
            value: type,
        }));
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.TYPE,
            value: '',
        }));
    }
    const renderTypesSuggest = () => {
        return spellTypeSuggest.map((item) => (
            <Menu.Item key={item} onClick={() => onSpellTypeSelect(item)}>
                {item}
            </Menu.Item>
        ));
    };
    const renderTypesLabels = () => map(typesFilter, (type) => (
        <Label
            key={type}
            type='close'
            onClose={() => dispatch(filtersA.removeFilter({
                filter: FilterParamNameEnum.TYPE,
                value: type
            }))}
        >
            {type}
        </Label>
    ));
    const onSpellTypeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTypeSuggestOpen(true);
        dispatch(filtersA.setSearchValue({
            entity: FilterParamNameEnum.TYPE,
            value,
        }));
    }; 
    const onPermanentTypeUpdate = (type: PermamentTypeEnum) => {
        if (type === PermamentTypeEnum.TOKEN) {
            dispatch(filtersA.setFilter({
                filter: FilterParamNameEnum.TYPE,
                value: type,
            }));
        } else {
            dispatch(filtersA.removeFilter({
                filter: FilterParamNameEnum.TYPE,
                value: PermamentTypeEnum.TOKEN
            }))
        }
    };
    // Spell type search -- end

    const renderContent = () => (
        <>
        <Row space={isMobile ? '2' : '5'} style={{
            marginTop: !isMobile ? '45px' : '0'
        }}>
            <Col s='12' l='3' className='colorsCol_desktop'>
                <div className='hidden'>
                    { renderColorCheckboxesList() }
                    <input type='checkbox' name={TypeEnum.LAND} id={TypeEnum.LAND} onChange={ handleFilterByLandType } checked={typesFilter.includes(TypeEnum.LAND)} />
                </div>
                <div className='manaLabels'>
                    { renderColorIconsList() }
                    <label htmlFor={TypeEnum.LAND}>
                        <div className={`manaCheckbox ${typesFilter.includes(TypeEnum.LAND) ? 'manaCheckbox_checked' : ''}`}>
                            <img src={landType} className='manaSymbol' />
                        </div>
                    </label>
                </div>
            </Col>
            <Col s='12' l='3'>
                <Text variant='subheader-2' className='filterHeader'>Language: </Text>
                <Select
                    value={[(languageFilter as unknown as string)]}
                    options={ languageOptions }
                    onUpdate={ handleFilterByLanguage }
                    size={isMobile ? 'l' : 's'}
                    className='languagePopup'
                />
            </Col>
            <Col s='12' l='3'>
                <Text variant='subheader-2' className='filterHeader'>Sets:</Text>
                <TextInput
                    ref={ setSearchRef }
                    size={ isMobile ? 'l' : 's' }
                    value={ setSearch }
                    onChange={ handleSetSearch }
                    onBlur={ closeSetSuggest }
                    placeholder='by set code or name'
                    hasClear
                />
                <Flex space={3} style={{
                    paddingTop: '5px',
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                }}>
                    { renderSetsCodes() }
                </Flex>
                <Popup
                    open={ isSetSuggestOpen }
                    anchorRef={setSearchRef}
                    placement='bottom-start'
                >
                    <Menu size='l'>
                        { renderSetsSuggest() }
                    </Menu>
                </Popup>

            </Col>
            <Col s='6' l='1'>
                <Text variant='subheader-2' className='filterHeader'>Collection: </Text>
                <Select
                    value={currentCollection}
                    placeholder='Collection'
                    options={
                        collections.map(coll => ({
                            value: coll,
                            content: coll,
                        }))
                    }
                    onUpdate={([nextValue]) => {
                        dispatch(filtersA.setFilter({
                            filter: FilterParamNameEnum.COLLECTION,
                            value: nextValue,
                        }));
                    }}
                    size={isMobile ? 'l' : 's'}
                    className='collectionPopup'
                />
            </Col>
            <Col s='6' l='1'>
                <Text variant='subheader-2' className='filterHeader'>Card type:</Text>
                <RadioButton
                    size={isMobile ? 'l' : 's'}
                    onUpdate={ onPermanentTypeUpdate }
                    options={ permanentTypeOptions }
                    value={ typesFilter.includes(TypeEnum.TOKEN) ? PermamentTypeEnum.TOKEN : PermamentTypeEnum.CARD }
                />
            </Col>
            <Col s='12' l='2'>
                <Text variant='subheader-2' className='filterHeader'>Spell type:</Text>
                <TextInput
                    ref={ spellTypeSearchRef }
                    size={isMobile ? 'l' : 's'}
                    onChange={ onSpellTypeSearch }
                    value={ spellTypeSearch }
                    onBlur={ closeTypeSuggest }
                    placeholder='instant'
                />
                <Flex space={3} style={{
                    paddingTop: '5px',
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                }}>
                    { renderTypesLabels() }
                </Flex>
                <Popup
                    open={isTypeSuggestOpen}
                    anchorRef={spellTypeSearchRef}
                    placement='bottom-start'
                >
                    <Menu size='l'>
                        { renderTypesSuggest() }
                    </Menu>
                </Popup>
            </Col>
            <Col s='12' l='3'>
                <Text variant='subheader-2' className='filterHeader'>Spell name:</Text>
                <TextInput
                    ref={spellNameSearchRef}
                    size={isMobile ? 'l' : 's'}
                    onChange={ onSpellNameSearch }
                    value={ spellnameSearch }
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
                        { renderNamesSuggest() }
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
                { renderContent() }
            </Modal>
        )
    }

    return renderContent();
};

export default CollectionFilters;
