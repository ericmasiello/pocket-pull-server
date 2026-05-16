import type { Context } from "hono";
import type { LookupRequest, LookupResponse, LookupErrorResponse } from "../types/api";
import { findCard } from "../services/pokemon-tcg-client";

export async function handleLookup(c: Context<{ Bindings: Env }>): Promise<Response> {
  // TODO: implement
  // 1. Parse and validate request body as LookupRequest
  // 2. Call findCard(setCode, collectorNumber, c.env.POKEMON_TCG_API_KEY)
  // 3. If no card found, return 404 LookupErrorResponse
  // 4. Transform PokemonTcgCard → LookupResponse
  //    - Map card.tcgplayer.prices (keyed by variant) to PriceRange objects
  //    - Only include variants present in the API response
  //    - Use card.images.large as imageURL
  //    - Use card.tcgplayer.url as tcgplayerURL
  // 5. Return JSON response
  throw new Error("Not implemented");
}
