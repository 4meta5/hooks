#!/usr/bin/env bash
set -euo pipefail

# Roll out selected skills + hooks from local repos to priority projects.
# Default targets:
#   - ../claudette-codes
#   - ../claudette
#
# This script:
# 1) Adds/updates ../skills as a local source in skills-cli config.
# 2) Ensures AGENTS.md -> CLAUDE.md symlink for Claude Code + Codex compatibility.
# 3) Updates already-installed project skills from the local source.
# 4) Installs paul-graham in claudette-codes.
# 5) Installs/updates selected hooks.
# 6) Installs paul-graham into ~/.codex/skills.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="$ROOT_DIR/packages/cli/bin/skills.js"

SKILLS_REPO="${SKILLS_REPO:-$ROOT_DIR/../skills}"
SOURCE_NAME="${SOURCE_NAME:-agi-local-skills}"
HOOKS="${HOOKS:-skill-forced-eval setup-shims}"

if [[ ! -f "$CLI" ]]; then
  echo "ERROR: skills CLI not found at $CLI" >&2
  exit 1
fi

if [[ ! -d "$SKILLS_REPO" ]]; then
  echo "ERROR: skills repo not found at $SKILLS_REPO" >&2
  exit 1
fi

if [[ $# -gt 0 ]]; then
  PROJECTS=("$@")
else
  PROJECTS=("$ROOT_DIR/../claudette-codes" "$ROOT_DIR/../claudette")
fi

echo "Using source repo: $SKILLS_REPO"
echo "Using source name: $SOURCE_NAME"

node "$CLI" source add "$SKILLS_REPO" --name "$SOURCE_NAME"

for project in "${PROJECTS[@]}"; do
  if [[ ! -d "$project" ]]; then
    echo "WARN: skipping missing project: $project"
    continue
  fi

  echo
  echo "== Project: $project =="
  "$ROOT_DIR/scripts/ensure-agents.sh" "$project"

  # Keep project tracking aligned with on-disk state.
  node "$CLI" projects add "$project"

  # Update currently installed skills from local source.
  if [[ -d "$project/.claude/skills" ]]; then
    current_skills_raw="$(
      find "$project/.claude/skills" -mindepth 2 -maxdepth 2 -name SKILL.md -print \
        | sed 's#/SKILL.md$##' \
        | xargs -I{} basename "{}" \
        | sort -u
    )"

    if [[ -n "${current_skills_raw:-}" ]]; then
      while IFS= read -r skill; do
        [[ -z "$skill" ]] && continue
        node "$CLI" add "$SOURCE_NAME/$skill" -C "$project" || true
      done <<< "$current_skills_raw"
    fi
  fi

  # Ensure claudette-codes gets paul-graham.
  if [[ "$(basename "$project")" == "claudette-codes" ]]; then
    node "$CLI" add "$SOURCE_NAME/paul-graham" -C "$project"
  fi

  # Install/update a minimal useful hook set.
  node "$CLI" hook add $HOOKS -C "$project"
done

# Install paul-graham for Codex global skill discovery.
mkdir -p "$HOME/.codex/skills"
rm -rf "$HOME/.codex/skills/paul-graham"
cp -R "$SKILLS_REPO/paul-graham" "$HOME/.codex/skills/paul-graham"

echo
echo "Rollout complete."
echo "Codex skill installed at: $HOME/.codex/skills/paul-graham"
echo "Restart Codex and Claude Code sessions to pick up updates."
