import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import size from 'lodash/size';
import { nanoid } from 'nanoid';
import { Modal, Text, Flex, Row, Col } from '@gravity-ui/uikit';
import { AddToDeal } from '../AddToDeal';
import { actions as uiA, selectors as uiS } from '../../../../../../state/ui';
import { actions as tradeA, selectors as tradeS } from '../../../../../../state/trade';
import { UserCardMetaT } from '../../../../../../models';
import { calculatePrice } from '../../../../../../utils/tune-price';
import { RequestBtn } from '../RequestBtn';

import './styles.css';

type PropsT = {}

export const OrderModal: FC<PropsT> = () => {
    const isModalOpen = useSelector(uiS.isOrderModalOpen);
    const dispatch = useDispatch();
    const card = useSelector(tradeS.orderingCard);
    
    if (isNil(card)) {
        return null;
    }

    const tradable: Array<UserCardMetaT> = [];
    const nonTradable: Array<UserCardMetaT> = [];

    const handleCloseModal = () => {
        dispatch(uiA.setIsOrderModalOpen(false));
        dispatch(tradeA.setOrderingCard(null));
    }

    forEach(values(card.meta), (meta) => {
        forEach(meta, (metaItem) => {
            if (metaItem.tradable) {
                tradable.push(metaItem);
            } else {
                nonTradable.push(metaItem);
            }
        });
    });

    const renderOrderTable = (cards: Array<UserCardMetaT>, tradable: boolean, header: string) => {
        if (!size(cards)) {
            return null;
        }

        return (
            <>
                <Text variant='subheader-1'>{ header }</Text>
                {map(cards, (meta) => {
                    return (
                        <Row space={ 0 } key={ nanoid() } className='OrderModal__OrderRow'>
                            <Col s={ 1 }>{ meta.condition }</Col>
                            <Col s={ 4 }>{ meta.userName }</Col>
                            <Col s={ 1 }>{ !tradable && meta.quantity }</Col>
                            <Col s={ 2 }>{ `${calculatePrice(card)}₽` }</Col>
                            <Col s={ 4 }>{ tradable
                                    ? <AddToDeal
                                        owner={ meta.userName }
                                        condition={ meta.condition }
                                        cardKey={ meta.key }
                                        quantity={ meta.quantity }
                                    />
                                    : <RequestBtn
                                        owner={ meta.userName }
                                        condition={ meta.condition }
                                        cardKey={ meta.key }
                                    />
                                }
                            </Col>
                        </Row>
                    );
                })}
            </>
        );
    }

    return (
        <Modal open={ isModalOpen } onClose={ handleCloseModal } contentClassName='OrderModal'>
            <Flex direction='column'>
                <Row space={ 0 }>
                    <Col s={ 6 }>
                        <Flex direction='column'>
                            <Text variant='subheader-2' className='OrderModal__CardName'>
                                { `${card.card.name}` }
                            </Text>
                            <Text>{ `Set: ${card.card.set}` }</Text>
                            <Text>{ `Number: ${card.card.number}` }</Text>
                            <Text>{ `Rarity: ${card.card.rarity}` }</Text>
                            <Text>{ `Lang: ${card.card.lang}` }</Text>
                            <Text>{ `Finish: ${card.card.isFoil ? ' foil' : ''}${card.card.isEtched ? ' etched' : 'non-foil'}` }</Text>
                            <Text>{ `Frame: ${card.card.perticularities.length ? card.card.perticularities : 'usual'}` }</Text>
                        </Flex>
                    </Col>
                    <Col s={ 6 }>
                        <img src={ card.card.imageUrl } style={{ width: '100%' }} />
                    </Col>
                </Row>
                { renderOrderTable(tradable, true, 'Avalaible for trade') }
                { renderOrderTable(nonTradable, false, 'In non-tradable collections') }
            </Flex>
        </Modal>
    );
}
