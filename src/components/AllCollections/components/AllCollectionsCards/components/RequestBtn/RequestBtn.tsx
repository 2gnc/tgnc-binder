import React, { FC } from 'react';
import isNil from 'lodash/isNil';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Button } from '@gravity-ui/uikit';
import { CircleQuestion } from '@gravity-ui/icons';
import { ConditionEnum } from '../../../../../../models';
import { actions as tradeA, selectors as tradeS } from '../../../../../../state/trade';

type PropsT = {
    owner: string;
    condition: ConditionEnum;
    cardKey: string;
}

export const RequestBtn: FC<PropsT> = ({ owner, condition, cardKey }) => {
    const dispatch = useDispatch();

    const cardsRequests = useSelector(tradeS.requestsByCards);
    const thisCardRequests = cardsRequests[cardKey];
    const isRequested = !isNil(thisCardRequests?.[condition]?.[owner]);

    const handleRequestDeal = (owner: string, condition: ConditionEnum, cardKey: string) => {
        dispatch(tradeA.addCardToRequest({
            owner,
            cardKey,
            condition,
        }));
    };

    return (
        <Button onClick={() => handleRequestDeal(owner, condition, cardKey)} view='outlined' disabled={ isRequested }>
            <Icon data={ CircleQuestion }/>
            {isRequested ? 'Requested' : 'Request'}
        </Button>
    );
}
