import type { SiteConfig } from '../src/config/schema';
import { enabledSections, publishedItems, visibleSkills, visibleSocial, validatePublication } from '../src/config/publication';
import type themeDefaults from '../src/config/theme.json';
import type english from '../src/locales/en.json';

export type SearchSite = SiteConfig;
export type SearchTheme = typeof themeDefaults;
export type SearchLocale = typeof english;
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] ?? character));
const plain = (value: string) => value.replace(/\*\*|==/g, '');
const list = (values: string[]) => `<ul>${values.map(value => `<li>${escape(plain(value))}</li>`).join('')}</ul>`;
const absolute = (base: string, reference: string) => new URL(reference, base).href;

export function createSearchContent(site: SearchSite, en: SearchLocale) {
  const url = `${site.siteUrl.replace(/\/$/, '')}/`;
  validatePublication(site, { experience: en.experience.items, education: en.education.items, certifications: en.education.certifications, projects: en.projects.items, blog: en.blog.posts }, en.projects.affiliations);
  const sections = enabledSections(site);
  const projects = publishedItems(site, 'projects', en.projects.items).map(entry => ({ ...entry.item, affiliation: entry.settings.affiliation }));
  const experience = publishedItems(site, 'experience', en.experience.items).map(entry => entry.item);
  const education = site.display.groups.formalEducation ? publishedItems(site, 'education', en.education.items).map(entry => entry.item) : [];
  const certifications = site.display.groups.continuingEducation ? publishedItems(site, 'certifications', en.education.certifications).map(entry => entry.item) : [];
  const posts = publishedItems(site, 'blog', en.blog.posts).map(entry => entry.item);
  const skills = visibleSkills(site);
  const social = visibleSocial(site);
  const personId = `${url}#person`;
  const shareImage = absolute(url, site.seo.shareImage);
  const shareImageAlt = en.seo.shareImageAlt.replace('{name}', site.person.name);
  const credentials = certifications.map(certification => ({
    '@type': 'EducationalOccupationalCredential',
    name: certification.title,
    url: certification.url,
    recognizedBy: { '@type': 'Organization', name: certification.issuer },
  }));
  const person = {
    '@type': 'Person', '@id': personId, name: site.person.name, jobTitle: site.person.jobTitle, url,
    image: absolute(url, site.person.profileImage), email: site.person.email,
    sameAs: social.map(social => social.url),
    address: { '@type': 'PostalAddress', addressLocality: site.person.location.city, addressCountry: site.person.location.countryCode },
    ...(sections.includes('skills') ? { knowsAbout: skills.flatMap(category => category.items.map(item => item.name)) } : {}),
    ...(sections.includes('education') ? {
      alumniOf: education.map(item => ({ '@type': 'EducationalOrganization', name: item.institution })),
      hasCredential: credentials,
    } : {}),
  };
  const graph: unknown[] = [
    person,
    { '@type': 'ProfilePage', '@id': url, url, name: site.seo.title, description: site.seo.description, inLanguage: en.language.code.toLowerCase(), mainEntity: { '@id': personId } },
    { '@type': 'WebSite', url, name: site.seo.title, author: { '@id': personId } },
  ];
  if (sections.includes('projects')) graph.push({ '@type': 'ItemList', numberOfItems: projects.length, itemListElement: projects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'CreativeWork', name: project.title, description: project.description.join(' '), url: project.link ?? project.github, author: { '@id': personId } } })) });
  if (sections.includes('blog')) graph.push({ '@type': 'Blog', url: site.blogUrl, author: { '@id': personId }, blogPost: posts.map(post => ({ '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: post.date, url: post.link, author: { '@id': personId } })) });

  const metadata = `<title data-rh="true">${escape(site.seo.title)}</title>
<meta name="description" content="${escape(site.seo.description)}" data-rh="true" />
<link rel="canonical" href="${escape(url)}" data-rh="true" />
<meta name="author" content="${escape(site.person.name)}" />
<meta name="robots" content="index, follow" data-rh="true" />
<meta property="og:title" content="${escape(site.seo.title)}" data-rh="true" />
<meta property="og:description" content="${escape(site.seo.ogDescription)}" data-rh="true" />
<meta property="og:type" content="website" data-rh="true" />
<meta property="og:url" content="${escape(url)}" data-rh="true" />
<meta property="og:image" content="${escape(shareImage)}" data-rh="true" />
<meta property="og:image:width" content="1200" data-rh="true" />
<meta property="og:image:height" content="630" data-rh="true" />
<meta property="og:image:type" content="image/png" data-rh="true" />
<meta property="og:image:alt" content="${escape(shareImageAlt)}" data-rh="true" />
<meta name="twitter:card" content="summary_large_image" data-rh="true" />
<meta name="twitter:title" content="${escape(site.seo.title)}" data-rh="true" />
<meta name="twitter:description" content="${escape(site.seo.ogDescription)}" data-rh="true" />
<meta name="twitter:image" content="${escape(shareImage)}" data-rh="true" />
<meta name="twitter:image:alt" content="${escape(shareImageAlt)}" data-rh="true" />
<meta name="theme-color" content="${escape(site.seo.themeColor)}" />
<meta name="geo.region" content="${escape(site.person.location.countryCode)}" />
<meta name="geo.placename" content="${escape(site.person.location.city)}, ${escape(site.person.location.country)}" />
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;

  const formalEducation = education.map(item => `<article><h3>${escape(item.degree)}</h3><p>${escape(item.institution)} · ${escape(item.period)}</p>${list(item.details)}</article>`).join('');
  const continuingEducation = certifications.map(certification => `<article><h3>${escape(certification.title)}</h3><p>${escape(certification.issuer)} · ${escape(certification.date)}</p><p>${escape(en.education.skillsLabel)}: ${escape(certification.skills)}</p><a href="${escape(certification.url)}">${escape(en.education.showCredential)}</a></article>`).join('');
  const contents: Record<string, string> = {
    about: (site.display.frontPage.biography ? en.about.paragraphs : []).map(paragraph => `<p>${escape(plain(paragraph))}</p>`).join(''),
    experience: experience.map(item => `<article><h3>${escape(item.role)} — ${escape(item.company)}</h3><p>${escape(item.period)}</p>${list(item.description)}</article>`).join(''),
    education: formalEducation + continuingEducation + (site.display.groups.continuingEducation ? `<a href="${escape(site.continuingEducationUrl)}">${escape(en.education.viewAllCertifications)}</a>` : ''),
    projects: projects.map(project => `<article><h3>${escape(project.title)}</h3>${project.affiliation ? `<p>${escape(en.projects.affiliations[project.affiliation as keyof typeof en.projects.affiliations])}</p>` : ''}${list(project.description)}<p>${escape(project.tech.join(' · '))}</p>${project.link ? `<a href="${escape(project.link)}">${escape(en.projects.visit.replace('{title}', project.title))}</a>` : ''} ${project.github ? `<a href="${escape(project.github)}">${escape(en.projects.viewOnGithub.replace('{title}', project.title))}</a>` : ''}</article>`).join(''),
    skills: `<p>${escape(en.skills.philosophy)}</p>` + skills.map(category => `<h3>${escape(en.skills.categories[category.id as keyof typeof en.skills.categories] ?? category.id)}</h3><p>${escape(en.skills.notes[category.id as keyof typeof en.skills.notes] ?? '')}</p>${list(category.items.map(item => item.name))}`).join(''),
    blog: posts.map(post => `<article><h3><a href="${escape(post.link)}">${escape(post.title)}</a></h3><p>${escape(post.excerpt)}</p><time datetime="${escape(post.date)}">${escape(post.dateLabel)}</time></article>`).join(''),
    contact: `<p>${escape(en.contact.availability)}</p><p>${escape(en.contact.description)}</p><a href="mailto:${escape(site.person.email)}">${escape(en.contact.getInTouch)}</a>`,
  };
  const labels: Record<string, string> = {
    about: `${en.about.titleBefore} ${en.about.titleHighlight}`,
    experience: en.experience.title,
    education: en.education.title,
    projects: en.projects.title,
    skills: `${en.skills.titleBefore} ${en.skills.titleHighlight}`,
    blog: `${en.blog.titleBefore} ${en.blog.titleHighlight}`,
    contact: `${en.contact.titleBefore} ${en.contact.titleHighlight}`,
  };
  const fallback = `<header><nav aria-label="${escape(en.nav.mainNavigation)}">${sections.map(id => `<a href="#${id}">${escape(en.nav.links[id as keyof typeof en.nav.links])}</a>`).join(' · ')}</nav></header><main id="main"><h1>${escape(en.hero.srHeading)}</h1>${site.display.chrome.banner ? `<p>${escape(en.hero.bannerTitle)}</p><p>${escape(en.hero.description)}</p>` : ''}${sections.includes('about') && site.display.frontPage.portrait && site.display.frontPage.resume ? `<a href="${escape(site.person.resumeUrl)}">${escape(en.hero.resume)}</a>` : ''}${sections.map(id => `<section id="${id}"><h2>${escape(labels[id])}</h2>${contents[id] ?? ''}</section>`).join('')}</main>${site.display.chrome.footer ? `<footer>${social.map(social => `<a href="${escape(social.url)}">${escape(en.footer.social[social.platform as keyof typeof en.footer.social] ?? social.platform)}</a>`).join(' · ')}</footer>` : ''}`;

  const sectionText = (id: string): string => {
    if (id === 'projects') return projects.map(project => `- ${project.title}${project.affiliation ? ` (${en.projects.affiliations[project.affiliation as keyof typeof en.projects.affiliations]})` : ''}: ${project.description.join(' ')}`).join('\n');
    if (id === 'skills') return `${en.skills.philosophy}\n\n${skills.map(category => `${en.skills.categories[category.id as keyof typeof en.skills.categories]} — ${en.skills.notes[category.id as keyof typeof en.skills.notes]}: ${category.items.map(item => item.name).join(', ')}`).join('\n')}`;
    if (id === 'blog') return posts.map(post => `- [${post.title}](${post.link}): ${post.excerpt}`).join('\n');
    if (id === 'about') return (site.display.frontPage.biography ? en.about.paragraphs : []).map(plain).join('\n\n');
    if (id === 'experience') return experience.map(item => `${item.role}, ${item.company}, ${item.period}\n${item.description.join('\n')}`).join('\n\n');
    if (id === 'education') return [...education.map(item => `${item.degree}, ${item.institution}, ${item.period}\n${item.details.join('\n')}`), ...certifications.map(certification => `${certification.title}, ${certification.issuer}, ${certification.date}\n${en.education.skillsLabel}: ${certification.skills}\n${certification.url}`), ...(site.display.groups.continuingEducation ? [en.education.viewAllCertifications + ': ' + site.continuingEducationUrl] : [])].join('\n\n');
    return `${en.contact.availability}\n${en.contact.description}\n${en.common.emailLabel}: ${site.person.email}`;
  };
  const llms = `# ${site.person.name}\n\n> ${site.seo.description}\n\n${sections.map(id => `## ${labels[id]}\n\n${sectionText(id)}\n`).join('\n')}\n## ${en.common.linksLabel}\n\n${social.map(social => `- [${social.platform}](${social.url})`).join('\n')}\n- [${en.common.sitemapLabel}](${url}sitemap.xml)\n`;
  return { metadata, fallback, llms };
}

export function createNotFoundDocument(site: SearchSite, en: SearchLocale, theme: SearchTheme) {
  const url = `${site.siteUrl.replace(/\/$/, '')}/`;
  const title = `${en.notFound.title} | ${site.person.name}`;
  const shareImage = absolute(url, site.seo.shareImage);
  const shareImageAlt = en.seo.shareImageAlt.replace('{name}', site.person.name);
  const color = (name: string) => {
    const [hue, saturation, lightness] = theme.light[name as keyof typeof theme.light].split(/\s+/);
    return `hsl(${hue}, ${saturation}, ${lightness})`;
  };
  return `<!doctype html>
<html lang="${escape(en.language.code.toLowerCase())}" dir="ltr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escape(title)}</title>
<meta name="description" content="${escape(en.notFound.description)}" />
<meta name="robots" content="noindex, follow" />
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(en.notFound.description)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${escape(shareImage)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="${escape(shareImageAlt)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(en.notFound.description)}" />
<meta name="twitter:image" content="${escape(shareImage)}" />
<meta name="twitter:image:alt" content="${escape(shareImageAlt)}" />
<meta name="theme-color" content="${escape(site.seo.themeColor)}" />
<link rel="icon" href="/favicon.ico?v=broadsheet" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=broadsheet" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=broadsheet" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=IBM+Plex+Mono:wght@400;600&family=Newsreader:wght@400;600&display=swap" />
<style>
:root{--paper:${color('background')};--ink:${color('foreground')};--desk:${color('desk')};--rule:${color('border')};--red:${color('primary')};--on-red:${color('primary-foreground')}}
*{box-sizing:border-box}body{margin:0;background:var(--desk);color:var(--ink);font-family:Newsreader,Georgia,serif}.page{width:min(52rem,calc(100% - 2rem));margin:8vh auto;background:var(--paper);border:1px solid var(--ink);padding:clamp(1.5rem,5vw,4rem)}.kicker,.meta,a{font-family:'IBM Plex Mono',monospace}.kicker{color:var(--red);font-size:.75rem;font-weight:600;letter-spacing:.12em}.number{margin:.5rem 0 0;font-family:Fraunces,Georgia,serif;font-size:clamp(5rem,20vw,10rem);line-height:.9}h1{margin:1rem 0;font-family:Fraunces,Georgia,serif;font-size:clamp(1.8rem,5vw,3rem);line-height:1.05}.message{font-size:1.25rem}.description{padding-top:1rem;border-top:1px solid var(--rule);line-height:1.6}a{display:inline-block;margin-top:1rem;background:var(--red);color:var(--on-red);padding:.85rem 1.1rem;text-decoration:none;font-size:.8rem;font-weight:600}a:focus-visible{outline:3px solid var(--red);outline-offset:4px}@media print{body{background:var(--paper)}.page{margin:0 auto}}
</style>
</head>
<body><main class="page" id="main"><div class="kicker">${escape(en.nav.editionBadge)}</div><div class="number" aria-hidden="true">404</div><h1>${escape(en.notFound.title)}</h1><p class="message">${escape(en.notFound.message)}</p><p class="description">${escape(en.notFound.description)}</p><a href="/">${escape(en.notFound.backHome)}</a></main></body>
</html>`;
}
