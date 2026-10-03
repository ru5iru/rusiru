import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig, resolveIcon, allSkills } from '@/config';


const About = lazy(() => import('@/components/sections/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('@/components/sections/Experience').then(m => ({ default: m.Experience })));
const Education = lazy(() => import('@/components/sections/Education').then(m => ({ default: m.Education })));
const Projects = lazy(() => import('@/components/sections/Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('@/components/sections/Skills').then(m => ({ default: m.Skills })));
const Blog = lazy(() => import('@/components/sections/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));

const sectionMap: Record<string, React.ComponentType> = { about: About, experience: Experience, education: Education, projects: Projects, skills: Skills, blog: Blog, contact: Contact };
const { seo, siteUrl, person } = siteConfig;
const url = `${siteUrl}/`;

const Index = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:url" content={url} />
      </Helmet>
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/ProfilePage">
      <meta itemProp="dateCreated" content={seo.dateCreated} />
      <meta itemProp="dateModified" content={new Date().toISOString().slice(0, 10)} />
      <div itemProp="mainEntity" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content={person.name} />
        <meta itemProp="jobTitle" content={person.jobTitle} />
        <meta itemProp="url" content={siteUrl} />
      </div>

      {/* Skip to content link */}
      <a
        href={`#${siteConfig.sections[0] ?? "main"}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        {t('common.skipToContent')}
      </a>

      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          {siteConfig.sections.map((key) => { const S = sectionMap[key]; return S ? <S key={key} /> : null; })}
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </div>
    </>
  );
};

export default Index;
