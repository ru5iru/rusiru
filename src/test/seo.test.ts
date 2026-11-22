import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import site from '@/config/site.json';
import theme from '@/config/theme.json';
import en from '@/locales/en.json';
import { createNotFoundDocument, createSearchContent } from '../../scripts/search-content';

const content = createSearchContent(site, en);

describe('SEO audit corrections', () => {
  it('uses the confirmed current role in visible and structured content', () => {
    expect(site.person.jobTitle).toBe(en.experience.items[0].role);
    const schema = JSON.parse(content.metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
    const person = schema['@graph'].find((item: Record<string, unknown>) => item['@type'] === 'Person');
    expect(person.jobTitle).toBe('Software Engineer');
  });

  it('omits the unverified profile creation date', () => {
    expect(site.seo).not.toHaveProperty('dateCreated');
    expect(content.metadata).not.toContain('dateCreated');
  });

  it('marks React-managed static tags for replacement instead of duplication', () => {
    expect(content.metadata).toContain('<title data-rh="true">');
    expect(content.metadata).toContain('name="description" content=');
    expect(content.metadata).toContain('rel="canonical" href="https://rusiru.cc/" data-rh="true"');
    expect(content.metadata).toContain('name="robots" content="index, follow" data-rh="true"');
  });

  it('emits an absolute configured social image with localized alternative text', () => {
    const image = `https://rusiru.cc${site.seo.shareImage}`;
    expect(content.metadata).toContain(`property="og:image" content="${image}"`);
    expect(content.metadata).toContain('property="og:image:width" content="1200"');
    expect(content.metadata).toContain('property="og:image:height" content="630"');
    expect(content.metadata).toContain(`name="twitter:image" content="${image}"`);
    expect(content.metadata).toContain(en.seo.shareImageAlt.replace('{name}', site.person.name));
  });

  it('generates a localized noindex error document without a canonical or application script', () => {
    const error = createNotFoundDocument(site, en, theme);
    expect(error.match(/name="description"/g)).toHaveLength(1);
    expect(error.match(/name="robots"/g)).toHaveLength(1);
    expect(error).toContain('name="robots" content="noindex, follow"');
    expect(error).not.toContain('rel="canonical"');
    expect(error).not.toContain('/src/main.tsx');
    expect(error).toContain(en.notFound.message);
    expect(error).toContain('/favicon.svg');
  });

  it('uses the verified article and repository destinations', () => {
    expect(en.blog.posts.map(post => post.link)).toEqual([
      'https://blog.rusiru.cc/2026/03/owasp-top-ten.html',
      'https://blog.rusiru.cc/2026/03/clean-code-principles.html',
      'https://blog.rusiru.cc/2025/12/code-review-etiquette.html',
    ]);
    expect(en.projects.items.find(project => project.title === 'Jira Worklog Manager')?.github).toBe('https://github.com/ru5iru/jira-time-tracker-pages');
    expect(en.projects.items.find(project => project.title === 'Project-X')).not.toHaveProperty('github');
    expect(en.projects.items.find(project => project.title === 'ToDo')).not.toHaveProperty('github');
  });

  it('removes the soft-404 rewrite and canonicalizes the index.html alias', () => {
    const netlify = fs.readFileSync('netlify.toml', 'utf8');
    expect(netlify).not.toContain('status = 200');
    expect(netlify).toContain('from = "/index.html"');
    expect(netlify).toContain('to = "/"');
    expect(netlify).toContain('status = 301');
    expect(netlify).toContain('force = true');
  });
});
