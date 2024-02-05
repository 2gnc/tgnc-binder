import React, { useEffect, useState } from 'react';
import UAParser from 'ua-parser-js';
import type { HeadFC, PageProps } from 'gatsby';
import { Container, ThemeProvider, Modal } from '@gravity-ui/uikit';
import { OwnerT } from '../../models';
import { SelectedCardsView  } from '../SelectedCadsView/SelectedCadsView';

import CollectionHeader from '../../components/CollectionHeader/CollectionHeader';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import GalleryTable from '../../components/GalleryTable/GalleryTable';
import { Footer } from '../Footer/Footer';
import { GoUpButton } from '../GoUpButton/GoUpButton';

import { useSelector, useDispatch } from 'react-redux';
import { actions as a, selectors as s } from '../../state/gallery';

import './gallery.css';

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

const LOAD_AMOUNT = 20;

type PropsT = PageProps & {
    owner: OwnerT;
}

const GalleryPage: React.FC<PropsT> = ({ owner, path }) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(a.galleryPageLoaded({
            owner,
        }));
    }, []);
    
    const newFiltredCards = useSelector(s.galleryFiltredCards)

    // Client side rendering guarantee
    const [isRendered, setIsRendered] = useState(false);

    // Interface state
    const [isCopyPanelOpen, setCopyPanelOpen] = useState(false);

    // Filters
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    
    // const [selectedCards, setSelectedCards] = useState<Array<CardT>>([]);

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
        return newFiltredCards.slice(0, currentChunk * LOAD_AMOUNT + LOAD_AMOUNT);
    }

    useEffect(() => {
        setIsRendered(true);
    }, [])

    const handleFilterButtonClick = () => {
        setIsFiltersVisible(true);
    }

    const handleFiltersClose = () => {
        setIsFiltersVisible(false);
        window?.scrollTo({top: 0, behavior: 'smooth'});
    }

    const openCopyPanel = () => {
        setCopyPanelOpen(true);
    }
    const closeCopyPanel = () => {
        setCopyPanelOpen(false);
    }

    // const flushSelected = () => {
    //     setSelectedCards([]);
    // }

    // const removeOneSelectedCard = (id: string) => {
    //     const candidat = selectedCards.findIndex(card => card.id === id);
    //     const arr = [...selectedCards];
    //     arr.splice(candidat, 1)
    //     setSelectedCards(arr);
    // }

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
                <CollectionFilters
                    isMobile={ IS_MOBILE }
                    handleFiltersClose={ handleFiltersClose }
                    isFiltersVisible={ isFiltersVisible }
                />
                <GalleryTable
                    cards={ getChunk() }
                    handleLoadMore={ handleLoadMore }
                    total={ newFiltredCards.length }
                />
                <Footer
                    isMobile={ IS_MOBILE }
                    handleOpenCopyPanel={ openCopyPanel}
                    // selectionSize={ size(selectedCards) }
                    handleFilterButtonClick={ handleFilterButtonClick }
                />
            </Container>
            <GoUpButton />
            <Modal
                open={isCopyPanelOpen}
                onOutsideClick={ closeCopyPanel }
                contentClassName='copyModal'
            >
                <SelectedCardsView
                    // cards={ selectedCards }
                    handleClose={ closeCopyPanel }
                    // handleClear={ flushSelected }
                    // handleRemoveItem={ removeOneSelectedCard }
                />
            </Modal>
        </ThemeProvider>
    );
}

export default GalleryPage;
export const Head: HeadFC = () => <title>Gallery</title>
