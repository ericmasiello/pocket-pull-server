import type { PokemonTcgCard, PokemonTcgSearchResponse } from "../types/pokemon-tcg";

const POKEMON_TCG_API_BASE = "https://api.pokemontcg.io/v2";

export async function findCard(
  setCode: string,
  collectorNumber: string,
  apiKey: string,
): Promise<PokemonTcgCard | null> {
  // TODO: implement
  // 1. Build query: GET /v2/cards?q=set.id:{setCode} number:{collectorNumber}
  // 2. Attach API key header: X-Api-Key
  // 3. Parse PokemonTcgSearchResponse
  // 4. Return first matching card, or null if no results
  throw new Error("Not implemented");
}
