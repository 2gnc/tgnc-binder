import React, { type FC, useState, useRef, useEffect } from 'react';
import { Row, Col, Text, Select, RadioButton, TextInput, Popup, Menu, Label, Flex, Button, Modal, ControlGroupOption, Icon } from '@gravity-ui/uikit';
import { ColorEnum, TypeEnum, PermamentTypeEnum, LangEnum, SetSearchT, FilterParamNameEnum } from '../../models';
import { HighlightedSubstring } from '../HighlightedSubstring/HighlightedSubstring';
import size from 'lodash/size';
import map from 'lodash/map';
import { useSelector, useDispatch } from 'react-redux';

import { actions as a, selectors as s } from '../../state/gallery';

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

import './styles.css';

type PropsT = {
    isMobile: boolean;
    isFiltersVisible: boolean;
    // avalaibleNames: Array<{ name: string; searchBase: string}>;
    // defaultByNameValueFromQuery: string;
    // handleSpellNameSet: (name: string) => void;
    handleFiltersClose: () => void;
}

const CollectionFilters: FC<PropsT> = ({
    isMobile,
    isFiltersVisible,
    // avalaibleNames,
    // defaultByNameValueFromQuery,
    // handleSpellNameSet,
    handleFiltersClose,
}) => {
    const dispatch = useDispatch();
    const {
        collection: currentCollection,
        type: typesFilter,
        color: colorFilter,
        lang: languageFilter,
        set: setsFilter,
    } = useSelector(s.filters);
    const avalaibleTypes = useSelector(s.avalaibleTypes);
    const avalaibleLanguages = useSelector(s.avalaibleLanguages);
    const collections = useSelector(s.userCollections);
    const setsListSuggest = useSelector(s.setsListSuggest);
    const { set: setSearch } = useSelector(s.searchValues);

    const spellTypeSearchRef = useRef(null);
    const spellNameSearchRef = useRef(null);
    const setSearchRef = useRef(null);

    // const [spellTypeSearch, setSpellTypeSearch] = useState('');

    const [spellNameSearch, setSpellNameSearch] = useState(defaultByNameValueFromQuery);
    const [isTypeSuggestOpen, setTypeSuggestOpen] = useState(false);
    const [isNameSuggestOpen, setNameSuggestOpen] = useState(false);
    const [isSetSuggestOpen, setSetSuggestOpen] = useState(false);
    const [nameSuggest, setNameSuggest] = useState<Array<string>>([]);

    // search by spell name
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
            dispatch(a.setFilter(payload));
        } else {
            dispatch(a.removeFilter(payload));
        }

    };
    const handleFilterByLandType = () => {
        const checked = typesFilter.includes(TypeEnum.LAND);
        const payload = {
            filter: FilterParamNameEnum.TYPE,
            value: TypeEnum.LAND,
        }
        if (!checked) {
            dispatch(a.setFilter(payload));
        } else {
            dispatch(a.removeFilter(payload));
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
        dispatch(a.setFilter({
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
        dispatch(a.setSearchValue({
            entity: FilterParamNameEnum.SET,
            value: value,
        }));
    };
    const onSetSelect = (set: SetSearchT) => {
        dispatch(a.setSearchValue({
            entity: FilterParamNameEnum.SET,
            value: '',
        }));
        dispatch(a.setFilter({
            filter: FilterParamNameEnum.SET,
            value: set.code,
        }));
    };
    const onSetRemove = (setCode: string) => {
        dispatch(a.removeFilter({
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
                <Menu.Item key={ name } onClick={ () => onSetSelect(set) } style={{ outline: '1px solid lime'}}>
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

    const onSpellNameSet = (name: string) => {
        handleSpellNameSet(name);
        handleFiltersClose();
    }

    const onFiltersFlush = () => {
        dispatch(a.flushFilters());
    };

    const renderTypesMenu = () => {
        return avalaibleTypes
            .filter((type) => {
                return new RegExp(spellTypeSearch).test(type) && !typesFilter.includes(type)}
            )
            .map(item => (
                <Menu.Item key={item} onClick={() => dispatch(a.setFilter({
                    filter: FilterParamNameEnum.TYPE,
                    value: item,
                }))}>
                    {item}
                </Menu.Item>
            ))
    };

    const renderTypesLabels = () => map(typesFilter, (type) => (
        <Label
            key={type}
            type='close'
            onClose={() => dispatch(a.removeFilter({
                filter: FilterParamNameEnum.TYPE,
                value: type
            }))}
        >
            {type}
        </Label>
    ));

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
                        dispatch(a.setFilter({
                            filter: FilterParamNameEnum.COLLECTION,
                            value: nextValue,
                        }));
                    }}
                    size={isMobile ? 'l' : 's'}
                    className='collectionPopup'
                />
            </Col>
            <Col s='6' l='1'>
                <Text variant='subheader-2' className='filterHeader'>Card type: </Text>
                <RadioButton
                    size={isMobile ? 'l' : 's'}
                    onUpdate={(type) => {
                        dispatch(a.setFilter({
                            filter: FilterParamNameEnum.TYPE,
                            value: type,
                        }));
                    }}
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
                        { renderTypesMenu() }
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
                { renderContent() }
            </Modal>
        )
    }

    return renderContent();
};

export default CollectionFilters;
