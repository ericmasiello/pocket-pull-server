# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.

Create the `docs/adr/` directory lazily — only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

That's it. An ADR can be a single paragraph. The value is in recording *that* a decision was made and *why* — not in filling out sections.

## Optional sections

Only include these when they add genuine value. Most ADRs won't need them.

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`) — useful when decisions are revisited
- **Considered Options** — only when the rejected alternatives are worth remembering
- **Consequences** — only when non-obvious downstream effects need to be called out

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.

## When to offer an ADR

All three of these must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will look at the code and wonder "why on earth did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If a decision is easy to reverse, skip it — you'll just reverse it. If it's not surprising, nobody will wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

### What qualifies

- **Architectural shape.** "We're using a Cloudflare Worker as a proxy." "The proxy is stateless and makes no writes."
- **Integration patterns between contexts.** "The iOS app communicates with the proxy via REST; the proxy communicates with the Pokémon TCG API."
- **Technology choices that carry lock-in.** Database, message bus, auth provider, deployment target. Not every library — just the ones that would take a quarter to swap out.
- **Boundary and scope decisions.** "The proxy only returns pricing data; it does not cache or store cards." The explicit no-s are as valuable as the yes-s.
- **Deliberate deviations from the obvious path.** "We use Hono instead of Express because it targets Cloudflare Workers natively." Anything where a reasonable reader would assume the opposite.
- **Constraints not visible in the code.** "We can't use AWS because the iOS app is optimized for Cloudflare's edge network." "Rate limits on the Pokémon TCG API require caching."
- **Rejected alternatives when the rejection is non-obvious.** If you considered calling TCGplayer directly and picked the Pokémon TCG API wrapper for subtle reasons, record it.
