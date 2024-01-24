import * as React from "react"
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { parseRawCardsResponse } from "../../utils/parse-raw-cards-response";
import TradeTable from '../../components/TradeTable/TradeTable';

export const queryMulticolor = graphql`
  query {
    allIjaCardsCsv(sort: {name: ASC}) {
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
  const { cards } = parseRawCardsResponse(data.allIjaCardsCsv.nodes);
  return <TradeTable cards={ cards } />
}

export default IndexPage;

export const Head: HeadFC = () => <title>Trade Theme</title>
