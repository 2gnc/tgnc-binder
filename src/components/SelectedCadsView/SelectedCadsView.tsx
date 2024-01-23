import React, { type FC } from 'react';
import { Button } from '@gravity-ui/uikit';


import './styles.css';
import { CardT } from '../../models';

type PropsT = {
    cards: Array<CardT>;
}

export const SelectedCardsView: FC<PropsT> = ({ cards }) => {
    return (
        <div>
            {
                cards.map((card) => {
                    return (
                        <div>{card.name}</div>
                    )
                })
            }
            <div>
                <Button view='action'>Скопировать</Button>
                <Button view='outlined-danger'>Очистить</Button>
                <Button view='normal'>Закрыть</Button>
            </div>
        </div>
    )
}
