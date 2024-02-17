import React, { type FC } from 'react';
import size from 'lodash/size';
import { Text, Table, TableColumnConfig } from '@gravity-ui/uikit';
import { InfiniteScroll } from '@gravity-ui/components';
import {
    CardCell,
    SetCell,
    LangCell,
    PeculiaritiesCell,
    TradableQCell,
    TradablePriceCell,
    InCollectionQCell,
    InCollectionPriceCell,
    ActionsCell,
} from './cells';
import { TableRow, prepareTableData } from '../../helpers';
import { GalleryCardT } from '../../../../models';

import './styles.css';

type PropsT = {
    cards: Array<GalleryCardT>;
    handleLoadMore: () => Promise<void>;
    total: number;
}

export const checkIsDouble = (rowData: TableRow, i: number, data: Array<TableRow>): boolean => i > 0 && data[i - 1].meta.key === rowData.meta.key;

export const AllCollectionsTable: FC<PropsT> = ({ cards, handleLoadMore, total }) => {
    if (!size(cards)) {
        return (
            <div className='emptyBox'>
                <Text variant='body-3' className='emptyMsg'>Ничего не нашлось по заданным фильтрам...</Text>
            </div>
        );
    }

    const data = prepareTableData(cards);

    const columns: Array<TableColumnConfig<TableRow>> = [
        {
            id: 'card',
            name: 'Card',
            template: (rowData, i) => {
                const shouldSkip = checkIsDouble(rowData, i, data);
                return <CardCell card={ rowData.card } shouldSkip={ shouldSkip } />
            }
        },
        {
            id: 'set',
            name: 'Set',
            template: (rowData, i) => {
                const shouldSkip = checkIsDouble(rowData, i, data);
                return <SetCell shouldSkip={ shouldSkip } card={ rowData.card} />
            }
        },
        {
            id: 'lang',
            name: 'Lang',
            template: (rowData, i) => {
                const shouldSkip = checkIsDouble(rowData, i, data);
                return <LangCell lang={ rowData.card.lang } shouldSkip={ shouldSkip } /> 
            }
        },
        {
            id: 'peculiarities',
            name: 'Peculiarities',
            template: (rowData, i) => {
                const shouldSkip = checkIsDouble(rowData, i, data);
                return <PeculiaritiesCell card={ rowData.card } shouldSkip={ shouldSkip } />
            }
        },
        {
            id: 'condition',
            name: 'Condiion',
            template: (rowData, i) => {
                const isDouble = checkIsDouble(rowData, i, data) && rowData.meta.condition === data[i - 1].meta.condition;
                if (isDouble) {
                    return ' '
                }
                return rowData.meta.condition;
            }
        },
        {
            id: 'owner',
            name: 'Owner',
            template: (rowData) => rowData.meta.userName,
        },
        {
            id: 'trade_qtty',
            name: 'Tradable',
            align: 'center',
            template: (rowData) => <TradableQCell meta={ rowData.meta } shouldSkip={ !rowData.meta.tradable } />
        },
        {
            id: 'trade_price',
            name: 'Price, ₽',
            template: (rowData) => <TradablePriceCell shouldSkip={ !rowData.meta.tradable } price={ rowData.price } />
        },
        {
            id: 'collection_qtty',
            name: 'In collection',
            align: 'center',
            template: (rowData) => <InCollectionQCell shouldSkip={ rowData.meta.tradable } meta={ rowData.meta } />
        },
        {
            id: 'collection_price',
            name: 'Price, ₽',
            align: 'center',
            template: (rowData) => <InCollectionPriceCell shouldSkip={ rowData.meta.tradable } price={ rowData.price } />
        },
        {
            id: 'actions',
            name: ' ',
            align: 'center',
            template: (rowData) => <ActionsCell meta={ rowData.meta } />
        },
    ];

    return (
        <div style={{ paddingBottom: '70px' }}>
            <InfiniteScroll onActivate={ handleLoadMore } disabled={ cards.length >= total }>
                <Table columns={ columns } data={ data } className='AllCollectionTable' />
            </InfiniteScroll>
        </div>
    );
}
