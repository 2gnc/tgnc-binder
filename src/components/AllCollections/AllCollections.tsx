import React, { type FC } from 'react';
import UAParser from 'ua-parser-js';
import { Container, ThemeProvider, Modal } from '@gravity-ui/uikit';

import './styles.css';

type PropsT = {}

const { device } = new UAParser().getResult();
const IS_MOBILE = device.type === 'mobile';

export const AllCollections: FC<PropsT> = () => {
    return (
        <Container spaceRow={ IS_MOBILE ? '4' : '6' } style={{
            height: '100vh',
            maxHeight: '100vh',
        }}>
            123
        </Container>
    )
    return null;
}
