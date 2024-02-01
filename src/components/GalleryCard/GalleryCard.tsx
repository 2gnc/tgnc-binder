import React, { type FC } from 'react';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import { useSelector, useDispatch } from 'react-redux';
import { CardT, LangEnum } from '../../models';
import { Row, Col, Card, Text, Label } from '@gravity-ui/uikit';
import { tunePrice } from '../../utils/tune-price';
import { CopyButton } from '../CopyButton/CopyButton';
import foilCover from '../../images/foil-cover.png';
import flagRu from '../../images/flag_ru.png';
import flagEn from '../../images/flag_en.png';
import flagOth from '../../images/flag_oth.png';
import flagSp from '../../images/flag_sp.png';
import flagPt from '../../images/flag_portu.png';
import flagDe from '../../images/flag_de.png';
import flagIt from '../../images/flag_it.png';
import { selectors as s, actions as a } from '../../state/gallery';

import './styles.css';

type PropsT = {
    card: CardT;
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
    const { edhRank, imageUrl, name, id, setName, keywords, lang, isFoil, isEtched, condition, quantity, number, ruName, promoTypes } = card;
    const calculatedPrice = tunePrice(card);
    const dispatch = useDispatch();

    const onCardClick = () => {
        dispatch(a.addCardForTrade(id));
        toaster.add({
            name: id,
            title: 'Added to exchange',
            autoHiding: 1000,
            type: 'success',
            content: name
        });
    }

    return (
        <>
            <Col s="12" m="4" l='3' key={id}>
                <Card type='container' theme='normal' view='raised'  className='box'>
                    <div className='card'>
                        <CopyButton id={ id } onClick={ onCardClick } className='cardCopyButton' />
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
                            
                        </Col>
                    </Row>
                    <Row space={5} className='priceRow'>
                        <Col>
                            <Text variant='body-1'>
                                { condition }
                            </Text>
                        </Col>
                        <Col>
                            <Text variant='body-1'>
                                {`в наличии: ${quantity}`}
                            </Text>
                        </Col>
                        <Col className='priceCol'>
                            <Text variant='subheader-2'>{`${calculatedPrice} руб.`}</Text>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </>
    );
};

export default GalleryCard;
