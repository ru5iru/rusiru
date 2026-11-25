import { lazy, Suspense, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { LoadingState, LoadBoundary } from '@/components/LoadState';
import { navigateToSection } from '@/lib/navigation';

const About = lazy(() => import('@/components/sections/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('@/components/sections/Experience').then(m => ({ default: m.Experience })));
const Education = lazy(() => import('@/components/sections/Education').then(m => ({ default: m.Education })));
const Projects = lazy(() => import('@/components/sections/Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('@/components/sections/Skills').then(m => ({ default: m.Skills })));
const Blog = lazy(() => import('@/components/sections/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));

const sectionMap: Record<string, React.ComponentType> = { about: About, experience: Experience, education: Education, projects: Projects, skills: Skills, blog: Blog, contact: Contact };
const { siteUrl, person } = siteConfig;

const Index = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && siteConfig.sections.includes(id)) return navigateToSection(id);
  }, []);
  return (
    <>
      <Seo />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-primary-foreground">
        {t('common.skipToContent')}
      </a>
      <div itemScope itemType="https://schema.org/ProfilePage">
        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Person">
          <meta itemProp="name" content={person.name} />
          <meta itemProp="jobTitle" content={person.jobTitle} />
          <meta itemProp="url" content={siteUrl} />
        </div>
        <Navbar>
          <main id="main" tabIndex={-1}>
            <Hero />
            {siteConfig.sections.map(key => { const S = sectionMap[key]; return S ? <LoadBoundary key={key}><Suspense fallback={<LoadingState />}><S /></Suspense></LoadBoundary> : null; })}
          </main>
          <Footer />
        </Navbar>
      </div>
      <BackToTop />
    </>
  );
};

export default Index;
