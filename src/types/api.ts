/**
 * Types for the POST /lookup API contract.
 * Defined by the PRD (pocket-pull-client issue #3).
 */

type LookupRequest = {
  setCode: string;
  collectorNumber: string;
};

type PriceRange = {
  market: number | null;
  low: number | null;
  mid: number | null;
  high: number | null;
  directLow: number | null;
};

type PrintVariantKey =
  | "normal"
  | "holofoil"
  | "reverseHolofoil"
  | "1stEditionHolofoil"
  | "1stEditionNormal";

type LookupResponse = {
  cardName: string;
  setName: string;
  imageURL: string;
  tcgplayerURL: string;
  prices: Partial<Record<PrintVariantKey, PriceRange>>;
};

type LookupErrorResponse = {
  error: string;
  message: string;
};

export type {
  LookupRequest,
  LookupResponse,
  LookupErrorResponse,
  PriceRange,
  PrintVariantKey,
};
