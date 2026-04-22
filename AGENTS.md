# AI Agent Coding Standards

This project follows global coding standards for all AI agents, documented in:

    ~/.agents.md

**Summary of rules:**

- All functions, methods, and classes must have docstrings or documentation comments
  (JSDoc for JS/TS, docstrings for Python, etc.).
- Functions/methods should be ≤60 lines and have no blank lines inside.
- Use single quotes for strings unless backticks are needed or the string contains a
  single quote. Exception: JSX/TSX attribute values in markup use double quotes;
  single quotes apply inside `{}`.

For full details, see the global file above. All agents and contributors must follow these
rules in addition to project-specific linting/formatting.
