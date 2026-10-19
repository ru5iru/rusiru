import { z } from 'zod';
import { webUrl } from '@/config/schema';
const text = z.string().trim().min(1);
const copy = z.object({ ariaLabel: text }).passthrough();
export const localeSchema = z.object({
  language: z.object({ name: text, code: text }),
  nav: z.object({ brand: text, links: z.record(text), openMenu: text, closeMenu: text, toggleTheme: text, mainNavigation: text, selectLanguage: text }).passthrough(),
  hero: copy.extend({ srHeading: text, headlineBefore: text, headlineAfter: text, headlineLine2: text, description: text, viewWork: text, resume: text, profileAlt: text }),
  about: copy.extend({ titleBefore: text, titleHighlight: text, paragraphs: z.array(text), stats: z.array(z.object({ value: text, label: text })) }),
  experience: copy.extend({ title: text, items: z.array(z.object({ company: text, role: text, period: text, dateTime: text, description: z.array(text) })) }),
  education: copy.extend({ title: text, items: z.array(z.object({ id: text, institution: text, degree: text, period: text, details: z.array(text) })) }),
  projects: copy.extend({ title: text, visit: text, viewOnGithub: text, showLess: text, viewMore: text, items: z.array(z.object({ title: text, link: webUrl.optional(), github: webUrl.optional(), description: z.array(text), tech: z.array(text), featured: z.boolean() }).passthrough()) }),
  skills: copy.extend({ titleBefore: text, titleHighlight: text, categories: z.record(text) }),
  blog: copy.extend({ titleBefore: text, titleHighlight: text, readMore: text, visitBlog: text, posts: z.array(z.object({ title: text, excerpt: text, date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), dateLabel: text, readTime: text, link: webUrl })) }),
  contact: copy.extend({ titleBefore: text, titleHighlight: text, description: text, getInTouch: text, linkedin: text }),
  footer: z.object({ brand: text, copyright: text, socialAria: text, social: z.record(text) }),
  common: z.object({ skipToContent: text, backToTop: text, loading: text, loadError: text, reload: text }),
  notFound: z.object({ title: text, description: text, message: text, backHome: text }),
});