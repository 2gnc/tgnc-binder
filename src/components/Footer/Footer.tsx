import React, { type FC } from 'react';
import { Text, Button, Link, Icon } from '@gravity-ui/uikit';
import { LogoTelegram, Copy } from '@gravity-ui/icons';
import { OwnerT } from '../../models';

import './styles.css';

type PropsT = React.PropsWithChildren & {
    isMobile: boolean;
    owner: OwnerT;
    handleOpenCopyPanel: () => void;
    handleFilterButtonClick: () => void;
    selectionSize: number;
    filtersUsedCount: number;
}

export const Footer: FC<PropsT> = ({
    handleOpenCopyPanel,
    handleFilterButtonClick,
    isMobile,
    owner,
    selectionSize,
    filtersUsedCount,
}) => {
    return (
        <div className='footerBox'>
            {
                isMobile && (
                    <Button size='l' width='auto' view='action' className='filtersButton_mob'
                        onClick={ handleFilterButtonClick }
                    >
                        <Text>{`Filters${ filtersUsedCount > 0 ? ` (${ filtersUsedCount })` : ''}`}</Text>
                    </Button>
                )
            }
            <Link href={ owner.contactLink } target="_blank" className={ isMobile ? 'contactButton_mob' : ''}>
                <Button size="l" view='action'>
                    <Icon data={ LogoTelegram } />
                    {!isMobile && <Text>Написать владельцу</Text>}
                </Button>
            </Link>
            <Button size='l' view='action' onClick={ handleOpenCopyPanel } className={ isMobile ? 'collectionButton_mob' : ''} >
                <Icon data={Copy} />
                <Text>{`${!isMobile ? 'Selected cards:' : ''} ${ selectionSize }`}</Text>
            </Button>
        </div>
    )
}
