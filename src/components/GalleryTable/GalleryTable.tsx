import React, { type FC } from 'react';
import { CardT } from '../../models';
import { Row, Text } from '@gravity-ui/uikit';
import GalleryCard from '../GalleryCard/GalleryCard';
import size from 'lodash/size';

type PropsT = {
    cards: Array<CardT>;
}

const GalleryTable: FC<PropsT> = ({ cards }) => {
    if (!size(cards)) {
        return <Text variant='body-3'>Ничего не нашлось по заданным фильтрам...</Text>
    }
    return (
        <Row space="5">
            { cards.map((card) => <GalleryCard card={ card } key={card.id} />) }
        </Row>

    );
}

export default GalleryTable;
