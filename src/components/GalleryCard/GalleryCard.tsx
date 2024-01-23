import React, { type FC } from 'react';
import { CardT } from '../../models';
import { Row, Col, Card, Text, Label } from '@gravity-ui/uikit';
import { tunePrice } from '../../utils/tune-price';
import foilCover from '../../images/foil-cover.png';
import { CopyButton } from '../CopyButton/CopyButton';

import './styles.css';

type PropsT = {
    card: CardT;
    handleCardClick: (id: string) => void;
}

const GalleryCard: FC<PropsT> = ({ card, handleCardClick }) => {
    const { edhRank, imageUrl, name, id, setName, types, keywords, lang, isFoil, isEtched, rarity, quantity, number } = card;
    const calculatedPrice = tunePrice(card);

    return (
        <>
            <Col s="12" m="4" l='3' key={id}>
                <Card type='container' theme='normal' view='raised'  className='box'>
                    <div className='card'>
                        <CopyButton id={ id } onClick={() => handleCardClick(id)} className='cardCopyButton' />
                        <img src={imageUrl} style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                        }} />
                    </div>
                    <Row space={5}>
                        <Col>
                            <Text variant='subheader-3'>{name}</Text>
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
                    <Row space={1}>
                        <Col>
                            {
                                types.map((item, i) => <Label key={item + i} className='label' theme="normal">{item}</Label>)
                            }
                            {
                                keywords.map((item, i) => <Label key={item + i} size='xs' className='label' theme="info">{item}</Label>)
                            }
                        </Col>
                    </Row>
                    <Row space={1} className='detailsRow'>
                        <Col s='1'>{lang}</Col>
                        <Col s='3'>
                            <Text style={{
                                backgroundImage: isFoil ? `url(${foilCover})` : 'none',
                                backgroundSize: '100%',
                                padding: '4px',
                            }}>
                                {isEtched ? 'etched' : isFoil ? 'foil' : 'non-foil'}
                            </Text>
                        </Col>
                        <Col s='3'>{rarity}</Col>
                        <Col s='5'>
                            {
                                edhRank < 200 && (
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
                                {`В наличии: ${quantity}`}
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
