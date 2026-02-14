/**
 * Evaluate Command - Generate dynamic skill evaluation prompt
 *
 * Discovers all installed skills and generates the evaluation prompt
 * that hooks use for the 3-step activation sequence.
 *
 * This replaces the hardcoded skill list in skill-forced-eval hook
 * with dynamic discovery from .claude/skills/.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

/**
 * Extracted skill trigger information
 */
export interface SkillTriggerInfo {
  skillName: string;
  description: string;
  triggerPatterns: string[];
}

/**
 * Options for evaluate command
 */
export interface EvaluateOptions {
  /** Working directory */
  cwd?: string;
  /** Skills directory to scan */
  skillsDir?: string;
  /** Return JSON instead of text */
  json?: boolean;
}

/**
 * Result of evaluate command (when json=true)
 */
export interface EvaluateResult {
  skills: SkillTriggerInfo[];
  prompt: string;
}

function stripOptionalQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith('\'') && trimmed.endsWith('\''))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Recover essential frontmatter fields from imperfect YAML.
 * Some real SKILL.md files contain unquoted colons in description values.
 */
function parseFrontmatterLoosely(rawFrontmatter: string): Record<string, unknown> {
  const lines = rawFrontmatter.split(/\r?\n/);
  const frontmatter: Record<string, unknown> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const nameMatch = line.match(/^name:\s*(.+)$/);
    if (nameMatch && !frontmatter.name) {
      frontmatter.name = stripOptionalQuotes(nameMatch[1]);
      continue;
    }

    const descriptionMatch = line.match(/^description:\s*(.*)$/);
    if (descriptionMatch && !frontmatter.description) {
      const firstPart = descriptionMatch[1];
      const descriptionLines: string[] = [];

      if (firstPart.trim().length > 0 && firstPart.trim() !== '|') {
        descriptionLines.push(firstPart.trim());
      }

      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        if (/^[a-zA-Z0-9_-]+:\s*/.test(next)) {
          break;
        }
        if (next.trim().length > 0) {
          descriptionLines.push(next.trim());
        }
      }

      frontmatter.description = descriptionLines.join(' ').trim();
    }
  }

  return frontmatter;
}

/**
 * Extract trigger patterns from a SKILL.md file
 */
