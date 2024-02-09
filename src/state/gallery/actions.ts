import { PayloadAction } from '@reduxjs/toolkit';
import { OwnerT } from '../../models';

export type SetOwnerActionT = PayloadAction<{
    owner: OwnerT;
}>;

export type GalleryLoadedActionT = PayloadAction<undefined>;
