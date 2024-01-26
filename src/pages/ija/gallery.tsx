import React from 'react';
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";

import Gallery from '../../components/Gallery/Gallery';

export const queryCards = graphql`
    query {
        allIjaCardsCsv(filter: {}) {
            nodes {
                set
                quantity
                name
                set_name
                image_url
                price_usd
                price_usd_foil
                price_usd_etched
                price_eur
                price_eur_foil
                price_eur_etched
                collection
                is_list
                frame
                is_foil
                keywords
                lang
                artist
                edhrec_rank
                rarity
                id
                colors
                types
                condition
                number
                promo_types
            }
        }
    }
`;

const OWNER = { name: 'Ija', contactLink: 'https://telegram.me/ijaijaja' };

const GalleryPage: React.FC<PageProps> = (props) => {
    return (
        <Gallery owner={OWNER} {...props} queryName='allIjaCardsCsv'  />
    );
}

export default GalleryPage;

export const Head: HeadFC = () => (
    <>
        <title>Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </>
);
