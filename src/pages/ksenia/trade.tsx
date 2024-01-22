import * as React from "react"
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { parseRawCardsResponse } from "../../utils/parse-raw-cards-response";

import TradeThemeTable from '../../components/TradeThemeTable';

import { CardT, ColorsEnum } from "../../models";

export const queryMulticolor = graphql`
  query {
    allKseniaCardsCsv(sort: {name: ASC}) {
      nodes {
        artist
        set_name
        quantity
        name
        set
        image_url
        price_usd
        price_usd_foil
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_foil
        keywords
        lang
        edhrec_rank
        rarity
        id
        is_list
        frame
        colors
        condition
        types
        number
      }
    }
  }
`;

const IndexPage: React.FC<PageProps> = ({ data }) => {
  console.log(data.allKseniaCardsCsv.nodes)
  const { cards } = parseRawCardsResponse(data.allKseniaCardsCsv.nodes);

  const byColors: Record<string, Array<CardT>> = {
    multicolor: [],
    colorless: [],
    lands: [],
    tokens: [],
    white: [],
    blue: [],
    black: [],
    red: [],
    green: []
  };
  cards.forEach(card => {
    if (!card.collections?.includes('binder')) {
      return;
    }

    if (card.colors.length > 1) {
      byColors.multicolor.push(card);
      return;
    }
    if (
      card.colors.includes(ColorsEnum.COLORLESS)
      && !card.isLand
      && !card.isToken
    ) {
      byColors.colorless.push(card);
      return;
    }
    if (
      card.colors.includes(ColorsEnum.COLORLESS)
      && card.isLand
    ) {
      byColors.lands.push(card);
      return;
    }
    if (
      card.colors.includes(ColorsEnum.COLORLESS)
      && card.isToken
    ) {
      byColors.tokens.push(card);
      return;
    }

    if (card.colors.length === 1) {
      switch(card.colors[0]) {
        case ColorsEnum.WHITE:
          byColors.white.push(card);
          return;
        case ColorsEnum.BLUE:
          byColors.blue.push(card);
          return;
        case ColorsEnum.BLACK:
          byColors.black.push(card);
          return;
        case ColorsEnum.RED:
          byColors.red.push(card);
          return;
        default:
          byColors.green.push(card);
          return;
      }
    }
  });

  return (
    <>
      <h1>Binder</h1>
      <TradeThemeTable header="Многоцветные" cards={byColors.multicolor} />
      <TradeThemeTable header="Бесцветные" cards={byColors.colorless} />
      <TradeThemeTable header="Земли" cards={byColors.lands} />
      <TradeThemeTable header="Red" cards={byColors.red} />
      <TradeThemeTable header="Black" cards={byColors.black} />
      <TradeThemeTable header="White" cards={byColors.white} />
      <TradeThemeTable header="Green" cards={byColors.green} />
      <TradeThemeTable header="Blue" cards={byColors.blue} />
      <TradeThemeTable header="Tokens" cards={byColors.tokens} />
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Binder</title>
