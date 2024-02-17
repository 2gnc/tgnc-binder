import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@gravity-ui/uikit';
import { CardThesaurusItemT } from '../../../../../models';
import { selectors as cardsS} from '../../../../../state/cards';

type PropsT = {
    shouldSkip?: boolean;
    card: CardThesaurusItemT;
    
};

export const SetCell: FC<PropsT> = ({ shouldSkip, card }) => {
    const { sets } = useSelector(cardsS.cardsThesaurus);

    if (shouldSkip) {
        return ' ';
    }
    
    const set = card.isToken ? card.setParent :  card.set;
    const imgUrl = sets[set]?.imageUri;
    
    return (
        <Flex direction='column' justifyContent='center' alignItems='center'>
            { imgUrl && <img src={ imgUrl } width={22} height={22} />  }
            <Text>{ set?.toUpperCase() }</Text>
        </Flex>
    )
}
