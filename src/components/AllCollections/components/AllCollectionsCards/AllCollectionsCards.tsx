import React, { type FC } from 'react';
import size from 'lodash/size';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import entries from 'lodash/entries';
import cn from 'classnames';
import { Link } from 'gatsby';
import { Text, Card, Row, Col, Label, Icon } from '@gravity-ui/uikit';
import { TagRuble, ShoppingCart, Person, Lock, Layers } from '@gravity-ui/icons';
import { InfiniteScroll } from '@gravity-ui/components';
import { nanoid } from 'nanoid';
import { GalleryCardT } from '../../../../models';
import { CardCell, SetCell, LangCell } from '../AllCollectionsTable/cells';
import { RarityIcon } from '../AllCollectionsTable/RarityIcon';
import { calculatePrice } from '../../../../utils/tune-price';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    handleLoadMore: () => Promise<void>;
    total: number;
}

export const AllCollectionsCards:FC<PropsT> = ({
    cards,
    handleLoadMore,
    total,
}) => {
    console.log(cards)
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        );
    }
    const renderPerticularities = (str: string) => {
        if (isEmpty(str)) {
            return null;
        }
        const items = str.split(', ');
        return map(items, (item) => <Label key={ nanoid() } size='xs' theme='info' className='AllCollectionsCards__Label'>{ item }</Label>);
    };

    const renderKeywords = (items: Array<string>) => {
        if (isEmpty(items)) {
            return null;
        }
        return map(items, (item) => <Label key={ nanoid() } size='xs' theme='utility' className='AllCollectionsCards__Label'>{ item }</Label>);
    };

    return (
        <div style={{ padding: '40px 0' }}>
            <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
            {
                map(cards, (item) => {
                    return (
                        <Card type='container' key={ nanoid() } className={ cn('AllCollectionsCards__Card') } >
                            <Row space={0}>
                                <Col s={7}>
                                    <CardCell card={ item.card } isMobile />
                                </Col>
                                <Col s={3}>
                                    <RarityIcon rarity={ item.card.rarity} />
                                    { `${item.card.set}#${item.card.number}` }

                                </Col>
                                <Col s={1}>
                                    <SetCell card={ item.card } isMobile />
                                </Col>
                                <Col s={1}>
                                    <LangCell lang={ item.card.lang } />
                                </Col>
                            </Row>
                            <Row space={0}>
                                <Col s={12}>
                                    { renderPerticularities(item.card.perticularities) }
                                    { renderKeywords(item.card.keywords) }
                                </Col>
                            </Row>
                            <Row space={0}>
                                <Col s={12} className='AllCollectionsCards__Trade'>
                                    <Row space={ 0 } style={{ borderBottom: '1px solid silver', padding: '4px'}}>
                                        <Col s={ 1 }><Icon data={ Layers } /></Col>
                                        <Col s={ 11 }>
                                            <Row space={ 0 }>
                                                <Col s={ 6 }><Icon data={ Person } /></Col>
                                                <Col s={ 1 } style={{ color: 'green'}}><Icon data={ ShoppingCart } /></Col>
                                                <Col s={ 2 } style={{ color: 'green'}}><Icon data={ TagRuble } /></Col>
                                                <Col s={ 1 } style={{ color: 'red'}}><Icon data={ Lock } /></Col>
                                                <Col s={ 2 } style={{ color: 'red'}}><Icon data={ TagRuble } /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        map(entries(item.meta), ([condition, metaData]) => {
                                            return (
                                                <Row space={ 0 } key={ nanoid() } className={ cn('AllCollectionsCards__Owners') }>
                                                    <Col s={ 1 }>{ condition }</Col>
                                                    <Col s={ 11 }>
                                                        {
                                                            map(metaData, (data, i) => {
                                                                return (
                                                                    <Row space={ 0 } key={ nanoid() }>
                                                                        <Col s={ 6 }>
                                                                            <Link to={`/${data.userName.toLowerCase()}/gallery`} className='AllCollectionsCards__Link'>
                                                                                { data.userName }
                                                                            </Link>
                                                                        </Col>
                                                                        <Col s={ 1 }>{ data.tradable ? data.quantity : '-' }</Col>
                                                                        <Col s={ 2 }>{ data.tradable ? calculatePrice(item) : '-' }</Col>
                                                                        <Col s={ 1 }>{ !data.tradable ? data.quantity : '-' }</Col>
                                                                        <Col s={ 2 }>{ !data.tradable ? calculatePrice(item) : '-' }</Col>
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
                        </Card>
                    )
                })
            }
            </InfiniteScroll>
        </div>
    );
}
