#!/usr/bin/env bash
# Enforce agent metadata location
#
# Allowed location:
#   <skill-name>/agents/openai.yaml

set -euo pipefail

staged_agent_yaml=$(git diff --cached --name-only --diff-filter=A | grep -E 'agents/openai\.yaml$' || true)

if [ -z "$staged_agent_yaml" ]; then
  exit 0
fi

errors=0
while IFS= read -r file; do
  if [[ "$file" =~ ^[^/]+/agents/openai\.yaml$ ]]; then
    continue
  fi

  echo "❌ ERROR: Agent metadata in wrong location: $file"
  echo "   Expected path: <skill-name>/agents/openai.yaml"
  errors=$((errors + 1))
done <<< "$staged_agent_yaml"

if [ $errors -gt 0 ]; then
  echo ""
  echo "🚫 BLOCKED: $errors agent metadata file(s) in wrong location."
  exit 1
fi

exit 0
