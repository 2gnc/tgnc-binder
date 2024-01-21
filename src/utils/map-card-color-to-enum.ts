import { ColorsEnum } from '../models';

export function mapCardColorToEnum(cardColor: string): Array<ColorsEnum> {
    const colors = cardColor.split(',');
    const enumColors: Array<ColorsEnum> = [];

    colors.forEach((color) => {
        let currentColor;
        switch(color) {
            case 'R':
                currentColor = ColorsEnum.RED;
                break;
            case 'W':
                currentColor = ColorsEnum.WHITE;
                break;
            case 'B':
                currentColor = ColorsEnum.BLACK;
                break;
            case 'U':
                currentColor = ColorsEnum.BLUE;
                break;
            case 'G':
                currentColor = ColorsEnum.GREEN;
                break;
            default:
                currentColor = ColorsEnum.COLORLESS;
        }
        enumColors.push(currentColor);
    })
    return enumColors;
}
