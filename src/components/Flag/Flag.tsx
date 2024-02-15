import React, { type FC } from 'react';
import cn from 'classnames';
import { GalleryCardT, LangEnum } from '../../models';
import flagRu from '../../images/flag_ru.png';
import flagEn from '../../images/flag_en.png';
import flagOth from '../../images/flag_oth.png';
import flagSp from '../../images/flag_sp.png';
import flagPt from '../../images/flag_portu.png';
import flagDe from '../../images/flag_de.png';
import flagIt from '../../images/flag_it.png';
import flagJp from '../../images/flag_jp.png';
import flagFr from '../../images/flag_fr.png';
import flagCh from '../../images/flag_ch.png';

import './styles.css';

type PropsT = {
    className?: string;
    lang: LangEnum;
}

const mapLangEnumToIcon = {
    [LangEnum.EN]: flagEn,
    [LangEnum.RU]: flagRu,
    [LangEnum.SP]: flagSp,
    [LangEnum.PT]: flagPt,
    [LangEnum.DE]: flagDe,
    [LangEnum.IT]: flagIt,
    [LangEnum.JP]: flagJp,
    [LangEnum.FR]: flagFr,
    [LangEnum.CH]: flagCh,
    [LangEnum.OTH]: flagOth,
}

export const Flag: FC<PropsT> = ({ className = '', lang }) => {
    return (
        <div className={cn('Flag', className)}>
            <img src={ mapLangEnumToIcon[lang] } className='Flag__Img' />
        </div>
    );
}
