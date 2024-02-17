import React, { FC } from 'react';
import { Flag } from '../../../../Flag/Flag';
import { LangEnum } from '../../../../../models';

type PropsT = {
    lang: LangEnum;
    shouldSkip?: boolean;
};

export const LangCell: FC<PropsT> = ({ lang, shouldSkip }) => {
    if (shouldSkip) {
        return ' '
    }

    return <Flag lang={ lang} className='allCollectionTable__FlagIcon' />
}
