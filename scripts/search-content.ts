import type siteDefaults from '../src/config/site.json';
import type english from '../src/locales/en.json';

export type SearchSite = typeof siteDefaults;
export type SearchLocale = typeof english;
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] ?? character));
const plain = (value: string) => value.replace(/\*\*|==/g, '');
const list = (values: string[]) => `<ul>${values.map(value => `<li>${escape(plain(value))}</li>`).join('')}</ul>`;

export function createSearchContent(site: SearchSite, en: SearchLocale) {
  const url = `${site.siteUrl.replace(/\/$/, '')}/`;
  const projects = en.projects.items;
  const personId = `${url}#person`;
  const credentials = en.education.certifications.map(certification => ({
    '@type': 'EducationalOccupationalCredential',
    name: certification.title,
    url: certification.url,
    recognizedBy: { '@type': 'Organization', name: certification.issuer },
  }));
  const person = {
    '@type': 'Person', '@id': personId, name: site.person.name, jobTitle: site.person.jobTitle, url,
    image: new URL(site.person.profileImage, url).href, email: site.person.email,
    sameAs: site.social.map(social => social.url),
    address: { '@type': 'PostalAddress', addressLocality: site.person.location.city, addressCountry: site.person.location.countryCode },
    knowsAbout: site.skills.flatMap(category => category.items.map(item => item.name)),
    ...(site.sections.includes('education') ? {
      alumniOf: en.education.items.map(item => ({ '@type': 'EducationalOrganization', name: item.institution })),
      hasCredential: credentials,
    } : {}),
  };
  const graph: unknown[] = [
    person,
    { '@type': 'ProfilePage', '@id': url, url, name: site.seo.title, description: site.seo.description, dateCreated: site.seo.dateCreated, inLanguage: en.language.code.toLowerCase(), mainEntity: { '@id': personId } },
    { '@type': 'WebSite', url, name: site.seo.title, author: { '@id': personId } },
  ];
  if (site.sections.includes('projects')) graph.push({ '@type': 'ItemList', numberOfItems: projects.length, itemListElement: projects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'CreativeWork', name: project.title, description: project.description.join(' '), url: project.link ?? project.github, author: { '@id': personId } } })) });
  if (site.sections.includes('blog')) graph.push({ '@type': 'Blog', url: site.blogUrl, author: { '@id': personId }, blogPost: en.blog.posts.map(post => ({ '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: post.date, url: post.link, author: { '@id': personId } })) });

  const metadata = `<title>${escape(site.seo.title)}</title>
<meta name="description" content="${escape(site.seo.description)}" />
<link rel="canonical" href="${escape(url)}" />
<meta name="author" content="${escape(site.person.name)}" />
<meta name="robots" content="index, follow" />
<meta property="og:title" content="${escape(site.seo.title)}" />
<meta property="og:description" content="${escape(site.seo.ogDescription)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${escape(url)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(site.seo.title)}" />
<meta name="twitter:description" content="${escape(site.seo.ogDescription)}" />
<meta name="theme-color" content="${escape(site.seo.themeColor)}" />
<meta name="geo.region" content="${escape(site.person.location.countryCode)}" />
<meta name="geo.placename" content="${escape(site.person.location.city)}, ${escape(site.person.location.country)}" />
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;

  const formalEducation = en.education.items.map(item => `<article><h3>${escape(item.degree)}</h3><p>${escape(item.institution)} · ${escape(item.period)}</p>${list(item.details)}</article>`).join('');
  const continuingEducation = en.education.certifications.map(certification => `<article><h3>${escape(certification.title)}</h3><p>${escape(certification.issuer)} · ${escape(certification.date)}</p><p>${escape(en.education.skillsLabel)}: ${escape(certification.skills)}</p><a href="${escape(certification.url)}">${escape(en.education.showCredential)}</a></article>`).join('');
  const contents: Record<string, string> = {
    about: en.about.paragraphs.map(paragraph => `<p>${escape(plain(paragraph))}</p>`).join(''),
    experience: en.experience.items.map(item => `<article><h3>${escape(item.role)} — ${escape(item.company)}</h3><p>${escape(item.period)}</p>${list(item.description)}</article>`).join(''),
    education: formalEducation + continuingEducation + `<a href="${escape(site.continuingEducationUrl)}">${escape(en.education.viewAllCertifications)}</a>`,
    projects: projects.map(project => `<article><h3>${escape(project.title)}</h3>${list(project.description)}<p>${escape(project.tech.join(' · '))}</p>${project.link ? `<a href="${escape(project.link)}">${escape(en.projects.visit.replace('{title}', project.title))}</a>` : ''} ${project.github ? `<a href="${escape(project.github)}">${escape(en.projects.viewOnGithub.replace('{title}', project.title))}</a>` : ''}</article>`).join(''),
    skills: `<p>${escape(en.skills.philosophy)}</p>` + site.skills.map(category => `<h3>${escape(en.skills.categories[category.id as keyof typeof en.skills.categories] ?? category.id)}</h3><p>${escape(en.skills.notes[category.id as keyof typeof en.skills.notes] ?? '')}</p>${list(category.items.map(item => item.name))}`).join(''),
    blog: en.blog.posts.map(post => `<article><h3><a href="${escape(post.link)}">${escape(post.title)}</a></h3><p>${escape(post.excerpt)}</p><time datetime="${escape(post.date)}">${escape(post.dateLabel)}</time></article>`).join(''),
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
  const fallback = `<header><nav aria-label="${escape(en.nav.mainNavigation)}">${site.sections.map(id => `<a href="#${id}">${escape(en.nav.links[id as keyof typeof en.nav.links])}</a>`).join(' · ')}</nav></header><main id="main"><h1>${escape(en.hero.srHeading)}</h1><p>${escape(en.hero.bannerTitle)}</p><p>${escape(en.hero.description)}</p><a href="${escape(site.person.resumeUrl)}">${escape(en.hero.resume)}</a>${site.sections.map(id => `<section id="${id}"><h2>${escape(labels[id])}</h2>${contents[id] ?? ''}</section>`).join('')}</main><footer>${site.social.map(social => `<a href="${escape(social.url)}">${escape(en.footer.social[social.platform as keyof typeof en.footer.social] ?? social.platform)}</a>`).join(' · ')}</footer>`;

  const sectionText = (id: string): string => {
    if (id === 'projects') return projects.map(project => `- ${project.title}: ${project.description.join(' ')}`).join('\n');
    if (id === 'skills') return `${en.skills.philosophy}\n\n${site.skills.map(category => `${en.skills.categories[category.id as keyof typeof en.skills.categories]} — ${en.skills.notes[category.id as keyof typeof en.skills.notes]}: ${category.items.map(item => item.name).join(', ')}`).join('\n')}`;
    if (id === 'blog') return en.blog.posts.map(post => `- [${post.title}](${post.link}): ${post.excerpt}`).join('\n');
    if (id === 'about') return en.about.paragraphs.map(plain).join('\n\n');
    if (id === 'experience') return en.experience.items.map(item => `${item.role}, ${item.company}, ${item.period}\n${item.description.join('\n')}`).join('\n\n');
    if (id === 'education') return [...en.education.items.map(item => `${item.degree}, ${item.institution}, ${item.period}\n${item.details.join('\n')}`), ...en.education.certifications.map(certification => `${certification.title}, ${certification.issuer}, ${certification.date}\n${en.education.skillsLabel}: ${certification.skills}\n${certification.url}`), en.education.viewAllCertifications + ': ' + site.continuingEducationUrl].join('\n\n');
    return `${en.contact.availability}\n${en.contact.description}\n${en.common.emailLabel}: ${site.person.email}`;
  };
  const llms = `# ${site.person.name}\n\n> ${site.seo.description}\n\n${site.sections.map(id => `## ${labels[id]}\n\n${sectionText(id)}\n`).join('\n')}\n## ${en.common.linksLabel}\n\n${site.social.map(social => `- [${social.platform}](${social.url})`).join('\n')}\n- [${en.common.sitemapLabel}](${url}sitemap.xml)\n`;
  return { metadata, fallback, llms };
}
