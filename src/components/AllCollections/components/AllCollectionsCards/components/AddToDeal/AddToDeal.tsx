import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Row, Col } from '@gravity-ui/uikit';
import { CirclePlus, CircleMinus, ShoppingCart } from '@gravity-ui/icons';
import { ConditionEnum } from '../../../../../../models';
import { actions as tradeA, selectors as tradeS } from '../../../../../../state/trade';

import './styles.css';

type PropsT = {
    owner: string;
    condition: ConditionEnum;
    cardKey: string;
    quantity: number;
}

export const AddToDeal:FC<PropsT> = ({ owner, condition, cardKey, quantity }) => {
    const dispatch = useDispatch();
    const inDeals = useSelector(tradeS.dealsbyCards);
    const thisItemInDealsQuantity = inDeals[cardKey]?.[condition]?.[owner] || 0;
    const avalaibleQuantity = quantity - thisItemInDealsQuantity;

    const shouldBlockPlus = avalaibleQuantity < thisItemInDealsQuantity;
    const shouldBlockMinus = avalaibleQuantity > thisItemInDealsQuantity;

    const handleAddToDeal = (owner: string, condition: ConditionEnum, cardKey: string) => {
        if (shouldBlockPlus) {
            return;
        }
        dispatch(tradeA.addCardToDeal({
            owner,
            cardKey,
            condition,
        }));
    };

    const handleRemoveFromDeal = () => {
        if (shouldBlockMinus) {
            return;
        }

        dispatch(tradeA.removeCardFromDeal({
            key: cardKey,
            owner,
            condition,
        }));
    };

    return (
        <div className='AddToDeal'>
            <div onClick={() => handleRemoveFromDeal()} style={{ color: shouldBlockMinus ? 'silver' : 'black' }}>
                <Icon data={ CircleMinus } size='25' />
            </div>
            { avalaibleQuantity }
            <div onClick={() => handleAddToDeal(owner, condition, cardKey)} style={{ color: shouldBlockPlus ? 'silver' : 'black' }}>
                <Icon data={ CirclePlus } size='25' />
            </div>
            
            <div>{ thisItemInDealsQuantity }</div>
            <div>
                <Icon data={ ShoppingCart } />
            </div>
        </div>
    );
}
