import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ExternalLink, Github, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'Dialog.lk',
    link: 'https://dialog.lk/',
    isExternal: true,
    description: [
      'Enterprise CMS-based web platform for Dialog Axiata customers, supporting connection management, billing, and account services.',
      'Refactoring the legacy codebase to comply with OWASP Top 10 security guidelines and SonarQube quality standards.',
      'Developed a custom Drupal module to send transactional emails via Amazon SES.',
      'Implemented multiple critical change requests within tight deadlines.',
    ],
    tech: ['Drupal', 'Yii', 'React', 'Kafka', 'Redis', 'AWS', 'Kubernetes'],
    featured: true,
  },
  {
    title: 'Dialog BizCare',
    description: [
      'Enterprise customer management portal for corporate clients of Dialog Axiata.',
      'Served as a Level 3 support engineer, resolving critical bugs and live production issues within defined SLAs.',
      'Investigated and diagnosed production issues through detailed server log analysis.',
    ],
    tech: ['Yii', 'Keycloak'],
    featured: true,
  },
  {
    title: 'Project-X',
    github: 'https://github.com/ru5iru/Project-X',
    description: [
      'Produce collection and production automation system designed for farmers.',
      'Implemented storage, customer, and supplier management modules using an MVC-based architecture.',
      'Built a modern frontend using React and integrated a CMS-based backend.',
    ],
    tech: ['Directus', 'React', 'PostgreSQL', 'Docker'],
    featured: true,
  },
  {
    title: 'Roamly',
    github: 'https://github.com/ru5iru/Roamly',
    description: [
      'Travel recommendation and experience-sharing platform for travel enthusiasts.',
      'Recommends places, hotels, travel guides, taxi rides, and shops.',
      'Includes an experience-sharing platform where travelers can connect and share their stories.',
    ],
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Sass'],
    featured: false,
  },
  {
    title: 'Micro CAPS',
    github: 'https://github.com/BhanukaRajk/MicroCAPS',
    description: [
      'Assembly process management system for Micro Car Limited.',
      'Manages vehicle assembly process from chassis delivery to dispatching.',
    ],
    tech: ['PHP', 'AJAX', 'MySQL', 'JavaScript'],
    featured: false,
  },
  {
    title: 'ToDo',
    github: 'https://github.com/ru5iru/ToDo',
    description: [
      'Task manager app built with Flutter.',
      'Capable of managing tasks, adding reminders, and setting priorities.',
    ],
    tech: ['Flutter'],
    featured: false,
  },
];

export function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden" aria-label="Projects by Rusiru Rathmina">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative" ref={ref}>
        <h2
          className={`text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Featured Projects
        </h2>

        <div
          className={`h-px bg-border mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          } origin-left`}
        />

        <div className="space-y-0">
          {featuredProjects.map((project, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={project.title}
                className={`border-b border-border transition-all duration-700 relative ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full py-6 md:py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 text-left group cursor-pointer"
                >
                  <div className="md:w-1/3 shrink-0 flex items-center gap-3">
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/25">
                      {project.title}
                    </span>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`} className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`} className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 ml-4">
                    {isOpen ? <Minus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /> : <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>
                  <div className="md:hidden absolute right-0 top-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border">
                      {isOpen ? <Minus className="w-3.5 h-3.5 text-muted-foreground" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'}`}>
                  <ul className="space-y-2 md:pl-[33.333%] md:pr-14">
                    {project.description.map((desc, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}

          {/* Other projects with smooth transition */}
          <div
            className={`overflow-hidden transition-all duration-600 ease-in-out ${
              showAll ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {otherProjects.map((project, i) => {
              const globalIndex = featuredProjects.length + i;
              const isOpen = openIndex === globalIndex;
              return (
                <article
                  key={project.title}
                  className={`border-b border-border transition-all duration-500 relative ${
                    showAll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: showAll ? `${i * 100}ms` : '0ms' }}
                >
                  <button
                    onClick={() => toggle(globalIndex)}
                    className="w-full py-6 md:py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 text-left group cursor-pointer"
                  >
                    <div className="md:w-1/3 shrink-0 flex items-center gap-3">
                      <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/25">
                        {project.title}
                      </span>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`} className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`} className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 ml-4">
                      {isOpen ? <Minus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /> : <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                    </div>
                    <div className="md:hidden absolute right-0 top-6">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border">
                        {isOpen ? <Minus className="w-3.5 h-3.5 text-muted-foreground" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-2 md:pl-[33.333%] md:pr-14">
                      {project.description.map((desc, di) => (
                        <li key={di} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setShowAll(!showAll);
              setOpenIndex(0);
            }}
            className="rounded-full px-8 border-2 hover:bg-primary/5 transition-all duration-300 group"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="ml-2 w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </>
            ) : (
              <>
                View More Projects
                <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
