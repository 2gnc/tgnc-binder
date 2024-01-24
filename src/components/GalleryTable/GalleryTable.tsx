import React, { type FC } from 'react';
import { CardT } from '../../models';
import { Row, Text } from '@gravity-ui/uikit';
import GalleryCard from '../GalleryCard/GalleryCard';
import size from 'lodash/size';

import './styles.css';

type PropsT = {
    cards: Array<CardT>;
    handleCardClick: (id: string) => void;
}

const GalleryTable: FC<PropsT> = ({ cards, handleCardClick }) => {
    if (!size(cards)) {
        return <Text variant='body-3'>Ничего не нашлось по заданным фильтрам...</Text>
    }
    return (
        <Row space="5" className='galleryTable'>
            { cards.map((card) => <GalleryCard card={ card } key={card.id} handleCardClick={ handleCardClick } />) }
        </Row>

    );
}

export default GalleryTable;
