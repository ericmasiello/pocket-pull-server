# API Prototype

Spin up a **minimal Hono server with several radically different API designs**, switchable via route prefix. The user hits each variant with `curl` or a REST client, picks one (or steals bits from each), then throws the rest away.

If the question is about logic/state rather than what the API should look like — wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this endpoint look like?"
- "I want to see a few options for the response shape before committing."
- "Try a different API design for the lookup endpoint."
- Any time the user would otherwise spend a day picking between three vague API shapes in their head.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise — cap there.

Write down the plan in a comment at the top of the prototype file:

> "Three variants of the lookup API, switchable via route prefix, running on a standalone Hono server."

### 2. Generate radically different variants

Draft each variant. Hold each one to:

- The API's purpose and the data it has access to.
- The project's conventions (error shapes, response envelopes, naming).
- A clear naming convention, e.g. `/v1/...`, `/v2/...`, `/v3/...` as route groups.

Variants must be **structurally different** — different URL shape, different response structure, different resource modeling, not just different field names. Three slightly-tweaked JSON responses isn't an API prototype, it's wallpaper.

### 3. Wire them together

Create a standalone Hono app that mounts all variants:

```typescript
// Prototype — three variants of the lookup API
// Run: npx tsx src/prototype-api.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

// Variant A: Flat response, single endpoint
app.get("/v1/cards/:setCode/:number/prices", (c) => {
  return c.json({
    setCode: c.req.param("setCode"),
    collectorNumber: c.req.param("number"),
    prices: { normal: { market: 1.25, low: 0.99, mid: 1.15, high: 2.00 } },
  });
});

// Variant B: Nested resource, print variants as sub-resources
app.get("/v2/cards/:setCode/:number", (c) => {
  return c.json({
    card: { setCode: c.req.param("setCode"), collectorNumber: c.req.param("number") },
    printVariants: [
      { variant: "normal", priceRange: { market: 1.25, low: 0.99, mid: 1.15, high: 2.00 } },
      { variant: "holofoil", priceRange: { market: 12.50, low: 10.0, mid: 11.0, high: 15.0 } },
    ],
  });
});

// Variant C: Batch lookup, POST with array of card identifiers
app.post("/v3/lookup", async (c) => {
  const { cards } = await c.req.json();
  return c.json({
    results: cards.map((card: any) => ({
      ...card,
      prices: [{ variant: "normal", market: 1.25, low: 0.99 }],
    })),
  });
});

// Index — shows all available variants
app.get("/", (c) => {
  return c.json({
    prototype: "lookup API",
    variants: {
      v1: "GET /v1/cards/:setCode/:number/prices — flat response",
      v2: "GET /v2/cards/:setCode/:number — nested with print variants",
      v3: "POST /v3/lookup — batch lookup",
    },
  });
});

serve({ fetch: app.fetch, port: 3333 }, (info) => {
  console.log(`Prototype running at http://localhost:${info.port}`);
  console.log("Try: curl http://localhost:3333/");
});
```

### 4. Make it runnable immediately

Add a run command at the top of the file. The user should be able to do:

```bash
npx tsx src/prototype-api.ts
```

Then hit the index route to see all variants and how to exercise them.

### 5. Hand it over

Tell the user the prototype is running. The interesting feedback is usually **"I want the response shape from V2 with the batch capability of V3"** — that's the actual design they want.

### 6. Capture the answer and clean up

Once a variant has won, write down which one and why (commit message, ADR, issue, or a `NOTES.md` next to the prototype). Then delete the prototype file — don't leave it in the repo.

## Anti-patterns

- **Variants that differ only in field names.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Wiring variants to real external APIs.** Return hardcoded mock data. The question is "what should this API look like", not "does the upstream API work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no validation, no error handling). Rewrite it properly when you fold it in.
