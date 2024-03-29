import React, { FC, useState } from 'react';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import { useSelector, useDispatch } from 'react-redux';
import { CopyButton } from '../../CopyButton/CopyButton';
import { ConditionEnum } from '../../../models';
import { selectors as galleryS } from '../../../state/gallery';
import { actions as a,  selectors as st } from '../../../state/trade';

import './styles.css';

type PropsT = {
    condition: ConditionEnum;
    quantity: number;
    price: string;
    tradable: boolean;
    id: string;
    cardCode: string;
    avalaible: boolean;
}

export const TradeCell: FC<PropsT> = ({ id, cardCode, tradable, condition, avalaible }) => {
    const dispatch = useDispatch();
    const owner = useSelector(galleryS.galleryOwner);

    const inDealsQyantity = useSelector(st.addedInDealsQuantity);
    const thisCardInDeals = inDealsQyantity[cardCode];

    const onCardClick = () => {
        if (!owner) return;

        dispatch(a.addCardToDeal({
            owner: owner.name,
            cardKey: cardCode,
            condition,
        }));

        toaster.add({
            name: id,
            autoHiding: 1000,
            type: 'success',
            content: 'Added to exchange'
        });
    };

    if (!tradable) {
        return (
            <div className='cardCopyBlock'>N/A</div>
        );
    }

    return (
        <div className='cardCopyBlock'>
            <CopyButton id={ id } onClick={ onCardClick } className='cardCopyButton' disabled={ !avalaible } />
        </div>
    );
}
