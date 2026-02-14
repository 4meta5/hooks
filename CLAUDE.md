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
- @.claude/skills/dogfood/SKILL.md
- @.claude/skills/model-router/SKILL.md
- @.claude/skills/refactor-suggestions/SKILL.md
- @.claude/skills/repo-hygiene/SKILL.md
- @.claude/skills/rick-rubin/SKILL.md
- @.claude/skills/tdd/SKILL.md

## Releasing

Every release must publish to npm. Never skip this step.

```bash
# 1. Bump versions in all 7 package.json files
# 2. Build and test
npm run build && npm test

# 3. Commit and tag
git add -A && git commit -m "release: vX.Y.Z"
git tag vX.Y.Z

# 4. Publish to npm (all packages, public access)
npm run publish:all

# 5. Push and create GitHub release
git push && git push --tags
gh release create vX.Y.Z --title "vX.Y.Z" --notes "release notes here"
```

Packages published: `@4meta5/skill-loader`, `@4meta5/project-detector`, `@4meta5/semantic-matcher`, `@4meta5/workflow-enforcer`, `@4meta5/skills`, `@4meta5/chain`, `@4meta5/skills-cli`.

## Dogfooding

After completing features, test the CLI:

```bash
./packages/cli/bin/skills.js scan
./packages/cli/bin/skills.js list
```
