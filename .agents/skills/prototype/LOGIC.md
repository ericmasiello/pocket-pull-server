# Logic Prototype

A tiny interactive script that lets the user drive a state model by hand. Use this when the question is about **business logic, state transitions, or data shape** — the kind of thing that looks reasonable on paper but only feels wrong once you push it through real cases.

## When this is the right shape

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the interface should look like before writing it."
- Anything where the user wants to **push inputs and watch state change**.

If the question is "what should this API look like" — wrong branch. Use [API.md](API.md).

## Process

### 1. State the question

Before writing code, write down what state model and what question you're prototyping. One paragraph, in a comment at the top of the file. A logic prototype that answers the wrong question is pure waste — make the question explicit so it can be checked later.

### 2. Pick the approach

Since this is a TypeScript/Node project, choose the lightest-weight option that answers the question:

- **Interactive CLI script** (preferred) — a simple `readline`-based loop that accepts commands and prints the current state after each action. Runs with `npx tsx src/prototype.ts`. Best for state machines and data model exploration.
- **Test-as-prototype** — a Vitest test file that runs scenarios and prints intermediate state. Best when the question is "does this sequence of operations produce the right result?"

Match the project's existing conventions — don't introduce new tooling just for the prototype.

### 3. Isolate the logic in a portable module

Put the actual logic — the bit that's answering the question — behind a small, pure interface that could be lifted out and dropped into the real codebase later. The CLI shell around it is throwaway; the logic module shouldn't be.

The right shape depends on the question:

- **A pure reducer** — `function reduce(state: State, action: Action): State`. Good when actions are discrete events and state is a single value.
- **A state machine** — explicit states and transitions via a discriminated union. Good when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type. Good when there's no implicit current state — just transformations.
- **A class with a clear method surface** when the logic genuinely owns ongoing internal state.

Pick whichever shape best fits the question being asked. Keep it pure: no CLI code, no `console.log()` for control flow. The shell imports it and calls into it; nothing flows the other direction.

### 4. Build the smallest shell that exposes the state

**Interactive CLI script (preferred):**

```typescript
// Prototype: Does the lookup cache handle concurrent requests correctly?
import * as readline from "node:readline";

interface LookupState {
  cache: Map<string, PriceRange[]>;
  pending: Set<string>;
}

let state: LookupState = { cache: new Map(), pending: new Set() };

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function prompt() {
  console.log("\nState:", JSON.stringify(Object.fromEntries(state.cache), null, 2));
  console.log("Pending:", [...state.pending]);
  console.log("\nCommands: lookup <setCode>/<number> | evict <key> | reset | quit");
  rl.question("> ", (input) => {
    const [cmd, ...args] = input.trim().split(" ");
    switch (cmd) {
      case "lookup": state = reduce(state, { type: "lookup", key: args[0] }); break;
      case "evict":  state = reduce(state, { type: "evict", key: args[0] }); break;
      case "reset":  state = { cache: new Map(), pending: new Set() }; break;
      case "quit":   rl.close(); process.exit(0);
      default:       console.log("Unknown command");
    }
    prompt();
  });
}

prompt();
```

**Test-as-prototype:**

Write a Vitest test file that runs through scenarios and logs intermediate state. Run with `pnpm run test -- prototype`.

### 5. Make it runnable immediately

- **CLI script**: Document the run command at the top of the file: `// Run: npx tsx src/prototype.ts`
- **Test file**: Name it `*.prototype.test.ts` so it's easy to run in isolation

### 6. Hand it over

Tell the user where to find it. They'll drive it themselves; the interesting moments are when they say "wait, that shouldn't be possible" or "huh, I assumed X would be different" — those are the bugs in the _idea_.

### 7. Capture the answer

When the prototype has done its job, the answer to the question is the only thing worth keeping. If the user is around, ask what it taught them. If not, leave a `NOTES.md` next to the prototype so the answer can be filled in before the prototype gets deleted.

## Anti-patterns

- **Don't add tests.** A prototype that needs tests is no longer a prototype.
- **Don't wire it to real APIs or databases.** Use in-memory state unless the question is specifically about persistence or network behavior.
- **Don't generalise.** No "what if we wanted to support X later." The prototype answers one question.
- **Don't blur the logic and the shell together.** If the reducer / state machine references `readline` or `console.log`, it's no longer portable. Keep the shell as a thin layer over a pure module.
- **Don't ship the shell into production.** The shell is optimised for manual exploration. The logic module behind it is the bit worth keeping.
