import React, { type FC, useRef, useState } from 'react';
import { Text, Button, Link, Icon, Menu, Popup } from '@gravity-ui/uikit';
import { useSelector, useDispatch } from 'react-redux';
import { LogoTelegram, Copy, BarsAscendingAlignLeftArrowDown, BarsAscendingAlignLeftArrowUp } from '@gravity-ui/icons';
import { SortingDirectionEnum, SortingValsEnum } from '../../models';
import { sortingMenuValues } from '../../constants';
import { selectors as galleryS } from '../../state/gallery';
import { selectors as tradeS } from '../../state/trade';
import { selectors as filtersS, actions as filtersA } from '../../state/filters';

import './styles.css';

type PropsT = React.PropsWithChildren & {
    isMobile: boolean;
    handleOpenCopyPanel: () => void;
    handleFilterButtonClick: () => void;
}

export const Footer: FC<PropsT> = ({
    handleOpenCopyPanel,
    handleFilterButtonClick,
    isMobile,
}) => {
    const dispatch = useDispatch();
    const filtersCount = useSelector(filtersS.filtersCount);
    const owner = useSelector(galleryS.galleryOwner);
    const { sortingDirection } = useSelector(filtersS.sorting);
    const selectionSize = useSelector(tradeS.pickedCardsCount);
    const buttonFiltersRef = useRef(null);
    const [isSortingMenuOpen, setSortingMenuOpen] = useState(false);

    const openSortingPanel = () => {
        setSortingMenuOpen(true);
    };
    const closeSortingPanel = () => {
        setSortingMenuOpen(false);
    };

    const onSortingValueSelect = (val: SortingValsEnum) => {
        dispatch(filtersA.setSorting(val));
        closeSortingPanel();
    };

    const IconSorting = sortingDirection === SortingDirectionEnum.ASC ? BarsAscendingAlignLeftArrowUp : BarsAscendingAlignLeftArrowDown;

    const renderSortingMenuItems = () => (
        sortingMenuValues.map(({ text, value }) => {
            return <Menu.Item  key={ value } onClick={ () => onSortingValueSelect(value) }>{ text }</Menu.Item>
        })
    );

    return (
        <div className='footerBox'>
            {
                isMobile && (
                    <Button size='l' width='auto' view='action' className='filtersButton_mob'
                        onClick={ handleFilterButtonClick }
                    >
                        <Text>{`Filters${ filtersCount > 0 ? ` (${ filtersCount })` : ''}`}</Text>
                    </Button>
                )
            }
            <Button size="l" view='action' onClick={ openSortingPanel } ref={ buttonFiltersRef }>
                <Icon data={ IconSorting } />
            </Button>
            <Popup anchorRef={ buttonFiltersRef } open={ isSortingMenuOpen } onOutsideClick={ closeSortingPanel }>
                <Menu size='xl'>
                    { renderSortingMenuItems() }
                </Menu>
            </Popup>
            <Link href={ owner!.contactLink } target="_blank" className={ isMobile ? 'contactButton_mob' : ''}>
                <Button size="l" view='action'>
                    <Icon data={ LogoTelegram } />
                    {!isMobile && <Text>Contact Owner</Text>}
                </Button>
            </Link>
            <Button size='l' view='action' onClick={ handleOpenCopyPanel } className={ isMobile ? 'collectionButton_mob' : ''} >
                <Icon data={ Copy } />
                <Text>{`${!isMobile ? 'Picked cards:' : ''} ${ selectionSize }`}</Text>
            </Button>
        </div>
    )
}
