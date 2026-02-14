# Hooks

TypeScript tooling for Claude Code skills.

[![npm version](https://img.shields.io/npm/v/@4meta5/skills-cli)](https://npmjs.com/package/@4meta5/skills-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```bash
npx @4meta5/skills-cli scan
```

## What It Does

- **Scans your project** and recommends relevant skills based on your stack
- **Installs skills** from curated sources or custom repositories
- **Validates skills** for quality and correctness (including optional `agents/openai.yaml` metadata)
- **Syncs CLAUDE.md** to keep skill references current

## Skills

This CLI manages skills from [4meta5/skills](https://github.com/4meta5/skills).

Core skills include: `tdd`, `code-review-ts`, `code-review-rust`, `differential-review`, `refactor-suggestions`, `repo-hygiene`, and more.

Skills are automatically recommended when you run `skills scan`.

## Quick Start

```bash
# Install globally
npm install -g @4meta5/skills-cli

# Scan project for recommendations
skills scan

# Install a skill
skills add tdd

# List installed skills
skills list
```

## Example Output

```bash
$ skills scan

Analyzing project...

Detected Stack:
  Languages:     TypeScript 5.0.0 (high)
  Testing:       Vitest (high)

Recommended Skills:

  DEVELOPMENT
  + tdd (4meta5-skills)
    Detected TypeScript (package.json typescript dependency)
    7 alternative(s) available
```

## Commands

| Command | Description |
|---------|-------------|
| `scan` | Analyze project and recommend skills |
| `add <name>` | Install a skill |
| `remove <name>` | Remove a skill |
| `list` | List installed skills |
| `show <name>` | Show skill details |
| `validate [path]` | Validate skill quality |
| `update` | Update skills from sources |
| `sync` | Sync skills to tracked projects |
| `sync --push` | Install a skill into tracked projects that do not have it yet |
| `hook` | Manage Claude Code hooks |
| `hygiene` | Detect and clean slop |

Run `skills <command> --help` for command-specific options.

## Priority Rollout

Use the local rollout script to update selected hooks/skills from `../skills` into
priority projects (`../claudette-codes`, `../claudette`) and install
`paul-graham` for Codex:

```bash
./scripts/rollout-priority.sh
```

You can pass explicit project paths:

```bash
./scripts/rollout-priority.sh ../claudette-codes ../claudette
```

## Skill Metadata

Skills may include optional UI metadata at `<skill-name>/agents/openai.yaml`.
When present, `skills validate` checks that it parses as YAML and that
`interface.default_prompt` references `$<skill-name>`.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [@4meta5/skills-cli](./packages/cli) | CLI for discovering and installing skills | [![npm](https://img.shields.io/npm/v/@4meta5/skills-cli)](https://npmjs.com/package/@4meta5/skills-cli) |
| [@4meta5/skills](./packages/skills) | Core skills library | [![npm](https://img.shields.io/npm/v/@4meta5/skills)](https://npmjs.com/package/@4meta5/skills) |
| [@4meta5/skill-loader](./packages/skill-loader) | Skill loading and parsing | [![npm](https://img.shields.io/npm/v/@4meta5/skill-loader)](https://npmjs.com/package/@4meta5/skill-loader) |
| [@4meta5/chain](./packages/chain) | Skill chaining and workflow enforcement | [![npm](https://img.shields.io/npm/v/@4meta5/chain)](https://npmjs.com/package/@4meta5/chain) |

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
