import site from './site.json';
import theme from './theme.json';

export interface SkillItem { name: string; icon: string; invertInDark?: boolean }
export interface SkillCategory { id: string; items: SkillItem[] }
export interface SocialLink { platform: string; url: string; icon?: string }

export const siteConfig = site as typeof site & { skills: SkillCategory[]; social: SocialLink[] };
export const themeConfig = theme as { light: Record<string, string>; dark: Record<string, string> };

/** Resolve icon refs: "devicon:<path>" uses the Devicon CDN; anything else is used as-is. */
export function resolveIcon(ref: string): string {
  return ref.startsWith('devicon:')
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${ref.slice(8)}`
    : ref;
}

export const allSkills = (): SkillItem[] => siteConfig.skills.flatMap((c) => c.items);

/** Inject theme overrides as CSS variables. */
export function applyTheme() {
  const css = (vars: Record<string, string>) =>
    Object.entries(vars).filter(([k]) => !k.startsWith('$')).map(([k, v]) => `--${k}:${v};`).join('');
  const style = document.createElement('style');
  style.id = 'theme-config';
  style.textContent = `:root{${css(themeConfig.light)}}.dark{${css(themeConfig.dark)}}`;
  document.head.appendChild(style);
}

// Fail fast with a clear message if required config is missing.
const required: [string, unknown][] = [
  ['siteUrl', siteConfig.siteUrl],
  ['person.name', siteConfig.person?.name],
  ['person.email', siteConfig.person?.email],
  ['seo.title', siteConfig.seo?.title],
];
for (const [k, v] of required) {
  if (!v) console.error(`[config] Missing required field "${k}" in src/config/site.json`);
}
