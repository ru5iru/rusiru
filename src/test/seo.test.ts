import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import site from '@/config/site.json';
import theme from '@/config/theme.json';
import { english as en } from '@/i18n/locales';
import { createNotFoundDocument, createSearchContent } from '../../scripts/search-content';

const content = createSearchContent(site, en);

describe('configurable SEO generation', () => {
  it('uses the configured occupation independently of experience records', () => {
    const schema = JSON.parse(content.metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
    const person = schema['@graph'].find((item: Record<string, unknown>) => item['@type'] === 'Person');
    expect(person.jobTitle).toBe(site.person.jobTitle);
  });

  it('marks React-managed static tags for replacement instead of duplication', () => {
    expect(content.metadata).toContain('<title data-rh="true">');
    expect(content.metadata).toContain('name="description" content=');
    expect(content.metadata).toContain(`rel="canonical" href="${new URL('/', site.siteUrl).href}" data-rh="true"`);
    expect(content.metadata).toContain('name="robots" content="index, follow" data-rh="true"');
  });

  it('emits an absolute configured social image with localized alternative text', () => {
    const image = new URL(site.seo.shareImage, site.siteUrl).href;
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

  it('supports a different owner, domain, and optional project destinations', () => {
    const customSite = { ...site, siteUrl: 'https://portfolio.example.net', person: { ...site.person, name: 'Another Person', jobTitle: 'Product Designer' } };
    const customLocale = structuredClone(en);
    customLocale.projects.items = [{ ...en.projects.items[0], id: 'custom-project', title: 'Custom Project', github: 'https://example.net/custom-repository', link: 'https://example.net/custom-project' }];
    customLocale.blog.posts = [];
    customLocale.experience.items = [];
    const custom = createSearchContent(customSite, customLocale);
    const schema = JSON.parse(custom.metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
    const person = schema['@graph'].find((item: Record<string, unknown>) => item['@type'] === 'Person');
    expect(person.name).toBe(customSite.person.name);
    expect(person.jobTitle).toBe(customSite.person.jobTitle);
    expect(custom.metadata).toContain('href="https://portfolio.example.net/"');
    expect(custom.fallback).toContain(customLocale.projects.items[0].github);
    expect(custom.fallback).toContain(customLocale.projects.items[0].link);
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
