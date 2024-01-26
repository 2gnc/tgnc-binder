import React, { type FC } from 'react';
import { Button, Text, Flex, Icon } from '@gravity-ui/uikit';
import { tunePrice } from '../../utils/tune-price';
import { TrashBin } from '@gravity-ui/icons';
import copy from 'copy-to-clipboard';

import './styles.css';
import { CardT } from '../../models';

type PropsT = {
    cards: Array<CardT>;
    handleClose: () => void;
    handleClear: () => void;
    handleRemoveItem: (id: string) => void;
}

export const SelectedCardsView: FC<PropsT> = ({ cards, handleClose, handleClear, handleRemoveItem }) => {
    let TEXT = '';
    let TOTAL = 0;
    const handleCopyList = () => {
        copy(`${TEXT}\n Total: ${TOTAL} rub`);
        handleClose();
    }

    return (
        <div className='selectedCardsView__box'>
            <Text variant='header-2' className='selectedCardsView__header' as='div'>Cards in order:</Text>
            <div className='selectedCardsView__list' id='input'>
            {
                cards.map((card, i) => {
                    const price = tunePrice(card);
                    TOTAL += price;

                    const rowText = `${card.name} (${card.colors.join(',')}) ${card.set}#${card.number} ${card.isFoil ? 'foil' : card.isEtched ? 'etched' : 'non foil'} ${card.lang} - ${price} rub.`
                    TEXT += `${rowText}\n`
                    return (
                        <div className='selectedCardsView__row' key={i}>
                            <Flex space='10' alignItems='center'>
                                { rowText }
                                <Button onClick={ () => handleRemoveItem(card.id) } size="m" view="outlined">
                                    <Icon data={ TrashBin } size={ 16 } />
                                </Button>
                            </Flex>
                        </div>
                    )
                })
            }
            </div>
            <div className='selectedCardsView__totalRow'>
                <Text variant='subheader-2'>{`Total: ${TOTAL} rub.`}</Text>
            </div>
            <div className='selectedCardsView__buttons'>
                <Flex space='3' justifyContent='center'>
                    <Button view='normal' onClick={ handleClose }>Close</Button>
                    <Button view='outlined-danger' onClick={ handleClear }>Clear</Button>
                    <Button view='action' onClick={ handleCopyList }>Copy</Button>
                </Flex>
            </div>
        </div>
    )
}
