import site from './site.json';
import theme from './theme.json';
import { siteSchema, themeSchema } from './schema';

export interface SkillItem { name: string; icon: string; invertInDark?: boolean }
export interface SkillCategory { id: string; items: SkillItem[] }
export interface SocialLink { platform: string; url: string; icon?: string }

export const siteConfig = siteSchema.parse(site) as unknown as Omit<typeof site, 'skills' | 'social' | 'educationLogos'> & { skills: SkillCategory[]; social: SocialLink[]; educationLogos: Record<string, string> };
export const themeConfig = themeSchema.parse(theme);

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
  const style = document.getElementById('theme-config') ?? document.createElement('style');
  style.id = 'theme-config';
  style.textContent = `:root{${css(themeConfig.light)}}.dark{${css(themeConfig.dark)}}`;
  document.head.appendChild(style);
}

