import max from 'lodash/max';
import isNan from 'lodash/isNaN';

export type PriceSettingsT = {
    isFoil: boolean;
    isRu: boolean;
    isRare: boolean;
    isMyphic: boolean;
    tcgFoil: number;
    tcgNonFoil: number;
    cardMarketFoil: number;
    cardMarketNonFoil: number;
}
export function tunePrice({ isFoil, isRare, isMyphic, isRu, tcgFoil, tcgNonFoil, cardMarketFoil, cardMarketNonFoil }: PriceSettingsT): number {
    const USD = 90;
    const EUR = 100;

    const numTcgFoil = isNan(tcgFoil) ? 0 : tcgFoil ;
    const numTcgNonFoil = isNan(tcgNonFoil) ? 0 : tcgNonFoil;
    const numCardMarketFoil = isNan(cardMarketFoil) ? 0 : cardMarketFoil;
    const numCardMarketNonFoil = isNan(cardMarketNonFoil) ? 0 : cardMarketNonFoil;

    const tgcPrice = Math.round(USD * (isFoil ? numTcgFoil : numTcgNonFoil));
    const cardMarketPrice = Math.round(EUR * (isFoil ? numCardMarketFoil : numCardMarketNonFoil));

    let maxPrice = max([tgcPrice, cardMarketPrice]) || cardMarketPrice;

    if (maxPrice < 10) {
        maxPrice = 10;
      }

    if (maxPrice < 50 && isRare) {
    maxPrice = 50;
    }

    if (maxPrice < 80 && isMyphic) {
    maxPrice = 80;
    }

    if (isFoil && isRu) {
    maxPrice = maxPrice * 2;
    }

    return maxPrice;
}
