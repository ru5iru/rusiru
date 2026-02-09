import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
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

  const displayedProjects = showAll ? projects : projects.filter((p) => p.featured);

  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden" aria-label="Projects by Rusiru Rathmina">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Featured <span className="gradient-text">Projects</span>
          </h2>

          <div className="max-w-5xl mx-auto space-y-8">
            {displayedProjects.map((project, index) => (
              <article
                key={project.title}
                className={`group bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title} live website`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-2 mb-6">
                  {project.description.map((desc, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="leading-relaxed">{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
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
      </div>
    </section>
  );
}
