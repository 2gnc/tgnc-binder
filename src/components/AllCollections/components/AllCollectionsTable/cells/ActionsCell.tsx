import React, { FC } from 'react';
import { Text } from '@gravity-ui/uikit';
import { UserCardMetaT } from '../../../../../models';

type PropsT = {
    meta: UserCardMetaT;
};

export const ActionsCell: FC<PropsT> = ({ meta }) => {
    if (meta.tradable) {
        return 'Order'
    }
    return (
        <Text>Request</Text>
    );
}
