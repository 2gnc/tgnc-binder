import intersection from 'lodash/intersection';
import { FramePerticularitiesEnum } from '../models';

export function buildPeculiarities(isFoil: boolean, frameData: string): string {

    const frameModifiers = Object.values(FramePerticularitiesEnum);

    const framePeculiarities = frameData.split(',');

    const modifiers = intersection(framePeculiarities, frameModifiers);

    if (isFoil) {
        modifiers.push('foil');
    }

    return modifiers.join(', ');
}
