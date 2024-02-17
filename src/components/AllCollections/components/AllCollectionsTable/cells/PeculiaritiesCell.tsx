import React, { FC } from 'react';
import { Flex, Text } from '@gravity-ui/uikit';
import { CardThesaurusItemT } from '../../../../../models';

type PropsT = {
    card: CardThesaurusItemT;
    shouldSkip?: boolean;
};

export const PeculiaritiesCell: FC<PropsT> = ({ card, shouldSkip }) => {
    if (shouldSkip) {
        return ' '
    }

    return (
        <Flex direction='column'>
            <Text>{ card.perticularities }</Text>
            <Text>{ card.promoTypes.join(', ') }</Text>
        </Flex>
    );
}
