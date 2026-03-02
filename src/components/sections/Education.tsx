import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Plus, Minus } from 'lucide-react';
import ucscLogo from '@/assets/logos/ucsc-logo.png';
import mcgLogo from '@/assets/logos/mcg-logo.png';

const education = [
  {
    institution: 'University of Colombo School of Computing',
    degree: 'Bachelor of Science in Computer Science',
    period: 'May 2021 - October 2024',
    details: ['GPA: 3.01'],
    logo: ucscLogo,
  },
  {
    institution: 'Mahinda College, Galle',
    degree: 'GCE Advanced Level (Physical Science)',
    period: 'Feb 2010 - Aug 2019',
    details: [
      'A/L Results: A B C | Z-Score: 1.3084',
      'O/L Results: 8A 1B',
    ],
    logo: mcgLogo,
  },
];

export function Education() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="education" className="py-24 md:py-32 relative overflow-hidden" aria-label="Education of Rusiru Rathmina">
      {/* GEO: Education summary for AI engines */}
      <div data-geo-summary="education" className="sr-only" aria-hidden="false">
        Rusiru Rathmina holds a Bachelor of Science in Computer Science from the University of Colombo School of Computing (UCSC), graduating with a GPA of 3.01 (May 2021 – October 2024). He completed his GCE Advanced Level in Physical Science at Mahinda College, Galle, achieving results of A B C with a Z-Score of 1.3084, and GCE Ordinary Level results of 8A 1B.
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative" ref={ref}>
        <h2
          className={`text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Education
        </h2>

        <div
          className={`h-px bg-border mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          } origin-left`}
        />

        <div className="space-y-0">
          {education.map((edu, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={edu.institution}
                className={`border-b border-border transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full py-6 md:py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-left group cursor-pointer"
                >
                  {/* Degree badge + mobile toggle row */}
                  <div className="md:w-1/3 shrink-0 flex items-center gap-3 min-w-0">
                    <img src={edu.logo} alt={`${edu.institution} logo`} className="w-8 h-8 object-contain shrink-0" loading="lazy" width={32} height={32} />
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/25 leading-snug mr-auto">
                      {edu.degree}
                    </span>
                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-border shrink-0">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Period & Institution */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">{edu.period}</p>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {edu.institution}
                    </h3>
                  </div>

                  {/* Desktop toggle icon */}
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="space-y-2 md:pl-[33.333%] md:pr-14">
                    {edu.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
