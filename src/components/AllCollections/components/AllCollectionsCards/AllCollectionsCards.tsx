import React, { type FC } from 'react';
import size from 'lodash/size';
import { Text } from '@gravity-ui/uikit';
import { InfiniteScroll } from '@gravity-ui/components';
import { GalleryCardT } from '../../../../models';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    handleLoadMore: () => Promise<void>;
    total: number;
}

export const AllCollectionsCards:FC<PropsT> = ({
    cards,
    handleLoadMore,
    total,
}) => {
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        );
    }
    return (
        null
    )
}
