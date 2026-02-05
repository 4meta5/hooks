# skill-hooks

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
- `packages/skills/src/loader.ts` - Skill loading utilities
- `packages/skills/src/library.ts` - Main library implementation

## Dogfooding

After completing features, test the CLI:

```bash
./packages/cli/bin/skills.js scan
./packages/cli/bin/skills.js list
```
