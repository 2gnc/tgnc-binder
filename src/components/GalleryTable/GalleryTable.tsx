import React, { type FC, useState, useEffect } from 'react';
import { CardT } from '../../models';
import { Row, Text } from '@gravity-ui/uikit';
import { InfiniteScroll } from '@gravity-ui/components';
import GalleryCard from '../GalleryCard/GalleryCard';
import size from 'lodash/size';

import './styles.css';

type PropsT = {
    cards: Array<CardT>;
    total: number;
    handleCardClick: (id: string) => void;
    handleLoadMore: () => Promise<void>;
}

const GalleryTable: FC<PropsT> = ({ cards, handleCardClick, handleLoadMore, total }) => {
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        )
    }
    return (
        <Row space="5" className='galleryTable'>
            <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
            { cards.map((card) => <GalleryCard card={ card } key={card.id} handleCardClick={ handleCardClick } />) }
            </InfiniteScroll>
        </Row>

    );
}

export default GalleryTable;
