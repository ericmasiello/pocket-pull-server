# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("lookup returns prices for valid card identifier", async () => {
  const result = await lookup({ setCode: "sv1", collectorNumber: "025" });
  expect(result.prices).toBeDefined();
  expect(result.prices.length).toBeGreaterThan(0);
  expect(result.prices[0].market).toBeTypeOf("number");
});
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details via a spy
test("lookup calls pricing service fetch", async () => {
  const spy = vi.spyOn(pricingService, "fetch");
  await lookup({ setCode: "sv1", collectorNumber: "025" });
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith("sv1", "025");
});
```

Red flags:

- Mocking/spying internal collaborators
- Testing private functions
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createCard saves to database", async () => {
  await createCard({ name: "Pikachu" });
  const row = await db.query("SELECT * FROM cards WHERE name = ?", ["Pikachu"]);
  expect(row).not.toBeNull();
});

// GOOD: Verifies through interface
test("createCard makes card retrievable", async () => {
  const card = await createCard({ name: "Pikachu" });
  const retrieved = await getCard(card.id);
  expect(retrieved.name).toBe("Pikachu");
});
```
