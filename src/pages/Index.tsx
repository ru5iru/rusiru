import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';

const About = lazy(() => import('@/components/sections/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('@/components/sections/Experience').then(m => ({ default: m.Experience })));
const Education = lazy(() => import('@/components/sections/Education').then(m => ({ default: m.Education })));
const Projects = lazy(() => import('@/components/sections/Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('@/components/sections/Skills').then(m => ({ default: m.Skills })));
const Blog = lazy(() => import('@/components/sections/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Rusiru Rathmina | Full-Stack Software Engineer</title>
        <meta name="description" content="Rusiru Rathmina is a Software Engineer focused on full-stack development and cloud solutions, delivering scalable applications with attention to quality." />
        <link rel="canonical" href="https://rusiru.lovable.app/" />
        <meta property="og:title" content="Rusiru Rathmina | Full-Stack Software Engineer" />
        <meta property="og:description" content="Portfolio of Rusiru Rathmina — Full-Stack Software Engineer in Colombo, Sri Lanka, building scalable apps with Java, Spring Boot, React, and AWS." />
        <meta property="og:url" content="https://rusiru.lovable.app/" />
      </Helmet>
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/ProfilePage">
      <meta itemProp="dateCreated" content="2024-01-01" />
      <meta itemProp="dateModified" content="2026-02-23" />
      <div itemProp="mainEntity" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content="Rusiru Rathmina" />
        <meta itemProp="jobTitle" content="Associate Software Engineer" />
        <meta itemProp="url" content="https://rusiru.lovable.app" />
      </div>

      {/* Skip to content link */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Experience />
          <Education />
          <Projects />
          <Skills />
          <Blog />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </div>
    </>
  );
};

export default Index;
