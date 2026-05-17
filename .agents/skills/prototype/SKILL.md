---
name: prototype
description: Build a throwaway prototype to flesh out a design before committing to it. Routes between two branches — a runnable script for state/business-logic questions, or a minimal HTTP server for API design questions. Use when the user wants to prototype, sanity-check a data model or state machine, explore API designs, or says "prototype this", "let me play with it", "try a few designs".
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick a branch

Identify which question is being answered — from the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a tiny interactive script that pushes the state machine through cases that are hard to reason about on paper.
- **"What should this API look like?"** → [API.md](API.md). Spin up a minimal Hono server with several radically different API designs, switchable via route prefix.

The two branches produce very different artifacts — getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a utility module → logic; a route handler → API) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Locate the prototype code close to where it will actually be used (next to the module or route it's prototyping for) so context is obvious — but name it so a casual reader can see it's a prototype, not production. For throwaway API routes, obey whatever routing convention the project already uses; don't invent a new top-level structure.
2. **One action to run.** A `pnpm run dev` or `npx tsx prototype.ts` — the user must be able to start it without thinking.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE — wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast and then delete it.
5. **Surface the state.** After every action (logic) or on every variant switch (API), print or return the full relevant state so the user can see what changed.
6. **Delete or absorb when done.** When the prototype has answered its question, either delete it or fold the validated decision into the real code — don't leave it rotting in the repo.

## When done

The _answer_ is the only thing worth keeping from a prototype. Capture it somewhere durable (commit message, ADR, issue, or a `NOTES.md` next to the prototype) along with the question it was answering. If the user is around, that capture is a quick conversation; if not, leave the placeholder so they (or you, on the next pass) can fill in the verdict before deleting the prototype.
