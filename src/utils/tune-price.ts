import max from 'lodash/max';
import { CardT, RarityEnum, LangEnum, GalleryCardT } from '../models';

export function tunePrice(card: CardT): number {
    const USD = 90;
    const EUR = 100;

    const { isFoil, usdFoil, isEtched, usdEtched, usdNonFoil, eurEtched, eurFoil, eurNonFoil, rarity, lang } = card;

    const tgcPrice = Math.round(USD * (isFoil ? usdFoil : isEtched ? usdEtched: usdNonFoil));
    const cardMarketPrice = Math.round(EUR * (isFoil ? eurFoil : isEtched ? eurEtched : eurNonFoil));

    let maxPrice = max([tgcPrice, cardMarketPrice]) || cardMarketPrice;

    if (maxPrice < 10) {
        maxPrice = 10;
      }

    if (maxPrice < 50 && rarity === RarityEnum.RARE) {
        maxPrice = 50;
    }

    if (maxPrice < 80 && rarity === RarityEnum.MYTHIC) {
        maxPrice = 80;
    }

    if (isFoil && lang === LangEnum.RU) {
        maxPrice = maxPrice * 2;
    }

    return maxPrice;
}

export function calculatePrice(card: GalleryCardT): number {
    const USD = 90;
    const EUR = 100;

    const { isFoil, usdFoil, isEtched, usdEtched, usdNonFoil, eurEtched, eurFoil, eurNonFoil, rarity, lang } = card.card;

    const tgcPrice = Math.round(USD * (isFoil ? usdFoil : isEtched ? usdEtched: usdNonFoil));
    const cardMarketPrice = Math.round(EUR * (isFoil ? eurFoil : isEtched ? eurEtched : eurNonFoil));

    let maxPrice = max([tgcPrice, cardMarketPrice]) || cardMarketPrice;

    if (maxPrice < 10) {
        maxPrice = 10;
      }

    if (maxPrice < 50 && rarity === RarityEnum.RARE) {
        maxPrice = 50;
    }

    if (maxPrice < 80 && rarity === RarityEnum.MYTHIC) {
        maxPrice = 80;
    }

    if (isFoil && lang === LangEnum.RU) {
        maxPrice = maxPrice * 2;
    }

    return maxPrice;
}
