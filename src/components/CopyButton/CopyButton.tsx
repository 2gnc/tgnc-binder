import React, { type FC } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';

import './styles.css';

type PropsT = {
    onClick: (id: string) => void;
    id: string;
    className: string;
}

export const CopyButton: FC<PropsT> = ({ id, onClick, className }) => {
    const handleClick = () => {
        onClick(id);
    }
    return (
        <div className={`copyButton ${className}`} onClick={ handleClick }>
            <Icon data={ Plus } size={ 32 } />
        </div>
    );
}
