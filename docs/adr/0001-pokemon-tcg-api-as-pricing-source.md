# Use Pokémon TCG API as pricing source instead of TCGplayer directly

The original issue (#3 in pocket-pull-client) specifies proxying to "TCGplayer's pricing API" with a TCGplayer API key stored as a secret. However, TCGplayer's API uses its own product IDs, not the set code + collector number identifiers that the iOS app extracts via OCR. Additionally, TCGplayer is no longer granting new API access.

The Pokémon TCG API (api.pokemontcg.io) accepts set code + collector number as query parameters and returns card metadata with TCGplayer pricing data already embedded in the response. This means one API call resolves the card and returns pricing, making the worker a true proxy rather than an orchestration layer.

We use the Pokémon TCG API as the sole data source. The secret stored in Cloudflare is a Pokémon TCG API key (free tier), not a TCGplayer key.

A consequence of this decision: the Pokémon TCG API returns pricing per print variant (normal, holofoil, reverse holofoil), not per condition tier (Near Mint, Lightly Played, etc.). All prices reflect Near Mint condition only. The API contract and iOS Results screen use print variants as the pricing dimension instead of condition tiers. Per-condition pricing would require direct TCGplayer API access, which is unavailable.
