import React, { type FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import size from 'lodash/size';
import { Text, Table, TableColumnConfig, ActionTooltip, Flex } from '@gravity-ui/uikit';
import { BookmarkFill } from '@gravity-ui/icons';

import { GalleryCardT, CardThesaurusItemT, UserCardMetaT, RarityEnum } from '../../../../models';
import { InfiniteScroll } from '@gravity-ui/components';
import { renderCardMainInfo } from './helpers';
import { Flag } from '../../../Flag/Flag';
import { selectors as cardsS } from '../../../../state/cards';
import { calculatePrice } from '../../../../utils/tune-price';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    handleLoadMore: () => Promise<void>;
    total: number;
}

export const AllCollectionsTable: FC<PropsT> = ({ cards, handleLoadMore, total }) => {
    const { sets } = useSelector(cardsS.cardsThesaurus);
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        )
    }

    type TableRow = {
        meta: UserCardMetaT;
        card: CardThesaurusItemT;
        price: number;
    }
    const data = [] as Array<TableRow>;

    forEach(cards, (cc) => {
        const { meta, card} = cc;
        forEach(values(meta), (metaVal) => {
            data.push(...map(metaVal, (meta) => {
                return {
                    meta,
                    card,
                    price: calculatePrice(cc)
                }
            }));
        })
    });

    const checkIsDouble = (rowData: TableRow, i: number): boolean => i > 0 && data[i - 1].meta.key === rowData.meta.key;

    const columns: Array<TableColumnConfig<TableRow>> = [
        {
            id: 'card',
            name: 'Card',
            template: (rowData, i) => {
                const isDouble = checkIsDouble(rowData, i);
                if (isDouble) {
                    return ' ';
                }
                const mapRarityToColor = (r: RarityEnum): string => {
                    switch (r) {
                        case RarityEnum.MYTHIC:
                            return '#ce4a08';
                        case RarityEnum.RARE:
                            return '#bc9d58';
                        case RarityEnum.UNCOMMON:
                            return '#82868d';
                        case RarityEnum.COMON:
                            return '#333333';
                        default:
                            return '#b68ebc';
                    }
                }
                const rarity = rowData.card.rarity
                return (
                    <Flex direction='row'>
                            <>
                                <ActionTooltip title='' description={<img src={ rowData.card.imageUrl} width={250} />} >
                                    <Text>{ renderCardMainInfo(rowData.card) }</Text>
                                </ActionTooltip>
                                <BookmarkFill width={15} color={mapRarityToColor(rarity)} />
                            </>
                    </Flex>
                )
            }
        },
        {
            id: 'set',
            name: 'Set',
            template: (rowData, i) => {
                const imgUrl = sets[rowData.card.setParent]?.imageUri;
                const isDouble = checkIsDouble(rowData, i);
                if (isDouble) {
                    return ' ';
                }
                
                return (
                    <Flex direction='column' justifyContent='center' alignItems='center'>
                        { imgUrl && <img src={ imgUrl } width={22} height={22} />  }
                        <Text>{ rowData.card.setParent?.toUpperCase() }</Text>
                    </Flex>
                )
            }
        },
        {
            id: 'lang',
            name: 'Lang',
            template: (rowData, i) => {
                const isDouble = checkIsDouble(rowData, i);
                return isDouble ? ' ' : <Flag lang={ rowData.card.lang} className='allCollectionTable__FlagIcon' />
            }
        },
        {
            id: 'peculiarities',
            name: 'Peculiarities',
            template: (rowData, i) => {
                const isDouble = checkIsDouble(rowData, i);
                if (isDouble) {
                    return ' ';
                }
                return (
                    <Flex direction='column'>
                        <Text>{ rowData.card.perticularities }</Text>
                        <Text>{ rowData.card.promoTypes.join(', ') }</Text>
                    </Flex>
                )
            }
        },
        {
            id: 'condition',
            name: 'Condiion',
            template: (rowData, i) => {
                const isDouble = checkIsDouble(rowData, i) && rowData.meta.condition === data[i - 1].meta.condition;
                if (isDouble) {
                    return ' '
                }
                return rowData.meta.condition
            }
        },
        {
            id: 'owner',
            name: 'Owner',
            template: (rowData) => {
                return rowData.meta.userName
            }
        },
        {
            id: 'trade_qtty',
            name: 'Tradable',
            align: 'center',
            template: (rowData) => {
                if (!rowData.meta.tradable) {
                    return ' '
                }

                return (
                    <Text>{ rowData.meta.quantity }</Text>
                )
            }
        },
        {
            id: 'trade_price',
            name: 'Price, ₽',
            template: (rowData) => {
                if (!rowData.meta.tradable) {
                    return ' '
                }

                return (
                    <Text>{ rowData.price }</Text>
                )
            }
        },
        {
            id: 'collection_qtty',
            name: 'In collection',
            align: 'center',
            template: (rowData) => {
                if (rowData.meta.tradable) {
                    return ' '
                }

                return (
                    <Text>{ rowData.meta.quantity }</Text>
                )
            }
        },
    ];

    return (
        <div style={{ paddingBottom: '70px' }}>
            <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
                <Table columns={ columns } data={ data } />
            </InfiniteScroll>
        </div>
    );
}
