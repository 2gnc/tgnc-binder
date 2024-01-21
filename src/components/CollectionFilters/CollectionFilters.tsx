import React, { type FC } from 'react';
import { Row, Col, Text } from '@gravity-ui/uikit';
import { ColorsEnum, TypeEnum } from '../../models';

import redMana from '../../images/r.png';
import blackMana from '../../images/b.png';
import colorlessMana from '../../images/c.png';
import greenMana from '../../images/g.png';
import blueMana from '../../images/u.png';
import whiteMana from '../../images/w.png';
import landType from '../../images/l.png';

type PropsT = {
    isMobile: boolean;
    colorsFilters: Array<ColorsEnum>;
    onlyLandFilter: boolean;
    handleColorSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterByLandType: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CollectionFilters: FC<PropsT> = ({
    isMobile,
    colorsFilters,
    onlyLandFilter,
    handleColorSelect,
    handleFilterByLandType
}) => {

    const checkIsColorFilterSet = (color: ColorsEnum): boolean => {
        return colorsFilters.includes(color);
    }

    return (
        <Row space="10">
            <Col>
                <div className='hidden'>
                    <input type='checkbox' name={ColorsEnum.BLACK} id={ColorsEnum.BLACK} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.BLACK)} />
                    <input type='checkbox' name={ColorsEnum.BLUE} id={ColorsEnum.BLUE} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.BLUE)} />
                    <input type='checkbox' name={ColorsEnum.COLORLESS} id={ColorsEnum.COLORLESS} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.COLORLESS)} />
                    <input type='checkbox' name={ColorsEnum.GREEN} id={ColorsEnum.GREEN} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.GREEN)} />
                    <input type='checkbox' name={ColorsEnum.MULTI} id={ColorsEnum.MULTI} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.MULTI)} />
                    <input type='checkbox' name={ColorsEnum.RED} id={ColorsEnum.RED} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.RED)} />
                    <input type='checkbox' name={ColorsEnum.WHITE} id={ColorsEnum.WHITE} onChange={handleColorSelect} checked={colorsFilters.includes(ColorsEnum.WHITE)} />
                    <input type='checkbox' name={TypeEnum.LAND} id={TypeEnum.LAND} onChange={handleFilterByLandType} checked={onlyLandFilter} />
                </div>
                <div className='manaLabels'>
                    {!isMobile && <Text variant='subheader-2' className='filterHeader'>По цвету: </Text>}
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
                    <div className={`manaCheckbox ${onlyLandFilter ? 'manaCheckbox_checked' : ''}`}>
                            <img src={landType} className='manaSymbol' />
                        </div>
                    </label>
                </div>
            </Col>
        </Row>
    )
};

export default CollectionFilters;
