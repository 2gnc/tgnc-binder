import React, { type FC } from 'react';
import ScrollToTop from 'react-scroll-up';
import { ArrowUp } from '@gravity-ui/icons';
import { Icon, Button } from '@gravity-ui/uikit';

type PropsT = {}

export const GoUpButton: FC<PropsT> = () => {
    return (
        <ScrollToTop showUnder={160} style={{
                bottom: 80,
                right: 20
            }}>
            <Button view='action' size='l' style={{ opacity: 0.5 }}>
                <Icon data={ ArrowUp } />
            </Button>
        </ScrollToTop>
    );
}
