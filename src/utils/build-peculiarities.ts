import intersection from 'lodash/intersection';

export function buildPeculiarities(isFoil: boolean, frameData: string): string {

    const frameModifiers = [
        'showcase',
        'miracle',
        'extendedart',
        'etched',
        'shatteredglass'
      ];

    const framePeculiarities = frameData.split(',');

    const modifiers = intersection(framePeculiarities, frameModifiers);

    if (isFoil) {
        modifiers.push('foil');
    }

    return modifiers.join(', ');
}
