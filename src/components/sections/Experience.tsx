import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Briefcase, Calendar } from 'lucide-react';

const experiences = [
  {
    company: 'Omobio (Pvt) Ltd',
    role: 'Associate Software Engineer',
    period: 'May 2024 - Present',
    isCurrent: true,
    responsibilities: [
      'Contributed to refactoring the Dialog.lk legacy codebase to meet OWASP Top 10 security guidelines and SonarQube quality standards.',
      'Implemented secure APIs, caching mechanisms, and performance optimizations within cloud-based environments.',
      'Successfully delivered critical change requests under tight timelines while ensuring system stability and code quality.',
      'Collaborated closely within agile teams, adhering to CI/CD pipelines and secure software development lifecycle best practices.',
      'Conducted peer code reviews and supported onboarding of new team members to maintain engineering standards.',
    ],
  },
  {
    company: 'Omobio (Pvt) Ltd',
    role: 'Trainee Full-Stack Developer',
    period: 'November 2023 - May 2024',
    isCurrent: false,
    responsibilities: [
      'Developed a strong foundation in full-stack development while supporting live production systems, including Dialog BizCare and Dialog.lk.',
      'Assisted in resolving production issues and bugs to minimize service disruptions by analyzing logs and coordinating with cross-functional teams.',
      'Worked under the guidance of senior engineers, following agile practices and established coding standards.',
      'Participated in requirement analysis, planning, and design of a production automation system for tea factories.',
    ],
  },
];

export function Experience() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="experience" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden" aria-label="Work Experience of Rusiru Rathmina">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Work <span className="gradient-text">Experience</span>
          </h2>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent" />

            {experiences.map((exp, index) => (
              <div
                key={`${exp.company}-${exp.role}`}
                className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline marker */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-2">
                  <div
                    className={`w-4 h-4 rounded-full gradient-bg ${
                      exp.isCurrent ? 'animate-glow-pulse' : ''
                    }`}
                  />
                  {exp.isCurrent && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full gradient-bg animate-ping opacity-75" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`ml-16 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'
                  }`}
                >
                  <div className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                    {/* Company & Role */}
                    <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-foreground">
                          {exp.company}
                        </h3>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold gradient-text mb-2">{exp.role}</h4>

                    <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                      {exp.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium gradient-bg text-white">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Responsibilities */}
                    <ul className={`space-y-2 text-sm text-muted-foreground ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