export async function extractSkillTriggers(skillMdPath: string): Promise<SkillTriggerInfo> {
  const content = await readFile(skillMdPath, 'utf-8');

  // Parse frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid SKILL.md format: missing frontmatter in ${skillMdPath}`);
  }

  const rawFrontmatter = match[1];
  let frontmatter: Record<string, unknown>;
  try {
    frontmatter = parseYaml(rawFrontmatter) as Record<string, unknown>;
  } catch {
    frontmatter = parseFrontmatterLoosely(rawFrontmatter);
  }
  const body = match[2];

  const skillName = String(frontmatter.name || '').trim();
  if (!skillName) {
    throw new Error(`Invalid SKILL.md format: missing name in frontmatter for ${skillMdPath}`);
  }
  let description = '';
  if (typeof frontmatter.description === 'string') {
    description = frontmatter.description;
  } else if (frontmatter.description) {
    description = String(frontmatter.description).trim();
  }

  // Extract trigger patterns from various section types
  const triggerPatterns: string[] = [];

  // Patterns for trigger sections
  const sectionPatterns = [
    /##\s*When to Use[^\n]*\n([\s\S]*?)(?=\n##|$)/i,
    /##\s*Trigger Conditions[^\n]*\n([\s\S]*?)(?=\n##|$)/i,
    /##\s*When to Invoke[^\n]*\n([\s\S]*?)(?=\n##|$)/i,
    /##\s*Context\s*\/\s*Trigger Conditions[^\n]*\n([\s\S]*?)(?=\n##|$)/i,
    /##\s*When NOT to Use[^\n]*\n([\s\S]*?)(?=\n##|$)/i,
  ];

  for (const pattern of sectionPatterns) {
    const sectionMatch = body.match(pattern);
    if (sectionMatch) {
      const sectionContent = sectionMatch[1];

      // Extract bullet points
      const lines = sectionContent.split('\n');
      for (const line of lines) {
        const bulletMatch = line.match(/^\s*[-*]\s+(.+)$/);
        if (bulletMatch) {
          const bulletText = bulletMatch[1].trim()
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
            .replace(/`([^`]+)`/g, '$1') // Remove code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links

          if (bulletText && bulletText.length > 3) {
            triggerPatterns.push(bulletText);
          }
        }
      }
    }
  }

  return {
    skillName,
    description,
    triggerPatterns,
  };
}

/**
 * Discover skills in a single directory (non-recursive helper)
 */
async function discoverSkillsInDir(dir: string, skills: SkillTriggerInfo[]): Promise<void> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = join(dir, entry.name);
      const skillMdPath = join(skillPath, 'SKILL.md');

      try {
        await stat(skillMdPath);
        const triggerInfo = await extractSkillTriggers(skillMdPath);
        skills.push(triggerInfo);
      } catch {
        // Skip directories without valid SKILL.md
      }
    }
  } catch {
    // Directory doesn't exist or not readable
  }
}

/**
 * Discover all installed skills in a directory
 * Scans the flat .claude/skills/ directory for skill folders
 */
export async function discoverInstalledSkills(skillsDir: string): Promise<SkillTriggerInfo[]> {
  const skills: SkillTriggerInfo[] = [];

  await discoverSkillsInDir(skillsDir, skills);

  return skills;
}

/**
 * Format trigger patterns into a readable string
 */
function formatTriggerString(patterns: string[]): string {
  if (patterns.length === 0) {
    return 'No specific triggers defined';
  }

  // Take first 3-4 triggers to keep it concise
  const displayPatterns = patterns.slice(0, 4);
  return displayPatterns.join(', ');
}

/**
 * Generate the full evaluation prompt for skill activation
 */
export async function generateEvaluationPrompt(skillsDir: string): Promise<string> {
  const skills = await discoverInstalledSkills(skillsDir);

  if (skills.length === 0) {
    return `
## MANDATORY SKILL ACTIVATION SEQUENCE

No skills installed. Install skills with: skills add <skill-name>
`;
  }

  // Build the skill list with triggers
  const skillLines = skills.map(skill => {
    const triggers = formatTriggerString(skill.triggerPatterns);
    return `- ${skill.skillName}: Trigger = ${triggers}`;
  });

  return `
## MANDATORY SKILL ACTIVATION SEQUENCE

### Step 1 - EVALUATE (do this in your response):
For each installed skill, state: [skill-name] - YES/NO - [reason]

Installed skills to evaluate:
${skillLines.join('\n')}

### Step 2 - ACTIVATE (do this immediately after Step 1):
IF any skills are YES → Use Skill(skill-name) tool for EACH relevant skill NOW
IF no skills are YES → State "No skills activated" and proceed

### Step 3 - IMPLEMENT:
Only after Step 2 is complete, proceed with implementation.

## CRITICAL REQUIREMENTS

1. You MUST call Skill() tool in Step 2 for every YES skill
2. The evaluation (Step 1) is WORTHLESS unless you ACTIVATE (Step 2) the skills
3. Do NOT skip to implementation without completing Step 2

## Example of Correct Sequence:

\`\`\`
SKILL EVALUATION (Step 1):
- tdd: YES - fixing a bug in the CLI
- diff-review: YES - reviewing a security-sensitive PR
- model-router: NO - model tier already selected by user

ACTIVATING SKILLS (Step 2):
[Calls Skill("tdd")]
[Calls Skill("diff-review")]

IMPLEMENTING (Step 3):
[Now proceeds with implementation following both activated skills]
\`\`\`

## BLOCKING CONDITIONS - NO EXCEPTIONS

- If tdd = YES: You are BLOCKED until Phase 1 (RED) is complete - failing test required
- Skills CHAIN: If multiple skills are YES, follow ALL activated skills

## NO EXCEPTIONS

These rationalizations are REJECTED:
- "It's a simple change" → BLOCKED. Write the test.
- "Just this once" → BLOCKED. That's what you said last time.
- "I'll add tests after" → BLOCKED. Tests after = not TDD.
- "It's faster to do it manually" → BLOCKED. Fix the tool.
- "The tool is mostly working" → BLOCKED. Mostly = broken.
- "One-time migration" → BLOCKED. Build the feature.

If you are unsure whether a skill applies, ASK THE USER:
"Should I skip the [skill-name] skill for this task?"

Only proceed without activation if user EXPLICITLY says yes.

This activation sequence is MANDATORY. Skipping Step 2 violates project policy.
`;
}

/**
 * Main evaluate command handler
 */
export async function evaluateCommand(options: EvaluateOptions = {}): Promise<EvaluateResult | undefined> {
  const cwd = options.cwd || process.cwd();
  const skillsDir = options.skillsDir || join(cwd, '.claude', 'skills');

  const skills = await discoverInstalledSkills(skillsDir);
  const prompt = await generateEvaluationPrompt(skillsDir);

  if (options.json) {
    return { skills, prompt };
  }

  console.log(prompt);
  return undefined;
}
