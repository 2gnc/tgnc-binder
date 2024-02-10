import React from 'react';
import type { HeadFC, PageProps } from "gatsby";
import { Text } from '@gravity-ui/uikit';
import DataTransport from '../../components/Loyout/Layout';

const SearchPage: React.FC<PageProps> = (props) => {
    return (
        <DataTransport>
            <Text variant='display-1'>search</Text>
        </DataTransport>
    );
}

export default SearchPage;

export const Head: HeadFC = () => (
    <>
        <title>Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </>
);
