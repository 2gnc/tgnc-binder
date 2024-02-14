import React, { type FC } from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import { Text } from '@gravity-ui/uikit';
import { GalleryCardT } from '../../../../models';
import { InfiniteScroll } from '@gravity-ui/components';
import { CardTableRow } from '../CardTableRow/CardTableRow';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    handleLoadMore: () => Promise<void>;
    total: number;
}

type MetaByOwnersT = Record<string, Record<string, OwnersMetaItemT>>

type OwnersMetaItemT = {
    tradable: number;
    nonTradable: number;
    key: string;
    owner: string;
}


export const AllCollectionsTable: FC<PropsT> = ({ cards, handleLoadMore, total }) => {
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        )
    }

    return (
        <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
            { map(cards, (card) => <CardTableRow card={ card } key={ card.card.id } />) }
        </InfiniteScroll>
    );
}
