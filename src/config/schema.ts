import { z } from 'zod';

export const sectionIds = ['about', 'experience', 'education', 'projects', 'skills', 'blog', 'contact'] as const;
const text = z.string().trim().min(1);
const webUrl = text.url().refine((value) => /^https?:\/\//.test(value), 'Use an HTTP or HTTPS URL');
const media = text.refine((value) => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), 'Use a local /media path or HTTP(S) URL');
const icon = text.refine((value) => value.startsWith('devicon:') || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), 'Invalid icon reference');
export const siteSchema = z.object({
  siteUrl: webUrl,
  person: z.object({
    name: text, jobTitle: text, email: text.email(), profileImage: media, resumeUrl: webUrl,
    location: z.object({ city: text, country: text, countryCode: z.string().length(2), lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
  }),
  seo: z.object({ title: text, description: text, ogDescription: text, dateCreated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), themeColor: z.string().regex(/^#[\da-f]{6}$/i) }),
  theme: z.object({ default: z.enum(['system', 'light', 'dark']) }),
  sections: z.array(z.enum(sectionIds)).refine((items) => new Set(items).size === items.length, 'Section IDs must be unique'),
  contact: z.object({ secondaryButton: z.object({ platform: text, url: webUrl }) }),
  blogUrl: webUrl,
  social: z.array(z.object({ platform: text, url: webUrl, icon: media.optional() })),
  educationLogos: z.record(media),
  skills: z.array(z.object({ id: text, items: z.array(z.object({ name: text, icon, invertInDark: z.boolean().optional() })) })),
});

const hsl = z.string().regex(/^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%$/).refine((value) => {
  const [h, s, l] = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return h <= 360 && s <= 100 && l <= 100;
}, 'HSL values must be in range');
const tokens = z.record(z.string().regex(/^[a-z][a-z0-9-]*$/), hsl);
export const themeSchema = z.object({ light: tokens, dark: tokens });
export type SiteConfig = z.infer<typeof siteSchema>;