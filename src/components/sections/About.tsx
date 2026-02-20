import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Code2, Cloud, Shield, Rocket } from 'lucide-react';

const stats = [
  { value: '2+', label: 'Years Experience', icon: Rocket },
  { value: '10+', label: 'Technologies Integrated', icon: Code2 },
  { value: '25+', label: 'Technologies', icon: Cloud },
  { value: '100%', label: 'Code Quality', icon: Shield },
];

export function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden" aria-label="About Rusiru Rathmina" itemScope itemType="https://schema.org/AboutPage">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            About <span className="gradient-text">Me</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`space-y-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                👋 Hello! I'm <span className="text-foreground font-semibold">Rusiru Rathmina</span>, 
                a <span className="text-foreground font-semibold">Software Engineer</span> at{' '}
                <span className="gradient-text font-semibold">Omobio (Pvt) Ltd</span>, specializing in{' '}
                <span className="text-foreground font-semibold">Full-Stack Development</span>,{' '}
                <span className="text-foreground font-semibold">Cloud Computing</span>, and{' '}
                <span className="text-foreground font-semibold">DevOps</span>.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                My journey began as a trainee, and I have since grown into designing scalable solutions 
                using <span className="text-foreground font-semibold">Java, Spring Boot, React, and AWS</span>. 
                I have extensive hands-on experience refactoring legacy systems and building secure, 
                reliable applications.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                My expertise covers the full lifecycle—from frontend design with{' '}
                <span className="text-foreground font-semibold">React.js</span> to backend logic in{' '}
                <span className="text-foreground font-semibold">PHP/Drupal</span> and infrastructure 
                management using <span className="text-foreground font-semibold">Docker</span> and{' '}
                <span className="text-foreground font-semibold">Kubernetes</span>.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                🚀 I am always open to collaborating on <span className="gradient-text font-semibold">Full-Stack</span> or{' '}
                <span className="gradient-text font-semibold">DevOps</span> projects. Let's connect and shape 
                the future of technology together!
              </p>
            </div>

            {/* Stats Grid */}
            <div
              className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="gradient-border p-6 rounded-2xl bg-card hover:scale-105 transition-transform duration-300 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-4xl font-display font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
