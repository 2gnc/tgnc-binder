import React, { type FC, useRef, useState } from 'react';
import { Text, Button, Link, Icon, Menu, Popup } from '@gravity-ui/uikit';
import { useSelector, useDispatch } from 'react-redux';
import { LogoTelegram, Copy, BarsAscendingAlignLeftArrowDown, BarsAscendingAlignLeftArrowUp } from '@gravity-ui/icons';
import { SortingDirectionEnum, SortingValsEnum, OwnerT } from '../../models';
import { sortingMenuValues } from '../../constants';
import { selectors as s } from '../../state/gallery';

import './styles.css';

type PropsT = React.PropsWithChildren & {
    isMobile: boolean;
    owner: OwnerT;
    selectionSize: number;
    // filtersUsedCount: number;
    sortingDirection: SortingDirectionEnum;
    handleOpenCopyPanel: () => void;
    handleFilterButtonClick: () => void;
    handleSortingValueSelect: (val: SortingValsEnum) => void;
}

export const Footer: FC<PropsT> = ({
    handleOpenCopyPanel,
    handleFilterButtonClick,
    handleSortingValueSelect,
    isMobile,
    owner,
    selectionSize,
    // filtersUsedCount,
    sortingDirection,
}) => {
    const filtersCount = useSelector(s.filtersCount);
    const buttonFiltersRef = useRef(null);
    const [isSortingMenuOpen, setSortingMenuOpen] = useState(false);

    const openSortingPanel = () => {
        setSortingMenuOpen(true);
    }
    const closeSortingPanel = () => {
        setSortingMenuOpen(false);
    }

    const onSortingValueSelect = (val: SortingValsEnum) => {
        handleSortingValueSelect(val);
        closeSortingPanel();
    };

    const IconSorting = sortingDirection === SortingDirectionEnum.ASC ? BarsAscendingAlignLeftArrowUp : BarsAscendingAlignLeftArrowDown

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
                    {
                        sortingMenuValues.map(({ text, value }) => {
                            return <Menu.Item  key={ value } onClick={ () => onSortingValueSelect(value) }>{ text }</Menu.Item>
                        })
                    }
                </Menu>
            </Popup>
            <Link href={ owner.contactLink } target="_blank" className={ isMobile ? 'contactButton_mob' : ''}>
                <Button size="l" view='action'>
                    <Icon data={ LogoTelegram } />
                    {!isMobile && <Text>Contact Owner</Text>}
                </Button>
            </Link>
            <Button size='l' view='action' onClick={ handleOpenCopyPanel } className={ isMobile ? 'collectionButton_mob' : ''} >
                <Icon data={ Copy } />
                <Text>{`${!isMobile ? 'Selected cards:' : ''} ${ selectionSize }`}</Text>
            </Button>
        </div>
    )
}
