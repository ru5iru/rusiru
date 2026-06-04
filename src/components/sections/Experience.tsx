import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Plus, Minus } from 'lucide-react';

const experiences = [
	{
		company: "Omobio (Pvt) Ltd",
		role: "Associate Software Engineer",
		period: "May 2024 - Present",
		isCurrent: true,
		description: [
			"Served as a key software engineer for the Dialog.lk platform while also functioning as the L3 support engineer for the application.",
			"Developed and maintained API integrations, backend services, and microservice-based solutions using Kafka and RESTful APIs.",
			"Managed and supported cloud infrastructure, containerized deployments, and orchestration workflows using AWS, Docker, and Kubernetes (K8s).",
			"Implemented secure coding standards and contributed to application security initiatives aligned with OWASP best practices and ISO 27001 compliance requirements.",
			"Troubleshot and resolved production issues, optimized application performance, and improved overall system reliability and availability.",
			"Collaborated with cross-functional teams in agile environments to deliver scalable, high-quality, and enterprise-grade software solutions.",
			"Contributed to CI/CD pipeline management, release processes, and DevOps initiatives to streamline development and deployment workflows.",
		],
	},
	{
		company: "Omobio (Pvt) Ltd",
		role: "Trainee Full-Stack Developer",
		period: "November 2023 - May 2024",
		isCurrent: false,
		description: [
			"Gained hands-on experience in full-stack development using React.js, Node.js, and PHP while contributing to enterprise-level applications.",
			"Served as the L3 support engineer for the Dialog.lk and Dialog BizCare platforms.",
			"Supported bug fixing, production issue handling, and live application support for Dialog BizCare and Dialog.lk, ensuring minimal service downtime and operational continuity.",
			"Analyzed and resolved application and system issues by reviewing server logs, debugging services, and collaborating with cross-functional teams.",
			"Participated in requirement gathering, solution planning, and system design activities for a production automation system developed for tea factories.",
		],
	},
];

export function Experience() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="experience"
      className="py-24 md:py-32 bg-muted/30 relative overflow-hidden"
      aria-label="Work Experience of Rusiru Rathmina"
    >
      {/* GEO: Structured summary for AI engines */}
      <div data-geo-summary="experience" className="sr-only" aria-hidden="false">
        Rusiru Rathmina has over 2 years of professional experience. He currently serves as an Associate Software Engineer at Omobio (Pvt) Ltd since May 2024, where he refactors legacy systems to meet OWASP Top 10 security standards, implements secure APIs, and works within agile CI/CD pipelines. Previously, he worked as a Trainee Full-Stack Developer at the same company from November 2023, supporting production systems including Dialog BizCare and Dialog.lk for Dialog Axiata PLC.
      </div>
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6 relative" ref={ref}>
        {/* Heading */}
        <h2
          className={`text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Work Experience
        </h2>

        {/* Top divider */}
        <div
          className={`h-px bg-border mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          } origin-left`}
        />

        {/* Experience items */}
        <div className="space-y-0">
          {experiences.map((exp, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={`${exp.company}-${exp.role}`}
                className={`border-b border-border transition-all duration-700 relative ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Row */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full py-6 md:py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 text-left group cursor-pointer"
                >
                  {/* Role badge */}
                  <div className="md:w-1/3 shrink-0">
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/25">
                      {exp.role}
                    </span>
                  </div>

                  {/* Date & Company */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">
                      <time dateTime={exp.isCurrent ? '2024-05' : '2023-11'}>{exp.period}</time>
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {exp.company}
                    </h3>
                  </div>

                  {/* Toggle icon */}
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  {/* Mobile toggle */}
                  <div className="md:hidden absolute right-0 top-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[600px] opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="space-y-2 md:pl-[33.333%] md:pr-14">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
