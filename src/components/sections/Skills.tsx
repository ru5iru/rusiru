import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'Java', icon: '☕' },
      { name: 'JavaScript', icon: '🟨' },
      { name: 'PHP', icon: '🐘' },
      { name: 'C++', icon: '⚡' },
    ],
  },
  {
    title: 'Frameworks',
    skills: [
      { name: 'React', icon: '⚛️' },
      { name: 'Node.js', icon: '💚' },
      { name: 'Spring Boot', icon: '🌱' },
      { name: 'Drupal', icon: '💧' },
      { name: 'Yii', icon: '🔷' },
      { name: 'Laravel', icon: '🔴' },
      { name: 'Symfony', icon: '⬛' },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MySQL', icon: '🐬' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Redis', icon: '🔴' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', icon: '☁️' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Kubernetes', icon: '☸️' },
      { name: 'Jenkins', icon: '🔧' },
      { name: 'Kafka', icon: '📊' },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', icon: '📦' },
      { name: 'Linux', icon: '🐧' },
      { name: 'SonarQube', icon: '🔍' },
      { name: 'Postman', icon: '📮' },
    ],
  },
];

export function Skills() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Technical <span className="gradient-text">Skills</span>
          </h2>

          <div className="max-w-5xl mx-auto space-y-10">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.title}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${categoryIndex * 100}ms` }}
              >
                <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-0.5 gradient-bg rounded-full" />
                  {category.title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill.name}
                      className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-105 cursor-default"
                      style={{
                        transitionDelay: `${categoryIndex * 100 + skillIndex * 50}ms`,
                      }}
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {skill.icon}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {skill.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
