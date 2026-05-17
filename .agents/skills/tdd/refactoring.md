# Refactor Candidates

After TDD cycle, look for:

- **Duplication** → Extract function/module
- **Long functions** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **Existing code** the new code reveals as problematic
