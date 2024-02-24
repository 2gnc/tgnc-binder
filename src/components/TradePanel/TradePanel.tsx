import React, { type FC } from 'react';
import map from 'lodash/map';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Text, Flex, Icon, Modal } from '@gravity-ui/uikit';
import { TrashBin, Minus } from '@gravity-ui/icons';
import copy from 'copy-to-clipboard';
import { nanoid } from 'nanoid';
import { tunePrice } from '../../utils/tune-price';
import { buildCardThesaurusKey } from '../../state/helpers';
import { IS_MOBILE } from '../../utils/is-mobile';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import { CardInDealT } from '../../models';
import { selectors as tradeS, actions as tradeA} from '../../state/trade';
import { actions as uiA, selectors as uiS } from '../../state/ui';

import './styles.css';
import { forEach } from 'lodash';

export const TradePanel: FC = () => {
    const dispatch = useDispatch();
    const deals = useSelector(tradeS.cardsInDeals);
    const requests = useSelector(tradeS.cardsInRequests);

    const isTradeModalOpen = useSelector(uiS.isTradeModalOpen);

    const handleCloseTradeModal = () => {
        dispatch(uiA.setIsTradeModalOpen(false));
    };

    const handleCopy = (text: string, total?: number) => {
        if (total) {
            copy(`${text}\n Total: ${total} rub`);
        } else {
            copy(`${text}\n`);
        }
        dispatch(uiA.setIsTradeModalOpen(false));
    };

    const handleClear = () => {
        dispatch(tradeA.flushDeals());
    };

    const buildDealString = (item: CardInDealT) => {
        const { card, quantity, condition } = item;
        return `${quantity}: ${card.name} (${card.colors.join(',')}) ${card.set}#${card.number} ${card.isFoil ? 'foil' : card.isEtched ? 'etched' : 'non foil'} ${card.lang} ${condition} - ${tunePrice(card)} rub.`;
    };

    const handleRemoveItemFromDeal = (card: CardInDealT, owner: string) => {
        dispatch(tradeA.removeCardFromDeal({
            key: buildCardThesaurusKey(card.card),
            owner,
            condition: card.condition
        }))
    }

    const dealsUuids = map(deals, (deal, i) => `${deal.owner}${i}`);
    const requestsUuids = map(requests, (request, i) => `${request.owner}${i}`);
    const renderTabContent = (cards: Array<CardInDealT>, owner: string) => map(cards, (item) => {
        return (
            <Flex alignItems='center' justifyContent='space-between' className='dealRow' key={ nanoid() }>
                <Text>{ buildDealString(item) }</Text>
                <Button onClick={ () => handleRemoveItemFromDeal(item, owner) } size="m" view="outlined">
                    <Icon data={ item.quantity > 1 ? Minus : TrashBin } size={ 16 } />
                </Button>
            </Flex>
        );
    });
    const renderTradeTabs = () => map(deals, (deal, i) => {
        let TEXT = '';
        let TOTAL = 0;

        const uuid = `${deal.owner}${i}`;
        const total = deal.cards.reduce((acc, val) => {
            return {
                cards: acc.cards + val.quantity,
                summ: acc.summ + val.quantity * tunePrice(val.card)
            }
        }, { cards: 0, summ: 0 });

        forEach(deal.cards, (item) => {
            const rowText = buildDealString(item);
            TEXT += `${rowText}\n`;
        });

        TOTAL += total.summ;
        const buttonText = IS_MOBILE ? 'Copy' : 'Copy trade offer to clipboard';

        return (
            <AccordionItem uuid={ uuid } className='' key={ nanoid() }>
                <AccordionItemHeading>
                    <AccordionItemButton className={ cn('accordion__button', { mobile: IS_MOBILE }) }>
                        <div>
                            <Text variant='subheader-1' className='dealTotalPart'>{ `${deal.owner}:` }</Text>
                            <Text className='dealTotalPart'>{ `${total.cards} card(s) picked, ` }</Text>
                            <Text className='dealTotalPart'>{ `total amount ${total.summ} rub.` }</Text>
                        </div>
                        <button onClick={ () => handleCopy(TEXT, TOTAL) }>{ buttonText }</button>
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    { renderTabContent(deal.cards, deal.owner) }
                </AccordionItemPanel>
            </AccordionItem>
        );
    });
    const renderRequestsTabs = () => map(requests, (req, i) => {
        let TEXT = '';

        const uuid = `${req.owner}${i}`;
        forEach(req.cards, (item) => {
            const rowText = buildDealString(item);
            TEXT += `${rowText}\n`;
        });

        const buttonText = IS_MOBILE ? 'Copy' : 'Copy request to clipboard';

        return (
            <AccordionItem uuid={ uuid } className='' key={ nanoid() }>
                <AccordionItemHeading>
                    <AccordionItemButton className={ cn('accordion__button', { mobile: IS_MOBILE }) }>
                        <div>
                            <Text variant='subheader-1' className='dealTotalPart'>{ `${req.owner}` }</Text>
                        </div>
                        <button onClick={ () => handleCopy(TEXT) }>{ buttonText }</button>
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    { renderTabContent(req.cards, req.owner) }
                </AccordionItemPanel>
            </AccordionItem>
        );

    });

    return (
        <Modal
            open={ isTradeModalOpen }
            onOutsideClick={ handleCloseTradeModal }
            contentClassName='selectedCardsView'
        >
            <div className='selectedCardsView__box'>
                <div className='selectedCardsView__deals'>
                    <Text variant='header-1' className='selectedCardsView__header' as='div'>Picked for trade</Text>
                    <Accordion allowZeroExpanded preExpanded={ dealsUuids.slice(0, 1) }>
                        { renderTradeTabs() }
                    </Accordion>
                    <Text variant='header-1' className='selectedCardsView__header' as='div'>Requests</Text>
                    <Accordion allowZeroExpanded preExpanded={ requestsUuids.slice(0, 1) }>
                        { renderRequestsTabs() }
                    </Accordion>
                </div>
                <Flex space='3' justifyContent='center' className='selectedCardsView__buttons'>
                    <Button view='outlined-danger' onClick={ handleClear }>Clear</Button>
                    <Button view='normal' onClick={ handleCloseTradeModal }>Close</Button>
                </Flex>
            </div>
        </Modal>
    )
}
