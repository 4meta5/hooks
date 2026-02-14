# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-02-14

### Fixed

- Evaluate command: robust fallback parser for frontmatter when YAML parse fails (unquoted colons in descriptions)
- Hook script: use `--skills-dir` flag instead of `--cwd` for evaluate command
- Hook script: added fallback path for `hooks/packages/cli/bin/skills.js`
- Updated evaluation prompt examples to reference current skill names

## [0.5.0] - 2026-02-14

### Breaking

- Simplified skill categories from 13 to 5: `meta`, `audit`, `principles`, `habits`, `hot`
- Removed legacy categories: `testing`, `development`, `documentation`, `refactoring`, `security`, `performance`, `code-quality`, `deployment`, `database`, `framework`, `workflow`, `memory`, `communication`
- Renamed curated source skills: `differential-review` to `diff-review`, `skill-maker` to `make-skill`

### Changed

- Category inference logic updated to map to new category set
- Curated sources use new categories (`framework`/`deployment`/`database` -> `hot`, `testing` -> `principles`)
- Trimmed verbose JSDoc comments from type definitions in skill-loader and skills packages
- Updated development and testing category helpers to map to `principles`

## [0.4.0] - 2026-02-13

### Breaking

- Removed bundled skills system (`SkillSourceType` no longer includes `bundled`)

### Added

- `setup-shims` hook (SessionStart): prepends project-local shims to PATH
- `tools` and `extensions` metadata fields for skill definitions
- `scripts/rollout-priority.sh` for updating hooks/skills across priority projects
- Agent metadata validation (`agents/openai.yaml`)

### Changed

- Hooks support multiple event types (PreToolUse, PostToolUse, SessionStart)
- `settings.local.json` auto-configuration with migration and dedup
- Vector store cleaned and regenerated

### Fixed

- Hook installation issues (path resolution, content embedding)
- Command format migration for hook commands

## [0.3.0] - 2026-02-05

### Changed

- **Extracted into standalone project**: This codebase is now its own independent repository, separated from the parent project for better modularity and maintainability

### Fixed

- Minor cleanup and fixes

## [0.2.0] - 2026-02-03

### Added

- **Modular package architecture**: Split monolith into 7 focused packages
  - `@4meta5/skill-loader`: Parse and load SKILL.md files
  - `@4meta5/project-detector`: Detect project tech stack
  - `@4meta5/semantic-matcher`: Hybrid keyword + embedding semantic matching
  - `@4meta5/workflow-enforcer`: State machine for workflow enforcement
  - `@4meta5/skills`: Main library for skill management
  - `@4meta5/chain`: Declarative skill chaining for workflows
  - `@4meta5/skills-cli`: CLI for managing skills
- **Chain system**: Declarative skill chaining with DAG-based execution
  - RouteDecision type and ChainActivator for router integration
  - Enforcement tiers (hard/soft/none) for skills
  - Unified session state and usage tracking
  - Pre-tool-use hooks for corrective guidance
- **Test discovery**: Polyglot test runner discovery system
- **New skills**: engram-generate, engram-recall, repo-conventions-check
- **Intent mapping**: Smart intent detection for skill activation

### Changed

- Restructured project from monolith to npm workspaces monorepo
- Skills now load from `@4meta5/skill-loader` package
- CLI integrates ChainActivator with corrective loop middleware

### Fixed

- CLI bin/skills.js entry point now properly exposed

## [0.1.0] - 2026-02-02

### Added

- Initial public release
- Project analysis system (detects languages, frameworks, databases, testing tools)
- Skill matching engine with confidence levels
- CLI commands: scan, add, list, show, remove, source, stats
- Bundled skills: tdd, no-workarounds, code-review, security-analysis, and more
- Curated skill sources for common tech stacks
- Semantic routing with keyword and embedding matching
