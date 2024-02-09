import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const gallery = (state: RootState) => state.gallery;
const galleryOwner = createSelector([gallery], (gallery) => gallery.owner);

export const selectors = {
    galleryOwner,
};
