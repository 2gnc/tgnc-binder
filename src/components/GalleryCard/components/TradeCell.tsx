import React, { FC, useState } from 'react';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import { useSelector, useDispatch } from 'react-redux';
import { CopyButton } from '../../CopyButton/CopyButton';
import { ConditionEnum } from '../../../models';
import { selectors as s } from '../../../state/gallery';
import { actions as a } from '../../../state/trade';

import './styles.css';

type PropsT = {
    condition: ConditionEnum;
    quantity: number;
    price: string;
    tradable: boolean;
    id: string;
    cardCode: string;
}

export const TradeCell: FC<PropsT> = ({ id, cardCode, tradable, quantity }) => {
    const dispatch = useDispatch();
    const owner = useSelector(s.owner);

    const [avalaibleItems, setAvalaibleItems] = useState(quantity);
    
    const onCardClick = () => {
        if (!owner) return;
        if (!avalaibleItems) return;

        dispatch(a.addCardToDeal({
            owner,
            cardCode,
        }));

        toaster.add({
            name: id,
            autoHiding: 1000,
            type: 'success',
            content: 'Added to exchange'
        });

        setAvalaibleItems(avalaibleItems - 1);
    };

    if (!tradable) {
        return (
            <div className='cardCopyBlock'>N/A</div>
        );
    }

    return (
        <div className='cardCopyBlock'>
            <CopyButton id={ id } onClick={ onCardClick } className='cardCopyButton' disabled={ !avalaibleItems } />
        </div>
    );
}
