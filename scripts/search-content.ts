import type siteDefaults from '../src/config/site.json';
import type english from '../src/locales/en.json';
export type SearchSite = typeof siteDefaults;
export type SearchLocale = typeof english;
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
const plain = (value: string) => value.replace(/\*\*|==/g, '');
const list = (values: string[]) => `<ul>${values.map(value => `<li>${escape(plain(value))}</li>`).join('')}</ul>`;
export function createSearchContent(site: SearchSite, en: SearchLocale) {
  const url = `${site.siteUrl.replace(/\/$/, '')}/`;
  const projects = en.projects.items;
  const personId = `${url}#person`;
  const person = { '@type': 'Person', '@id': personId, name: site.person.name, jobTitle: site.person.jobTitle, url, image: new URL(site.person.profileImage, url).href, email: site.person.email, sameAs: site.social.map(s => s.url), address: { '@type': 'PostalAddress', addressLocality: site.person.location.city, addressCountry: site.person.location.countryCode }, knowsAbout: site.skills.flatMap(s => s.items.map(i => i.name)), ...(site.sections.includes('education') ? { alumniOf: en.education.items.map(i => ({ '@type': 'EducationalOrganization', name: i.institution })) } : {}) };
  const graph: unknown[] = [person, { '@type': 'ProfilePage', '@id': url, url, name: site.seo.title, description: site.seo.description, dateCreated: site.seo.dateCreated, inLanguage: en.language.code.toLowerCase(), mainEntity: { '@id': personId } }, { '@type': 'WebSite', url, name: site.seo.title, author: { '@id': personId } }];
  if (site.sections.includes('projects')) graph.push({ '@type': 'ItemList', numberOfItems: projects.length, itemListElement: projects.map((p, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'CreativeWork', name: p.title, description: p.description.join(' '), url: ('link' in p ? p.link : undefined) ?? ('github' in p ? p.github : undefined), author: { '@id': personId } } })) });
  if (site.sections.includes('blog')) graph.push({ '@type': 'Blog', url: site.blogUrl, author: { '@id': personId }, blogPost: en.blog.posts.map(p => ({ '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.date, url: p.link, author: { '@id': personId } })) });
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
  const contents: Record<string, string> = {
    about: en.about.paragraphs.map(p => `<p>${escape(plain(p))}</p>`).join('') + list(en.about.stats.map(s => `${s.value} ${s.label}`)),
    experience: en.experience.items.map(i => `<article><h3>${escape(i.role)} — ${escape(i.company)}</h3><p>${escape(i.period)}</p>${list(i.description)}</article>`).join(''),
    education: en.education.items.map(i => `<article><h3>${escape(i.degree)}</h3><p>${escape(i.institution)} · ${escape(i.period)}</p>${list(i.details)}</article>`).join(''),
    projects: projects.map(p => `<article><h3>${escape(p.title)}</h3>${list(p.description)}<p>${escape(p.tech.join(' · '))}</p>${'link' in p ? `<a href="${escape(p.link)}">${escape(en.projects.visit.replace('{title}', p.title))}</a>` : ''} ${'github' in p ? `<a href="${escape(p.github)}">${escape(en.projects.viewOnGithub.replace('{title}', p.title))}</a>` : ''}</article>`).join(''),
    skills: site.skills.map(c => `<h3>${escape(en.skills.categories[c.id as keyof typeof en.skills.categories] ?? c.id)}</h3>${list(c.items.map(i => i.name))}`).join(''),
    blog: en.blog.posts.map(p => `<article><h3><a href="${escape(p.link)}">${escape(p.title)}</a></h3><p>${escape(p.excerpt)}</p><time datetime="${escape(p.date)}">${escape(p.dateLabel)}</time></article>`).join(''),
    contact: `<p>${escape(en.contact.description)}</p><a href="mailto:${escape(site.person.email)}">${escape(en.contact.getInTouch)}</a>`,
  };
  const labels: Record<string, string> = { about: `${en.about.titleBefore} ${en.about.titleHighlight}`, experience: en.experience.title, education: en.education.title, projects: en.projects.title, skills: `${en.skills.titleBefore} ${en.skills.titleHighlight}`, blog: `${en.blog.titleBefore} ${en.blog.titleHighlight}`, contact: `${en.contact.titleBefore} ${en.contact.titleHighlight}` };
  const fallback = `<header><nav aria-label="${escape(en.nav.mainNavigation)}">${site.sections.map(id => `<a href="#${id}">${escape(en.nav.links[id as keyof typeof en.nav.links])}</a>`).join(' · ')}</nav></header><main id="main"><h1>${escape(en.hero.srHeading)}</h1><p>${escape(en.hero.description)}</p><a href="${escape(site.person.resumeUrl)}">${escape(en.hero.resume)}</a>${site.sections.map(id => `<section id="${id}"><h2>${escape(labels[id])}</h2>${contents[id] ?? ''}</section>`).join('')}</main><footer>${site.social.map(s => `<a href="${escape(s.url)}">${escape(en.footer.social[s.platform as keyof typeof en.footer.social] ?? s.platform)}</a>`).join(' · ')}</footer>`;
  const llms = `# ${site.person.name}\n\n> ${site.seo.description}\n\n${site.sections.map(id => `## ${labels[id]}\n\n${id === 'projects' ? projects.map(p => `- ${p.title}: ${p.description.join(' ')}`).join('\n') : id === 'skills' ? site.skills.flatMap(c => c.items.map(i => i.name)).join(', ') : id === 'blog' ? en.blog.posts.map(p => `- [${p.title}](${p.link}): ${p.excerpt}`).join('\n') : id === 'about' ? en.about.paragraphs.map(plain).join('\n\n') : id === 'experience' ? en.experience.items.map(i => `${i.role}, ${i.company}, ${i.period}\n${i.description.join('\n')}`).join('\n\n') : id === 'education' ? en.education.items.map(i => `${i.degree}, ${i.institution}, ${i.period}\n${i.details.join('\n')}`).join('\n\n') : `${en.contact.description}\nEmail: ${site.person.email}`}\n`).join('\n')}\n## Links\n\n${site.social.map(s => `- [${s.platform}](${s.url})`).join('\n')}\n- [Sitemap](${url}sitemap.xml)\n`;
  return { metadata, fallback, llms };
}
