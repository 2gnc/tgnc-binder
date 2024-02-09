import React, { type FC } from 'react';
import size from 'lodash/size';
import find from 'lodash/find';
import { useSelector } from 'react-redux';
import { Row, Text, Col } from '@gravity-ui/uikit';
import { InfiniteScroll } from '@gravity-ui/components';
import GalleryCard from '../GalleryCard/GalleryCard';
import { GalleryCardT } from '../../models';
import { sortingMenuValues } from '../../constants';
import { selectors as filtersS } from '../../state/filters';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    total: number;
    handleLoadMore: () => Promise<void>;
}

const GalleryTable: FC<PropsT> = ({ cards, handleLoadMore, total }) => {
    const { sortingValue } = useSelector(filtersS.sorting);
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        )
    }

    const sortingText = find(sortingMenuValues, (item) => item.value === sortingValue);

    return (
        <>
            <Row space={ 2 } className='gallerySummary'>
                {
                    sortingText && (
                        <Text>{`Sorting: ${sortingText.text}`}</Text>
                    )
                }
                    <Text>{`${cards.length} of ${total} cards shown`}</Text>
            </Row>
            <Row space={ 5 } className='galleryTable'>
                <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
                    { cards.map((card) => <GalleryCard card={ card } key={card.card.id} />) }
                </InfiniteScroll>
            </Row>
        </>

    );
}

export default GalleryTable;
