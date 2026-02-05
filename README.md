# Hooks

TypeScript tooling for Claude Code skills: CLI, library, chain system, and hooks.

[![npm version](https://img.shields.io/npm/v/@4meta5/skills-cli)](https://npmjs.com/package/@4meta5/skills-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| `@4meta5/skills` | Core skills library | [![npm](https://img.shields.io/npm/v/@4meta5/skills)](https://npmjs.com/package/@4meta5/skills) |
| `@4meta5/skills-cli` | CLI for discovering and installing skills | [![npm](https://img.shields.io/npm/v/@4meta5/skills-cli)](https://npmjs.com/package/@4meta5/skills-cli) |
| `@4meta5/skill-loader` | Skill loading and parsing utilities | [![npm](https://img.shields.io/npm/v/@4meta5/skill-loader)](https://npmjs.com/package/@4meta5/skill-loader) |
| `@4meta5/chain` | Skill chaining and workflow enforcement | [![npm](https://img.shields.io/npm/v/@4meta5/chain)](https://npmjs.com/package/@4meta5/chain) |

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

## Development

```bash
# Build specific package
npm run build -w packages/cli

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

## Hooks

Git hooks are managed by Lefthook. Pre-commit runs typecheck and unit tests in parallel.

```bash
# Skip hooks when needed
LEFTHOOK=0 git commit -m "message"
```

## Related

For the skills collection (the actual skill definitions), see the [skills repository](https://github.com/4meta5/skills).
