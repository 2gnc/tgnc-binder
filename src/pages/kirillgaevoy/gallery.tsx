import React from 'react';
import type { HeadFC, PageProps } from "gatsby";

import Gallery from '../../components/Gallery/Gallery';
import DataTransport from '../../components/Loyout/Layout';

const OWNER = { name: 'Kirillgaevoy', contactLink: 'https://telegram.me/kirillgaevoy' };

const GalleryPage: React.FC<PageProps> = (props) => {
    return (
        <DataTransport>
            <Gallery owner={OWNER} {...props} />
        </DataTransport>
    );
}

export default GalleryPage;

export const Head: HeadFC = () => (
    <>
        <title>Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </>
);
