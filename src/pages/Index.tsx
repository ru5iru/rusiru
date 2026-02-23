import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Blog } from '@/components/sections/Blog';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';

const Index = () => {
  return (
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
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
