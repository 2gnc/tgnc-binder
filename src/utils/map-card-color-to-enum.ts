import { ColorEnum } from '../models';

export function mapCardColorToEnum(cardColor: string): Array<ColorEnum> {
    const colors = cardColor.split(',');
    const enumColors: Array<ColorEnum> = [];

    colors.forEach((color) => {
        let currentColor;
        switch(color) {
            case 'R':
                currentColor = ColorEnum.RED;
                break;
            case 'W':
                currentColor = ColorEnum.WHITE;
                break;
            case 'B':
                currentColor = ColorEnum.BLACK;
                break;
            case 'U':
                currentColor = ColorEnum.BLUE;
                break;
            case 'G':
                currentColor = ColorEnum.GREEN;
                break;
            default:
                currentColor = ColorEnum.COLORLESS;
        }
        enumColors.push(currentColor);
    })
    return enumColors;
}
