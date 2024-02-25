import React, { memo } from 'react';
import { useStaticQuery } from 'gatsby';
import { useDispatch } from 'react-redux';
import { graphql } from 'gatsby';
import { actions as a } from '../../state/cards';

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
        GragonLeech: allGragonLeechCardsCsv(filter: {}) {
            nodes {
                ...GragonLeechCards
            }
        }
        SadgeBusiness: allSadgeBusinessCardsCsv(filter: {}) {
            nodes {
                ...SadgeBusinessCards
            }
        }
        Kirillgaevoy: allKirillgaevoyCardsCsv(filter: {}) {
            nodes {
                ...KirillgaevoyCards
            }
        }
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
        Tm00ne: allTmOOneCardsCsv(filter: {}) {
            nodes {
                ...TmOOneCards
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
