import React, { type FC } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import entries from 'lodash/entries';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { Row, Col, Card, Text, Label, Table } from '@gravity-ui/uikit';
import { TradeCell } from './components/TradeCell';
import { GalleryCardT, LangEnum } from '../../models';
import { calculatePrice } from '../../utils/tune-price';
import { selectors as s } from '../../state/trade';
import { buildCardThesaurusKey } from '../../state/helpers';
import foilCover from '../../images/foil-cover.png';
import flagRu from '../../images/flag_ru.png';
import flagEn from '../../images/flag_en.png';
import flagOth from '../../images/flag_oth.png';
import flagSp from '../../images/flag_sp.png';
import flagPt from '../../images/flag_portu.png';
import flagDe from '../../images/flag_de.png';
import flagIt from '../../images/flag_it.png';

import './styles.css';

type PropsT = {
    card: GalleryCardT;
}

const mapLangEnumToIcon = {
    [LangEnum.EN]: flagEn,
    [LangEnum.RU]: flagRu,
    [LangEnum.SP]: flagSp,
    [LangEnum.PT]: flagPt,
    [LangEnum.DE]: flagDe,
    [LangEnum.IT]: flagIt,
    [LangEnum.OTH]: flagOth,
}

const GalleryCard: FC<PropsT> = ({ card }) => {
    const { edhRank, imageUrl, name, id, setName, keywords, lang, isFoil, isEtched, number, ruName, promoTypes, set } = card.card;
    const meta = card.meta;

    const dealKey = buildCardThesaurusKey(card.card)
    const inDealsQyantity = useSelector(s.addedInDealsQuantity);
    const thisCardInDeals = inDealsQyantity[dealKey];

    const cardCollections: Array<string> = [];
    forEach(entries(meta), ([, usersMetas]) => {
        forEach(usersMetas, (singleUserMeta) => {
            cardCollections.push(...singleUserMeta.collections)
        })
    });
    
    const calculatedPrice = calculatePrice(card);

    if (set === 'c17' && number === 35) {
        console.log(meta)
    }
    const data = map(meta, (metaItem) => {
        return {
            condition: metaItem![0].condition,
            quantity: metaItem![0].quantity,
            price: `${calculatedPrice} ₽`,
            tradable: metaItem![0].tradable,
            id: card.card.id,
            cardCode: metaItem![0].key
        }
    });

    const columns = [
        {
            id: 'condition',
            name: 'Condition'
        },
        {
            id: 'quantity',
            name: 'Quantity',
            template: (params: typeof data[0]) => {
                const inDeal = thisCardInDeals ? thisCardInDeals[params.condition] || 0 : 0;
                return `${params.quantity - inDeal}`
            }
        },
        {
            id: 'price',
            name: 'Price'
        },
        {
            id: 'action',
            name: 'To trade',
            width: 50,
            align: 'right',
            template: (params: typeof data[0]) => {
                const inDeal = thisCardInDeals ? thisCardInDeals[params.condition] || 0 : 0;
                const isAvalaible = inDeal < params.quantity;
                return (
                    <TradeCell { ...params } avalaible={ isAvalaible } />
                )
            }
        }
    ];

    const renderBinders = () => {
        const binders = compact(uniq(cardCollections)).join(', ');
        return <Text variant='caption-2'>{ binders }</Text>
    };

    return (
        <>
            <Col s="12" m="4" l='3' key={id}>
                <Card type='container' theme='normal' view='raised'  className='box'>
                    <div className='card'>
                        
                        <img src={imageUrl} style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                        }} />
                        <img src={ mapLangEnumToIcon[lang] } className='flagIcon' />
                        <Text className='textBadge' style={{
                                backgroundImage: !isEtched && !isFoil ? 'none' : `url(${foilCover})`,
                        }}>
                                {isEtched ? 'etched' : isFoil ? 'foil' : ''}
                            </Text>
                    </div>
                    <Row space={5}>
                        <Col>
                            <Text variant='subheader-3'>{ lang === LangEnum.RU && ruName ? ruName : name}</Text>
                        </Col>
                    </Row>
                    <Row space={5}>
                        <Col>
                            <Text variant='body-1'>
                                {setName}
                            </Text>
                            <Text>
                                {` #${number}`}
                            </Text>
                        </Col>
                    </Row>
                    {
                        (keywords.length > 0 || promoTypes.length > 0) && (
                            <Row space={1}>
                                <Col>
                                    {
                                        keywords.map((item, i) => <Label key={item + i} size='xs' className='label' theme="info">{item}</Label>)
                                    }
                                    {
                                        promoTypes.map((item, i) => <Label key={item + i} size='xs' className='label' theme="warning">{item}</Label>)
                                    }
                                </Col>
                            </Row>
                        )
                    }
                    <Row space={1} className='detailsRow'>
                        <Col s='5'>
                            {
                                edhRank < 300 && (
                                    <Text>
                                        {`EDHREC rank: ${edhRank}`}
                                    </Text>
                                )
                            }
                        </Col>
                    </Row>
                    <Row space={5}>
                        <Col>
                            <>
                                <Text variant='caption-2'>Collections: </Text>
                                { renderBinders() }
                            </>
                        </Col>
                    </Row>
                    <Table data={ data} columns={ columns } />
                </Card>
            </Col>
        </>
    );
};

export default GalleryCard;
