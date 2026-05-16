/**
 * Subset of the Pokémon TCG API response relevant to price lookup.
 * Full schema: https://docs.pokemontcg.io/api-reference/cards/card-object
 */

type PokemonTcgPriceData = {
  low: number | null;
  mid: number | null;
  high: number | null;
  market: number | null;
  directLow: number | null;
};

type PokemonTcgTcgplayer = {
  url: string;
  updatedAt: string;
  prices: {
    normal?: PokemonTcgPriceData;
    holofoil?: PokemonTcgPriceData;
    reverseHolofoil?: PokemonTcgPriceData;
    "1stEditionHolofoil"?: PokemonTcgPriceData;
    "1stEditionNormal"?: PokemonTcgPriceData;
  };
};

type PokemonTcgCardImage = {
  small: string;
  large: string;
};

type PokemonTcgSet = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  updatedAt: string;
};

type PokemonTcgCard = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  number: string;
  set: PokemonTcgSet;
  images: PokemonTcgCardImage;
  tcgplayer?: PokemonTcgTcgplayer;
};

type PokemonTcgSearchResponse = {
  data: PokemonTcgCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

export type {
  PokemonTcgCard,
  PokemonTcgSearchResponse,
  PokemonTcgTcgplayer,
  PokemonTcgPriceData,
  PokemonTcgCardImage,
  PokemonTcgSet,
};
