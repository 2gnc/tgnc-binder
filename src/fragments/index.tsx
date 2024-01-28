import { graphql } from "gatsby";

export const IjaCardsQuery = graphql`
    fragment IjaCards on IjaCardsCsv {
        set
        quantity
        name
        set_name
        image_url
        price_usd
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_list
        frame
        is_foil
        keywords
        lang
        artist
        edhrec_rank
        rarity
        id
        colors
        types
        condition
        number
        promo_types
    }
`

export const KaplyaCardsQuery = graphql`
    fragment KaplyaCards on KaplyaCardsCsv {
        set
        quantity
        name
        set_name
        image_url
        price_usd
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_list
        frame
        is_foil
        keywords
        lang
        artist
        edhrec_rank
        rarity
        id
        colors
        types
        condition
        number
        promo_types
    }
`

export const KseniaCardsQuery = graphql`
    fragment KseniaCards on KseniaCardsCsv {
        set
        quantity
        name
        set_name
        image_url
        price_usd
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_list
        frame
        is_foil
        keywords
        lang
        artist
        edhrec_rank
        rarity
        id
        colors
        types
        condition
        number
        promo_types
    }
`

export const MrCardholderCardsQuery = graphql`
    fragment MrCardholderCards on MrCardholderCardsCsv {
        set
        quantity
        name
        set_name
        image_url
        price_usd
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_list
        frame
        is_foil
        keywords
        lang
        artist
        edhrec_rank
        rarity
        id
        colors
        types
        condition
        number
        promo_types
    }
`

export const TwoBlueCatsCardsQuery = graphql`
    fragment TwoBlueCatsCards on TwoBlueCatsCardsCsv {
        set
        quantity
        name
        set_name
        image_url
        price_usd
        price_usd_foil
        price_usd_etched
        price_eur
        price_eur_foil
        price_eur_etched
        collection
        is_list
        frame
        is_foil
        keywords
        lang
        artist
        edhrec_rank
        rarity
        id
        colors
        types
        condition
        number
        promo_types
    }
`
