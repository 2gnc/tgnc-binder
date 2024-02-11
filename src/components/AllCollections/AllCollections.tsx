import React, { type FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal } from '@gravity-ui/uikit';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import { Footer } from '../Footer/Footer';
import { IS_MOBILE } from '../../utils/is-mobile';
import { selectors as filtersS } from '../../state/filters';

import './styles.css';

type PropsT = {}

export const AllCollections: FC<PropsT> = () => {
    const [isRendered, setIsRendered] = useState(false);
    useEffect(() => {
        setIsRendered(true);
    }, [])

    const cards = useSelector(filtersS.filtredCards);
    const ff = cards.filter(card => card.card.number === 105 && card.card.set === 'ltr')
    console.log({ff})
    if (!isRendered) {
        return null;
    }
    return (
        <Container spaceRow={ IS_MOBILE ? '4' : '6' } style={{
            height: '100vh',
            maxHeight: '100vh',
        }}>
            <CollectionHeader
                isMobile={ IS_MOBILE }
                path={ '' }
            />
            <CollectionFilters />
            <Footer />
        </Container>
    )
    return null;
}
