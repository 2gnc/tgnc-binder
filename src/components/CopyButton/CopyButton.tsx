import React, { type FC } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';
import cn from 'classnames';

import './styles.css';

type PropsT = {
    onClick: (id: string) => void;
    id: string;
    className: string;
    disabled?: boolean;
}

export const CopyButton: FC<PropsT> = ({ id, onClick, className, disabled = false }) => {
    const handleClick = () => {
        if (disabled) {
            return;
        }
        onClick(id);
    };

    return (
        <div className={ cn('copyButton', className, { disabled }) } onClick={ handleClick }>
            <Icon data={ Plus } size={ 32 } />
        </div>
    );
}
