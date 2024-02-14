import React, { type FC } from 'react';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import entries from 'lodash/entries';
import map from 'lodash/map';
import { nanoid } from 'nanoid';
import { Row, Text, Col, Flex, Card } from '@gravity-ui/uikit';
import { GalleryCardT, LangEnum } from '../../../../models';
import { calculatePrice } from '../../../../utils/tune-price';

import './styles.css';

type PropsT = {
    card: GalleryCardT
}

export const CardTableRow: FC<PropsT> = ({ card }) => {
    const { card: cardData, meta } = card;
    return (
        <div style={{ borderBottom: '1px solid silver'}}>
            <Row space={1}>
                <Col l='3'>
                    <Flex alignItems='center'>
                        <Card type='container' style={{
                            width: '80px'
                        }}>
                            <img src={cardData.imageUrl} style={{
                                width: '100%'
                            }} />
                        </Card>
                        <Flex direction='column'>
                            <Text>{ `${cardData.name}` }</Text>
                            {
                                cardData.lang === LangEnum.RU && cardData.ruName && cardData.name !== cardData.ruName &&
                                (
                                    <Text>{ cardData.ruName }</Text>
                                )
                            }
                            <Text>
                                { `${cardData.set} #${cardData.number}, ${cardData.lang}` }
                            </Text>
                            <Text>
                                { cardData.isFoil && 'foil' }
                                { cardData.isEtched && ' etched' }
                            </Text>
                        </Flex>
                    </Flex>
                </Col>
                <Col l='7'>
                    {
                        map(entries(meta), ([condition, data]) => {
                            return (
                                <Row space={1} key={ nanoid() }>
                                    <Col l={1}>{ condition }</Col>
                                    <Col l={11}>
                                        {
                                            map(data, (dataItem) => {
                                                return (
                                                    <Row space={1} key={ nanoid() }>
                                                        <Col >
                                                            { dataItem.userName }
                                                        </Col>
                                                        <Col>
                                                            { dataItem.quantity}
                                                        </Col>
                                                        <Col>
                                                            { calculatePrice(card) }
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    )
}
