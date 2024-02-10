import React, { useEffect, useState } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { ThemeProvider } from '@gravity-ui/uikit';
import DataTransport from '../components/Loyout/Layout';
import { AllCollections } from '../components/AllCollections/AllCollections';

const AllCollectionsPage: React.FC<PageProps> = (props) => {
    return (
        <DataTransport>
            <ThemeProvider theme="light">
                <AllCollections />
            </ThemeProvider>
        </DataTransport>
    );
}

export default AllCollectionsPage;

export const Head: HeadFC = () => (
    <>
        <title>Search all collections</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </>
);
