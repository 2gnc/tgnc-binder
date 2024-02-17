import React, { FC } from 'react';
import { Text } from '@gravity-ui/uikit';

type PropsT = {
    price: number;
    shouldSkip?: boolean;
};

export const InCollectionPriceCell: FC<PropsT> = ({ price, shouldSkip }) => {
    if (shouldSkip) {
        return ' '
    }

    return (
        <Text className='AllCollectionTable__InCollectionPrice'>{ price }</Text>
    );
}
