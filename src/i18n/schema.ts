import { z } from 'zod';
import { webUrl } from '../config/schema';

const text = z.string().trim().min(1);
const flag = z.boolean().optional();
const published = z.boolean().default(true);

/** A point is a plain sentence, or `{ text, published }` when it needs a flag. Hidden points are removed. */
const point = z.union([text, z.object({ text, published: flag }).strict()]);
const points = z.array(point).transform(list => list.flatMap(item => typeof item === 'string' ? [item] : item.published === false ? [] : [item.text]));
/** Label maps (skill categories, social labels): a hidden label removes that entry. */
const labels = z.record(point).transform(map => Object.fromEntries(Object.entries(map).flatMap(([key, item]) => typeof item === 'string' ? [[key, item]] : item.published === false ? [] : [[key, item.text]])) as Record<string, string>);

/** Records keyed by stable `id`; unpublished records are removed after validation. */
function records<T extends z.ZodRawShape>(shape: T) {
  return z.array(z.object({ id: text, published: flag, ...shape }).strict()).superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.forEach((item, index) => {
      const id = String(item.id);
      if (seen.has(id)) ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate id "${item.id}"` });
      seen.add(id);
    });
  }).transform(list => list.filter(item => item.published !== false));
}

const copy = z.object({ ariaLabel: text, geoSummary: text }).passthrough();
const sectionCopy = copy.extend({ kicker: text, published });
const labeledCopy = sectionCopy.extend({ titleBefore: text, titleHighlight: text });
const group = z.object({ published }).strict().default({});

export const localeSchema = z.object({
  language: z.object({ name: text, code: text }),
  seo: z.object({ shareImageAlt: text }),
  nav: z.object({
    brand: text, links: z.record(text), editionBadge: text, editionSubtitle: text, unfoldAll: text, foldAll: text,
    registrationEdition: text, registrationDisciplines: text, registrationIssue: text, mastheadKicker: text,
    indexTitle: text, indexSubtitle: text, openMenu: text, closeMenu: text, toggleTheme: text, nightEdition: text,
    dayEdition: text, mainNavigation: text, selectLanguage: text,
  }).passthrough(),
  hero: copy.extend({
    srHeading: text, mastheadSubtitle: text, bannerKicker: text, bannerTitle: text, headlineBefore: text,
    headlineAfter: text, headlineLine2: text, description: text, viewWork: text, resume: text, profileAlt: text,
    profileKicker: text, profileTitle: text, profileSummary: text, careerTitle: text, careerSubtitle: text,
    featuredTitle: text, featuredSubtitle: text, continuingEducationTitle: text, continuingEducationSummary: text,
    readDispatch: text, readDossier: text, inspectEducation: text,
  }),
  about: copy.extend({
    published,
    titleBefore: text,
    titleHighlight: text,
    paragraphs: points,
    stats: z.array(z.object({ value: text, label: text })).optional(),
  }),
  experience: sectionCopy.extend({
    title: text, hint: text, unfoldAll: text, foldAll: text, dispatchLabel: text, unfoldItem: text, foldItem: text, leadSummary: text,
    items: records({ company: text, role: text, period: text, dateTime: text, summary: text.optional(), frontPage: flag, expanded: flag, description: points }),
  }),
  education: sectionCopy.extend({
    title: text, formalTitle: text, formalSubtitle: text, academicStanding: text, certificationsTitle: text,
    certificationsSubtitle: text, showCredential: text, viewAllCertifications: text, moreCertificationsNote: text,
    seeAllCertifications: text, skillsLabel: text,
    formalEducation: group,
    continuingEducation: group,
    items: records({ institution: text, degree: text, period: text, details: points }),
    certifications: records({ issuer: text, date: text, title: text, skills: text, url: webUrl }),
  }),
  projects: sectionCopy.extend({
    title: text, visit: text, viewOnGithub: text, visitLabel: text, githubLabel: text, showLess: text, viewMore: text,
    featuredFilter: text, allWorksFilter: text, unfoldAll: text, foldAll: text, dossierLabel: text, unfoldItem: text,
    foldItem: text, featuredBadge: text, archiveBadge: text, morePoints: text,
    affiliations: z.record(text).default({}),
    items: records({
      title: text,
      link: webUrl.optional(),
      github: webUrl.optional(),
      isExternal: z.boolean().optional(),
      period: text.optional(),
      frontPage: flag,
      frontPageKicker: text.optional(),
      summary: text.optional(),
      expanded: flag,
      affiliation: text.optional(),
      description: points,
      tech: points,
      featured: z.boolean(),
    }),
  }).superRefine((projects, ctx) => {
    projects.items.forEach((item, index) => {
      if (item.affiliation && !projects.affiliations[item.affiliation]) ctx.addIssue({ code: 'custom', path: ['items', index, 'affiliation'], message: `Unknown affiliation "${item.affiliation}"; add it to projects.affiliations` });
    });
  }),
  skills: labeledCopy.extend({
    philosophy: text, noteLabel: text, note: text, relatedEcosystem: text,
    categories: labels,
    notes: labels,
  }),
  blog: labeledCopy.extend({
    readMore: text, visitBlog: text,
    posts: records({ title: text, excerpt: text, date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), dateLabel: text, readTime: text, link: webUrl }),
  }),
  contact: sectionCopy.extend({
    titleBefore: text, titleHighlight: text, description: text, getInTouch: text, linkedin: text, directChannels: text,
    availability: text, couponLabel: text, couponReference: text, couponTitle: text,
  }),
  footer: z.object({ brand: text, copyright: text, socialAria: text, social: labels }),
  common: z.object({ skipToContent: text, backToTop: text, loading: text, loadError: text, reload: text, emailLabel: text, linksLabel: text, sitemapLabel: text }),
  notFound: z.object({ title: text, description: text, message: text, backHome: text }),
});

/** A validated locale with English fallback applied and every unpublished entry removed. */
export type Locale = z.output<typeof localeSchema>;
