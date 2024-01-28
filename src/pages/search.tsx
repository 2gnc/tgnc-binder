import React, { useEffect, useState } from 'react';
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { Text, ThemeProvider } from '@gravity-ui/uikit';

export const queryCards = graphql`
    query {
        cardsIja: allIjaCardsCsv(filter: {}) {
            nodes {
                ...IjaCards
            }
        }
        cardsKaplya: allKaplyaCardsCsv(filter: {}) {
            nodes {
                ...KaplyaCards
            }
        }
        cardsKsenia: allKseniaCardsCsv(filter: {}) {
            nodes {
                ...KseniaCards
            }
        }
        cardsMrCardholder: allMrCardholderCardsCsv(filter: {}) {
            nodes {
                ...MrCardholderCards
            }
        }
        cardsTwoBlueCats: allTwoBlueCatsCardsCsv(filter: {}) {
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

const SearchPage: React.FC<PageProps> = (props) => {
    const [rendered, setIsRendered] = useState(false);
    console.log({ props })
    useEffect(() => {
        setIsRendered(true);
    }, []);

    if (!rendered) return null;

    return (
        <ThemeProvider theme="light">
            <Text variant='display-1'>223332</Text>
        </ThemeProvider>
    );
}

export default SearchPage;

export const Head: HeadFC = () => (
    <>
    </>
);
