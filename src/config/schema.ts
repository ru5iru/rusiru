import { z } from 'zod';
import type defaults from './site.json';

export const sectionIds = ['about', 'experience', 'education', 'projects', 'skills', 'blog', 'contact'] as const;
const text = z.string().trim().min(1);
export const webUrl = text.url().refine((value) => /^https?:\/\//.test(value), 'Use an HTTP or HTTPS URL');
const media = text.refine((value) => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), 'Use a local /media path or HTTP(S) URL');
const icon = text.refine((value) => value.startsWith('devicon:') || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), 'Invalid icon reference');
const publication = z.object({ visible: z.boolean(), featured: z.boolean(), frontPage: z.boolean(), expanded: z.boolean(), affiliation: z.string() }).strict();
const recordSettings = z.record(text, publication);
export const siteSchema = z.object({
  siteUrl: webUrl,
  person: z.object({
    name: text, jobTitle: text, email: text.email(), profileImage: media, resumeUrl: webUrl,
    location: z.object({ city: text, country: text, countryCode: z.string().length(2), lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
  }),
  seo: z.object({ title: text, description: text, ogDescription: text, shareImage: media, themeColor: z.string().regex(/^#[\da-f]{6}$/i) }),
  theme: z.object({ default: z.enum(['system', 'light', 'dark']) }),
  sections: z.array(z.enum(sectionIds)).refine((items) => new Set(items).size === items.length, 'Section IDs must be unique'),
  display: z.object({
    sections: z.object(Object.fromEntries(sectionIds.map(id => [id, z.boolean()])) as Record<typeof sectionIds[number], z.ZodBoolean>).strict(),
    groups: z.object({ formalEducation: z.boolean(), continuingEducation: z.boolean() }).strict(),
    frontPage: z.object({ blog: z.boolean(), career: z.boolean(), projects: z.boolean(), education: z.boolean(), continuingEducation: z.boolean(), portrait: z.boolean(), biography: z.boolean(), viewWork: z.boolean(), resume: z.boolean() }).strict(),
    chrome: z.object({ banner: z.boolean(), footer: z.boolean(), backToTop: z.boolean(), themeToggle: z.boolean(), languageSelector: z.boolean(), unfoldAll: z.boolean() }).strict(),
    items: z.object({ experience: recordSettings, education: recordSettings, certifications: recordSettings, projects: recordSettings, blog: recordSettings }).strict(),
  }).strict(),
  contact: z.object({ secondaryButton: z.object({ platform: z.enum(['linkedin', 'github', 'discord', 'facebook', 'x', 'twitter', 'reddit', 'blog', 'spotify']), url: webUrl }) }),
  blogUrl: webUrl,
  continuingEducationUrl: webUrl,
  social: z.array(z.object({ platform: text, url: webUrl, icon: media.optional(), visible: z.boolean() })),
  educationLogos: z.record(media),
  skills: z.array(z.object({ id: text, visible: z.boolean(), items: z.array(z.object({ name: text, icon, invertInDark: z.boolean().optional(), visible: z.boolean() })) })),
}).superRefine((site, ctx) => {
  const ids = site.skills.map(category => category.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: ['skills'], message: 'Skill category IDs must be unique' });
});

const hsl = z.string().regex(/^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%$/).refine((value) => {
  const [h, s, l] = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return h <= 360 && s <= 100 && l <= 100;
}, 'HSL values must be in range');
const tokens = z.record(z.string().regex(/^[a-z][a-z0-9-]*$/), hsl);
export const themeSchema = z.object({ light: tokens, dark: tokens });
export interface PublicationSettings { visible: boolean; featured: boolean; frontPage: boolean; expanded: boolean; affiliation: string }
export interface SkillItem { name: string; icon: string; invertInDark?: boolean; visible: boolean }
export interface SkillCategory { id: string; items: SkillItem[]; visible: boolean }
export interface SocialLink { platform: string; url: string; icon?: string; visible: boolean }
export type SiteConfig = Omit<typeof defaults, 'skills' | 'social' | 'educationLogos' | 'display'> & {
  skills: SkillCategory[];
  social: SocialLink[];
  educationLogos: Record<string, string>;
  display: Omit<typeof defaults.display, 'items'> & { items: Record<'experience' | 'education' | 'certifications' | 'projects' | 'blog', Record<string, PublicationSettings>> };
};