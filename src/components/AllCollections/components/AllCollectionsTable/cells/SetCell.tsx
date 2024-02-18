import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text, ActionTooltip } from '@gravity-ui/uikit';
import { CardThesaurusItemT } from '../../../../../models';
import { selectors as cardsS} from '../../../../../state/cards';

type PropsT = {
    shouldSkip?: boolean;
    card: CardThesaurusItemT;
    isMobile?: boolean;
};

export const SetCell: FC<PropsT> = ({ shouldSkip, card, isMobile = false }) => {
    const { sets } = useSelector(cardsS.cardsThesaurus);

    if (shouldSkip) {
        return ' ';
    }
    
    const set = card.isToken ? card.setParent :  card.set;
    const imgUrl = sets[set]?.imageUri;
    
    const direction = isMobile ? 'row' : 'column';

    if (isMobile) {
        return (
            <ActionTooltip title='' description={ card.setName } className='AllCollectionTable__SetTooltip' >
                <div>
                    { imgUrl && <img src={ imgUrl } width={22} height={22} />  }
                </div>
            </ActionTooltip>
        );
    }

    return (
        <Flex direction={ direction } justifyContent='center' alignItems='center'>
            { imgUrl && <img src={ imgUrl } width={22} height={22} />  }
            <Text>{ set?.toUpperCase() }</Text>
        </Flex>
    )
}
