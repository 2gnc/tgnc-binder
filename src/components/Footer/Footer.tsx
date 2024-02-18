import React, { type FC, useRef, useState } from 'react';
import { Text, Button, Link, Icon, Menu, Popup } from '@gravity-ui/uikit';
import { useSelector, useDispatch } from 'react-redux';
import { LogoTelegram, Copy, BarsAscendingAlignLeftArrowDown, BarsAscendingAlignLeftArrowUp } from '@gravity-ui/icons';
import { SortingDirectionEnum, SortingValsEnum } from '../../models';
import { sortingMenuValues } from '../../constants';
import { selectors as galleryS } from '../../state/gallery';
import { selectors as tradeS } from '../../state/trade';
import { selectors as filtersS, actions as filtersA } from '../../state/filters';
import { actions as uiA } from '../../state/ui';
import { IS_MOBILE } from '../../utils/is-mobile';

import './styles.css';

type PropsT = React.PropsWithChildren & {};

export const Footer: FC<PropsT> = () => {
    const dispatch = useDispatch();
    const filtersCount = useSelector(filtersS.filtersCount);
    const owner = useSelector(galleryS.galleryOwner);
    const { sortingDirection } = useSelector(filtersS.sorting);
    const selectionSize = useSelector(tradeS.pickedCardsCount);
    const buttonFiltersRef = useRef(null);
    const [isSortingMenuOpen, setSortingMenuOpen] = useState(false);

    const handleTradePanelOpen = () => {
        dispatch(uiA.setIsTradeModalOpen(true));
    };

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

    const handleFilterButtonClick = () => {
        dispatch(uiA.setFiltersModalOpen(true));
    }

    return (
        <div className='footerBox'>
            <Button size="l" view='action' onClick={ openSortingPanel } ref={ buttonFiltersRef }>
                <Icon data={ IconSorting } />
            </Button>
            {
                IS_MOBILE && (
                    <Button size='l' width='auto' view='action' className='filtersButton_mob'
                        onClick={ handleFilterButtonClick }
                    >
                        <Text>{`Filters${ filtersCount > 0 ? ` (${ filtersCount })` : ''}`}</Text>
                    </Button>
                )
            }
            <Popup anchorRef={ buttonFiltersRef } open={ isSortingMenuOpen } onOutsideClick={ closeSortingPanel }>
                <Menu size='xl'>
                    { renderSortingMenuItems() }
                </Menu>
            </Popup>
            { owner && (
                <Link href={ owner.contactLink } target="_blank" className={ IS_MOBILE ? 'contactButton_mob' : ''}>
                <Button size="l" view='action'>
                    <Icon data={ LogoTelegram } />
                    {!IS_MOBILE && <Text>Contact Owner</Text>}
                </Button>
            </Link>
            )}
            <Button size='l' view='action' onClick={ handleTradePanelOpen } className={ IS_MOBILE ? 'collectionButton_mob' : ''} >
                <Icon data={ Copy } />
                <Text>{`${!IS_MOBILE ? 'Picked cards:' : ''} ${ selectionSize }`}</Text>
            </Button>
        </div>
    )
}
