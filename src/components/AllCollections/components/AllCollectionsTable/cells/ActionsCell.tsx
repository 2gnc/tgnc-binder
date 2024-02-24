import React, { FC } from 'react';
import { AddToDeal } from '../../AllCollectionsCards/components/AddToDeal';
import { RequestBtn } from '../../AllCollectionsCards/components/RequestBtn';
import { UserCardMetaT } from '../../../../../models';

type PropsT = {
    meta: UserCardMetaT;
};

export const ActionsCell: FC<PropsT> = ({ meta }) => {
    if (meta.tradable) {
        return (
            <AddToDeal
                owner={ meta.userName }
                condition={ meta.condition }
                cardKey={ meta.key }
                quantity={ meta.quantity }
            />
        );
    }
    return (
        <RequestBtn
            owner={ meta.userName }
            condition={ meta.condition }
            cardKey={ meta.key }
        />
    );
}
