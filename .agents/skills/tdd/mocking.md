# When to Mock

Mock at **system boundaries** only:

- External APIs (Pokémon TCG API, etc.)
- Databases (sometimes - prefer test DB or in-memory store)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own modules
- Internal collaborators
- Anything you control

## Designing for Mockability in TypeScript

At system boundaries, design interfaces that are easy to substitute:

**1. Use interface-based dependency injection**

Define a type for external dependencies and inject conforming implementations:

```typescript
// Easy to mock — interface defines the seam
interface PricingClient {
  getCardPrices(cardId: CardIdentifier): Promise<PriceRange[]>;
}

async function processLookup(
  cardId: CardIdentifier,
  client: PricingClient
): Promise<PriceRange[]> {
  return client.getCardPrices(cardId);
}

// In tests — provide a stub conforming to the interface
const stubClient: PricingClient = {
  async getCardPrices() {
    return [{ variant: "holofoil", market: 12.5, low: 10.0, mid: 11.0, high: 15.0 }];
  },
};
```

```typescript
// Hard to mock — creates its own dependency internally
async function processLookup(cardId: CardIdentifier): Promise<PriceRange[]> {
  const response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`);
  const data = await response.json();
  return data.prices;
}
```

**2. Prefer specific interfaces over generic fetchers**

Create specific methods for each external operation instead of one generic function:

```typescript
// GOOD: Each method is independently stubbable
interface CardApi {
  getCard(id: string): Promise<Card>;
  getCardsBySet(setCode: string): Promise<Card[]>;
  getSetDetails(setCode: string): Promise<Set>;
}

// BAD: Stubbing requires conditional logic inside the stub
interface GenericApi {
  fetch<T>(endpoint: string): Promise<T>;
}
```

The specific-interface approach means:
- Each stub returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Compile-time safety per endpoint
