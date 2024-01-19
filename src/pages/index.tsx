import * as React from "react"
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import Table from '../components/Table';

import './index.css';

export const queryMulticolor = graphql`
  query {
    tokens: allCardsCsv(filter: {Is_token: {eq: "true"}}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Type
        Is_land
        Number
      }
    }
    lands: allCardsCsv(filter: {Colors: {eq: ""}, Is_land: {eq: "true"}}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Type
        Is_land
        Number
      }
    }
    colorless: allCardsCsv(filter: {Colors: {eq: ""}, Is_token: {eq: "false"}, Is_land: {eq: "false"}}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    red: allCardsCsv(filter: {Colors: {eq: "R"}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    black: allCardsCsv(filter: {Colors: {eq: "B"}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    white: allCardsCsv(filter: {Colors: {eq: "W"}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    green: allCardsCsv(filter: {Colors: {eq: "G"}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    blue: allCardsCsv(filter: {Colors: {eq: "U"}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
    multi: allCardsCsv(filter: {Colors: {nin: ["R", "B", "W", "U", "G", ""]}, Is_token: {eq: "false"},}, sort: {Name: ASC}) {
      nodes {
        Qtty
        Name
        Set
        Image
        Price1
        Price2
        Price3
        Price4
        Collection
        Is_foil
        Keywords
        Lang
        Artist
        EDHREC
        Rarity
        id
        Frame
        List
        Colors
        Number
      }
    }
  }
`;

const IndexPage: React.FC<PageProps> = ({ data }) => {
  const cards = data.multi.nodes;
  const cardsColorless = data.colorless.nodes;
  const cardsLands = data.lands.nodes;
  const cardsRed = data.red.nodes;
  const cardsBlack = data.black.nodes;
  const cardsGreen = data.green.nodes;
  const cardsWhite = data.white.nodes;
  const cardsBlue = data.blue.nodes;
  const cardsTokens = data.tokens.nodes;

  return (
    <>
      <h1>Binder</h1>
      <Table header="Многоцветные" cards={cards} />
      <Table header="Бесцветные" cards={cardsColorless} />
      <Table header="Земли" cards={cardsLands} />
      <Table header="Red" cards={cardsRed} />
      <Table header="Black" cards={cardsBlack} />
      <Table header="White" cards={cardsWhite} />
      <Table header="Green" cards={cardsGreen} />
      <Table header="Blue" cards={cardsBlue} />
      <Table header="Tokens" cards={cardsTokens} />
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Binder</title>
