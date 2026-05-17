# Interface Design for Testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them**

   ```typescript
   // Testable — dependency injected via parameter
   async function processLookup(
     cardId: CardIdentifier,
     api: PokemonTcgApi
   ): Promise<PriceRange[]> {
     return api.getCardPrices(cardId);
   }

   // Hard to test — creates its own dependency
   async function processLookup(cardId: CardIdentifier): Promise<PriceRange[]> {
     const api = new PokemonTcgClient(process.env.API_KEY!);
     return api.getCardPrices(cardId);
   }
   ```

2. **Return results, don't produce side effects**

   ```typescript
   // Testable — returns a value
   function formatPriceRange(prices: RawPrices): PriceRange {
     return { market: prices.market, low: prices.low, mid: prices.mid };
   }

   // Hard to test — mutates in place
   function applyPriceRange(response: Response, prices: RawPrices): void {
     response.body = JSON.stringify(prices);
   }
   ```

3. **Small surface area**
   - Fewer functions = fewer tests needed
   - Fewer params = simpler test setup
   - Use TypeScript's optional parameters and defaults to keep the common case simple
