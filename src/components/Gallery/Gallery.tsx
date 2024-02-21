import React, { useEffect, useState } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Container, ThemeProvider, Modal } from '@gravity-ui/uikit';
import { FilterParamNameEnum, OwnerT } from '../../models';
import { TradePanel  } from '../TradePanel/TradePanel';

import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import GalleryTable from '../../components/GalleryTable/GalleryTable';
import { Footer } from '../Footer/Footer';
import { GoUpButton } from '../GoUpButton/GoUpButton';

import { useSelector, useDispatch } from 'react-redux';
import { actions as filtersA, selectors as filtersS } from '../../state/filters';
import { actions as ag } from '../../state/gallery';
import { IS_MOBILE } from '../../utils/is-mobile';

import './gallery.css';

const LOAD_AMOUNT = 20;

type PropsT = PageProps & {
    owner: OwnerT;
}

const GalleryPage: React.FC<PropsT> = ({ owner, path }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filtersA.setFilter({
            filter: FilterParamNameEnum.OWNER,
            value: owner.name,
        }));
        dispatch(ag.galleryPageLoaded());
        dispatch(ag.setOwner({ owner }));
    }, []);
    
    const filtredCards = useSelector(filtersS.filtredCards)

    // Client side rendering guarantee
    const [isRendered, setIsRendered] = useState(false);
    
    // Infinite scroll
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
        return filtredCards.slice(0, currentChunk * LOAD_AMOUNT + LOAD_AMOUNT);
    }

    useEffect(() => {
        setIsRendered(true);
    }, [])

    if (!isRendered) {
        return null;
    }

    return (
        <ThemeProvider theme="light">
            <Container spaceRow={ IS_MOBILE ? '4' : '6' } style={{
                height: '100vh',
                maxHeight: '100vh',
            }}>
                <CollectionHeader
                    isMobile={ IS_MOBILE }
                    path={ path }
                />
                <CollectionFilters />
                <GalleryTable
                    cards={ getChunk() }
                    handleLoadMore={ handleLoadMore }
                    total={ filtredCards.length }
                />
                <Footer />
            </Container>
            <GoUpButton />
            <TradePanel />
        </ThemeProvider>
    );
}

export default GalleryPage;
export const Head: HeadFC = () => <title>Gallery</title>
