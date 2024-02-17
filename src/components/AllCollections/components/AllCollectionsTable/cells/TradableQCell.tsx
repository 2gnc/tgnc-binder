import React, { FC } from 'react';
import { Text } from '@gravity-ui/uikit';
import { UserCardMetaT } from '../../../../../models';

type PropsT = {
    meta: UserCardMetaT;
    shouldSkip?: boolean;
};

export const TradableQCell: FC<PropsT> = ({ meta, shouldSkip }) => {
    if (shouldSkip) {
        return ' ';
    }

    return (
        <Text>{ meta.quantity }</Text>
    );
}
