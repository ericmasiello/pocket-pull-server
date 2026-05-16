# PocketPull Proxy

The server-side pricing proxy for the PocketPull iOS app. Receives card identifiers from the app, resolves them against the Pokémon TCG API, and returns structured pricing data. Keeps API keys off the client.

## Language

**Card Identifier**:
A pair of set code and collector number that uniquely identifies a Pokémon trading card within a set.
_Avoid_: card ID, product ID, SKU

**Set Code**:
The short identifier for a Pokémon TCG set (e.g., `sv1` for Scarlet & Violet base set). Matches the Pokémon TCG API's `set.id` field.
_Avoid_: set ID, set abbreviation, expansion code

**Collector Number**:
The printed number on a card within its set (e.g., `025`). Combined with set code, uniquely identifies a card.
_Avoid_: card number, print number

**Print Variant**:
The physical printing style of a card that affects its market value. Common variants include normal, holofoil, and reverse holofoil. A single card can have multiple print variants, each with different pricing.
_Avoid_: version, edition, type, finish

**Price Range**:
The set of market, low, mid, high, and direct-low price points for a card at a given print variant. All prices reflect Near Mint condition.
_Avoid_: price breakdown, pricing data

**Lookup**:
The single operation this proxy performs: accepting a card identifier and returning pricing data.
_Avoid_: search, query, fetch

## Relationships

- A **Card Identifier** is a pair of one **Set Code** and one **Collector Number**
- A **Lookup** accepts one **Card Identifier** and returns one **Price Range** per **Print Variant**
- A card has one or more **Print Variants** (e.g., normal, holofoil, reverse holofoil)

## Example dialogue

> **Dev:** "When the iOS app sends a **Lookup**, what happens if the **Card Identifier** matches multiple cards?"
> **Domain expert:** "A **Set Code** + **Collector Number** pair should resolve to exactly one card. If the Pokémon TCG API returns multiple results, that's a data quality issue — return the first match and log a warning."

## Flagged ambiguities

- "TCGplayer API" was used in the original issue to mean the pricing data source. Resolved: the actual data source is the **Pokémon TCG API** (api.pokemontcg.io), which embeds TCGplayer pricing in its responses. See ADR-0001.
