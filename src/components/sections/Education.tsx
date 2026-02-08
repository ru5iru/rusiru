import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import ucscLogo from '@/assets/logos/ucsc-logo.png';
import mcgLogo from '@/assets/logos/mcg-logo.png';

const education = [
  {
    institution: 'University of Colombo School of Computing',
    degree: 'Bachelor of Science in Computer Science',
    period: 'May 2021 - October 2024',
    gpa: 'GPA: 3.01',
    logo: ucscLogo,
  },
  {
    institution: 'Mahinda College, Galle',
    degree: 'GCE Advanced Level (Physical Science)',
    period: 'Feb 2010 - Aug 2019',
    achievements: [
      { title: 'A/L Results', value: 'A B C | Z-Score: 1.3084' },
      { title: 'O/L Results', value: '8A 1B' },
    ],
    logo: mcgLogo,
  },
];

export function Education() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="education" className="py-24 md:py-32 relative overflow-hidden" aria-label="Education of Rusiru Rathmina">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="gradient-text">Education</span>
          </h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div
                key={edu.institution}
                className={`group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="h-full bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 gradient-bg opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />

                  {/* Logo */}
                  <div className="w-12 h-12 mb-6">
                    <img src={edu.logo} alt={edu.institution} className="w-full h-full object-contain" />
                  </div>

                  {/* Institution */}
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {edu.institution}
                  </h3>

                  {/* Degree */}
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium gradient-text">{edu.degree}</span>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.period}</span>
                  </div>

                  {/* GPA or Achievements */}
                  {edu.gpa && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-foreground">{edu.gpa}</span>
                    </div>
                  )}

                  {edu.achievements && (
                    <div className="space-y-2">
                      {edu.achievements.map((achievement) => (
                        <div key={achievement.title} className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{achievement.title}:</span>{' '}
                            {achievement.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
