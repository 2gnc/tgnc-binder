import React, { type FC } from 'react';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import filter from 'lodash/filter';
import isNil from 'lodash/isNil';
import uniq from 'lodash/uniq';
import { useSelector, useDispatch } from 'react-redux';
import { GalleryCardT, LangEnum } from '../../models';
import { Row, Col, Card, Text, Label, Table } from '@gravity-ui/uikit';
import { calculatePrice } from '../../utils/tune-price';
import { CopyButton } from '../CopyButton/CopyButton';
import foilCover from '../../images/foil-cover.png';
import flagRu from '../../images/flag_ru.png';
import flagEn from '../../images/flag_en.png';
import flagOth from '../../images/flag_oth.png';
import flagSp from '../../images/flag_sp.png';
import flagPt from '../../images/flag_portu.png';
import flagDe from '../../images/flag_de.png';
import flagIt from '../../images/flag_it.png';
import { selectors as s } from '../../state/gallery';
import { actions as a } from '../../state/trade';

import './styles.css';

type PropsT = {
    card: GalleryCardT;
}

const mapLangEnumToIcon = {
    [LangEnum.EN]: flagEn,
    [LangEnum.RU]: flagRu,
    [LangEnum.OTH]: flagOth,
    [LangEnum.SP]: flagSp,
    [LangEnum.PT]: flagPt,
    [LangEnum.DE]: flagDe,
    [LangEnum.IT]: flagIt,
}

const GalleryCard: FC<PropsT> = ({ card }) => {
    const { edhRank, imageUrl, name, id, setName, keywords, lang, isFoil, isEtched, number, ruName, promoTypes } = card.card;
    const meta = card.meta;
    const owner = useSelector(s.owner);
    
    const cardCollections = flatMap(map(meta, (metaItem) => {
        return metaItem?.collections
    }));
    
    const calculatedPrice = calculatePrice(card);
    const dispatch = useDispatch();

    const renderMeta = () => {

        const columns = [
            {
                id: 'condition',
                name: 'Condition'
            },
            {
                id: 'quantity',
                name: 'Quantity'
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
                    const onCardClick = () => {
                        if (!owner) return;
                
                        dispatch(a.addCardToDeal({
                            owner,
                            cardCode: params.key,
                        }));

                        toaster.add({
                            name: id,
                            title: 'Added to exchange',
                            autoHiding: 1000,
                            type: 'success',
                            content: name
                        });
                    };
                    if (!params.tradable) {
                        return (
                            <div className='cardCopyBlock'>N/A</div>
                        );
                    }
                    return (
                        <div className='cardCopyBlock'>
                            <CopyButton id={ id } onClick={ onCardClick } className='cardCopyButton' />
                        </div>
                    );
                }
            }
        ];

        const data = map(meta, (metaItem) => {
            return {
                condition: metaItem!.condition,
                quantity: metaItem!.quantity,
                price: `${calculatedPrice} ₽`,
                tradable: metaItem!.tradable,
                id: card.card.id,
                key: metaItem!.key
            }
        });

        return <Table data={ data} columns={ columns } />
    }

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
                                {
                                    map(cardCollections, (collection) => <Text key={ collection } variant='caption-2'>{ collection }</Text>)
                                }
                            </>
                        </Col>
                    </Row>
                    { renderMeta() }
                </Card>
            </Col>
        </>
    );
};

export default GalleryCard;
