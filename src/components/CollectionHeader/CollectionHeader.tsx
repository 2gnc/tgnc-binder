import React, { type FC } from 'react';
import { Row, Col, Text, Button, Link, Icon } from '@gravity-ui/uikit';
import { HelpPopover } from '@gravity-ui/components';
import {LogoTelegram, Copy} from '@gravity-ui/icons';
import { OwnerT } from '../../models';

type PropsT = {
    isMobile: boolean;
    collectionName: string;
    owner: OwnerT;
}
const CollectionHeader:FC<PropsT> = ({
    isMobile,
    collectionName,
    owner
}) => {
    return (
        <Row space="5">
            <Col s="4">
                <Text variant='header-1' style={{
                    textTransform: 'capitalize'
                }}>{collectionName}</Text>
            </Col>
            <Col s="5">
                <Link href={ owner.contactLink } target="_blank">
                    <Button size="l" view="outlined">
                        <Icon data={LogoTelegram} />
                        {!isMobile && <Text>Написать владельцу</Text>}
                    </Button>
                    <HelpPopover className='helpButton' contentClassName='helpContent' openOnHover size='s' content='Откроется Telegram' />      
                </Link>
            </Col>
            <Col s="3">
                <Button size="l" view="raised" /*onClick={openCopyPanel}*/>
                    <Icon data={Copy} />
                    {!isMobile && <Text>Отобранные карты</Text>}
                </Button>
                <HelpPopover className='helpButton' contentClassName='helpContent' openOnHover size='s' content='Посмотреть и скопировать список отобранных карт (скоро)' />  
            </Col>
        </Row>
    )

}

export default CollectionHeader;
