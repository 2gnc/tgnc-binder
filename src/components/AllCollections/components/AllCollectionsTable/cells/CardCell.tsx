import React, { FC } from 'react';
import { Flex, ActionTooltip, Text } from '@gravity-ui/uikit';
import { BookmarkFill } from '@gravity-ui/icons';
import { renderCardMainInfo } from '../../../helpers';
import { RarityEnum, CardThesaurusItemT } from '../../../../../models';

type PropsT = {
    card: CardThesaurusItemT;
    shouldSkip?: boolean;
};

export const CardCell: FC<PropsT> = ({ card, shouldSkip }) => {

    if (shouldSkip) {
        return ' '
    }

    const mapRarityToColor = (r: RarityEnum): string => {
        switch (r) {
            case RarityEnum.MYTHIC:
                return '#ce4a08';
            case RarityEnum.RARE:
                return '#bc9d58';
            case RarityEnum.UNCOMMON:
                return '#82868d';
            case RarityEnum.COMON:
                return '#333333';
            default:
                return '#b68ebc';
        }
    }
    const rarity = card.rarity
    return (
        <Flex direction='row'>
                <>
                    <BookmarkFill width={15} color={mapRarityToColor(rarity)} />
                    <ActionTooltip title='' description={<img src={ card.imageUrl} width={250} />} >
                        <Text>{ renderCardMainInfo(card) }</Text>
                    </ActionTooltip>
                </>
        </Flex>
    )
}
