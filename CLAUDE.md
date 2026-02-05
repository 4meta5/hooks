# Hooks

TypeScript tooling for Claude Code skills.

## Project Structure
- `packages/` - npm packages (cli, library, loader, installer, sources, chain, validator)
- `hooks/` - Git hooks for validation
- `scripts/` - Build and validation scripts
- `docs/` - Research and architecture documentation

## Development Commands
- `npm run build` - Build all packages
- `npm test` - Run unit tests
- `npm run test:property` - Run property-based tests
- `npm run test:all` - Run all tests
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - Lint code

## Testing Strategy
- **Unit tests** (`*.test.ts`) - Fast, deterministic tests
- **Property tests** (`*.property.test.ts`) - Randomized tests using fast-check

## Git Hooks (Lefthook)
Pre-commit runs typecheck + unit tests in parallel.

**Skip hooks when needed:**
- `LEFTHOOK=0 git commit -m "message"` - Skip all hooks
- `SKIP=typecheck git commit -m "message"` - Skip specific hook

## Coding Conventions
- Use TypeScript strict mode
- Write tests first
- Keep functions small and focused
- Use descriptive variable names

## Key Files
- `packages/skills/src/types.ts` - Core type definitions
- `packages/skills/src/library.ts` - Main library implementation
- `packages/cli/src/curated-sources.ts` - Curated skill sources (primary skill discovery)
- `packages/cli/src/matcher.ts` - Skill matching logic

## Installed Skills
- @.claude/skills/code-review-ts/SKILL.md
- @.claude/skills/differential-review/SKILL.md
- @.claude/skills/dogfood/SKILL.md
- @.claude/skills/refactor-suggestions/SKILL.md
- @.claude/skills/repo-hygiene/SKILL.md
- @.claude/skills/rick-rubin/SKILL.md
- @.claude/skills/tdd/SKILL.md

## Dogfooding

After completing features, test the CLI:

```bash
./packages/cli/bin/skills.js scan
./packages/cli/bin/skills.js list
```
