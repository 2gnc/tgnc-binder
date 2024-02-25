import React, { type FC } from 'react';
import { Link } from 'gatsby';
import { Icon, Button } from '@gravity-ui/uikit';
import { Receipt } from '@gravity-ui/icons';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { selectors as sg } from '../../state/gallery';
import { selectors as filtersSelectors } from '../../state/filters';

import './styles.css';

type PropsT = {
    isMobile: boolean;
    path: string;
}
const CollectionHeader:FC<PropsT> = ({
    path,
}) => {
    const { collection } = useSelector(filtersSelectors.filters);
    const owner = useSelector(sg.galleryOwner)

    return (
        <div className='headerBox'>
            <div className='headerNavi'>
                <Link to='/'>
                    <img src={ logo } className='logoLink' />
                </Link>
            </div>
            {
                owner && (
                <a href={`/${owner?.name.toLowerCase()}/trade?collection=${collection}`} target='_blank' className='tradeListLink'>
                    <Button view='raised'>
                        <Icon data={Receipt} size={16} />
                    </Button>
                </a>
                )
            }
            
        </div>
    )
}

export default CollectionHeader;
