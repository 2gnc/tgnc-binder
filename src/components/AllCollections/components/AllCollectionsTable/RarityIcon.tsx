import React, { type FC } from 'react';
import { BookmarkFill } from '@gravity-ui/icons';
import { RarityEnum } from '../../../../models';

type PropsT = {
    rarity: RarityEnum;
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

export const RarityIcon: FC<PropsT> = ({ rarity }) => {
    return <BookmarkFill width={15} color={mapRarityToColor(rarity)} style={{ marginRight: '4px' }} />
}
