import React, { FC } from 'react';
import { Flex, ActionTooltip, Text } from '@gravity-ui/uikit';
import { RarityIcon } from '../RarityIcon';
import { renderCardMainInfo } from '../../../helpers';
import { CardThesaurusItemT } from '../../../../../models';

type PropsT = {
    card: CardThesaurusItemT;
    shouldSkip?: boolean;
    isMobile?: boolean;
};

export const CardCell: FC<PropsT> = ({ card, shouldSkip, isMobile = false }) => {
    if (shouldSkip) {
        return ' '
    }

    const rarity = card.rarity;
    const variant = isMobile ? 'subheader-2' : 'body-1';
    const text = renderCardMainInfo(card, isMobile);
    return (
        <Flex direction='row'>
            { !isMobile && <RarityIcon rarity={ rarity } /> }
            <ActionTooltip title='' description={<img src={ card.imageUrl} width={250} />} >
                <Text variant={ variant }>{ text }</Text>
            </ActionTooltip>
        </Flex>
    )
}
