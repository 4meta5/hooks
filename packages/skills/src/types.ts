/**
 * Canonical supported skill categories.
 * Keep aligned with @4meta5/skill-loader parser validation.
 */
export const SKILL_CATEGORIES = [
  'meta',
  'audit',
  'principles',
  'habits',
  'hot'
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];

export interface SkillMetadata {
  name: string;
  description: string;
  category?: SkillCategory;
  'disable-model-invocation'?: boolean;
  'user-invocable'?: boolean;
  'allowed-tools'?: string;
  context?: 'fork' | 'inline';
  agent?: string;
  tools?: string;
  extensions?: string;
}

export interface Skill {
  metadata: SkillMetadata;
  content: string;
  path: string;
  supportingFiles?: string[];
}

export interface FileStructure {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export interface ProjectTemplate {
  name: string;
  description: string;
  skills: string[];
  claudemd: string;
  structure: FileStructure[];
}

export interface InstallOptions {
  location: 'project' | 'user';
  cwd?: string;
}

export interface SkillsLibraryOptions {
  cwd?: string;
}

export interface ParsedFrontmatter {
  frontmatter: SkillMetadata;
  body: string;
}

export interface SkillsLibrary {
  loadSkill(name: string): Promise<Skill>;
  listSkills(category?: SkillCategory): Promise<Skill[]>;
  installSkill(skill: Skill, options: InstallOptions): Promise<void>;
  createProject(template: ProjectTemplate, targetPath: string): Promise<void>;
  extendProject(skills: string[]): Promise<void>;
}
