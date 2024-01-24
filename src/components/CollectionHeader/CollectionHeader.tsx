import React, { type FC } from 'react';
import { Breadcrumbs, Icon, Button } from '@gravity-ui/uikit';
import { OwnerT } from '../../models';
import { Link } from 'gatsby';
import { Receipt } from '@gravity-ui/icons';
import logo from '../../images/logo.png';

import './styles.css';

type PropsT = {
    isMobile: boolean;
    owner: OwnerT;
    collection: string;
    path: string;
}
const CollectionHeader:FC<PropsT> = ({
    isMobile,
    owner,
    collection,
    path,
}) => {
    const items = [
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
    ]
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
            <a href={`/${owner.name.toLowerCase()}/trade?collection=${collection}`} target='_blank' className='tradeListLink'>
                <Button view='raised'>
                    <Icon data={Receipt} size={16} />
                </Button>
            </a>
        </div>
    )

}

export default CollectionHeader;
