import React, { type FC } from 'react';
import { Link } from 'gatsby';
import { Breadcrumbs, Icon, Button } from '@gravity-ui/uikit';
import { Receipt } from '@gravity-ui/icons';
import { OwnerT, SortingValsEnum } from '../../models';
import logo from '../../images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as s } from '../../state/gallery';

import './styles.css';

type PropsT = {
    isMobile: boolean;
    path: string;
}
const CollectionHeader:FC<PropsT> = ({
    isMobile,
    path,
}) => {
    const { collection } = useSelector(s.filters);
    const owner = useSelector(s.owner)
    const items = owner ? [
        {
            text: owner.name,
            action: () => {},
        },
        {
            text: 'Gallery',
            action: () => {},
            href: path
        },
        {
            text: collection,
            action: () => {}
        }
    ] : [];

    return (
        <div className='headerBox'>
            <div className='headerNavi'>
                <Link to='/'>
                    <img src={ logo } className='logoLink' />
                </Link>
                <Breadcrumbs
                    items={items}
                    firstDisplayedItemsCount={0}
                    lastDisplayedItemsCount={2}
                    renderItemDivider={() => '>'}
                />
            </div>
            <a href={`/${owner?.name.toLowerCase()}/trade?collection=${collection}`} target='_blank' className='tradeListLink'>
                <Button view='raised'>
                    <Icon data={Receipt} size={16} />
                </Button>
            </a>
        </div>
    )

}

export default CollectionHeader;
