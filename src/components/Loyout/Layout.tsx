import React, { memo } from 'react';
import { HeadFC, PageProps, useStaticQuery } from 'gatsby';
import { useSelector, useDispatch } from 'react-redux';
import { graphql } from 'gatsby';
import { actions as a } from '../../state/cards';
import { selectors as s } from '../../state/cards/selectors';

interface LayoutProptT {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProptT> = memo(({ children }) => {
    const dispatch = useDispatch();
    const data = useStaticQuery(queryCards);
    const rawSets = data['sets'].nodes;
    Object.entries(data).forEach((item) => {
        if (item[0] === 'sets') return;
        dispatch(a.popullateCards({
            rawCards: item[1].nodes,
            rawSets,
            owner: item[0],
        }))
    });
    dispatch(a.setIsLoading(true));

    return children;
});

export default Layout;

export const queryCards = graphql`
    query {
        Ija: allIjaCardsCsv(filter: {}) {
            nodes {
                ...IjaCards
            }
        }
        Kaplya: allKaplyaCardsCsv(filter: {}) {
            nodes {
                ...KaplyaCards
            }
        }
        Ksenia: allKseniaCardsCsv(filter: {}) {
            nodes {
                ...KseniaCards
            }
        }
        MrCardholder: allMrCardholderCardsCsv(filter: {}) {
            nodes {
                ...MrCardholderCards
            }
        }
        TwoBlueCats: allTwoBlueCatsCardsCsv(filter: {}) {
            nodes {
                ...TwoBlueCatsCards
            }
        }
        sets: allSetsCsv {
            nodes {
                Name
                Block
                Code
                IconURI
                ParentSetCode
                Type
                id
            }
        }
    }
`;
