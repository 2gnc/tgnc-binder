import React, { type FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal } from '@gravity-ui/uikit';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import { Footer } from '../Footer/Footer';
import { IS_MOBILE } from '../../utils/is-mobile';
import { selectors as filtersS } from '../../state/filters';
import { AllCollectionsTable } from './components/AllCollectionsTable/AllCollectionsTable';

import './styles.css';

type PropsT = {}

const LOAD_AMOUNT = 10;

export const AllCollections: FC<PropsT> = () => {
    const [isRendered, setIsRendered] = useState(false);
    useEffect(() => {
        setIsRendered(true);
    }, [])
    const cards = useSelector(filtersS.filtredCards);
    const [currentChunk, setCurrentChunk] = useState(0);
    const handleLoadMore = () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setCurrentChunk(currentChunk +1);
                resolve();
            }, 500);
        })
    }
    const getChunk = () => {
        return cards.slice(0, currentChunk * LOAD_AMOUNT + LOAD_AMOUNT);
    }

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
            <AllCollectionsTable cards={ getChunk() } handleLoadMore={ handleLoadMore } total={cards.length} />
            <Footer />
        </Container>
    )
    return null;
}
