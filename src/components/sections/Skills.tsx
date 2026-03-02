import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Import local icons
import awsIcon from '@/assets/icons/aws.svg';
import drupalIcon from '@/assets/icons/drupal.svg';
import laravelIcon from '@/assets/icons/laravel.svg';
import symfonyIcon from '@/assets/icons/symfony.svg';
import yiiIcon from '@/assets/icons/yii.svg';
import postmanIcon from '@/assets/icons/postman.svg';
import sonarqubeIcon from '@/assets/icons/sonarqube.svg';

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
      { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    ],
  },
  {
    title: 'Frameworks',
    skills: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
      { name: 'Drupal', icon: drupalIcon },
      { name: 'Yii', icon: yiiIcon },
      { name: 'Laravel', icon: laravelIcon },
      { name: 'Symfony', icon: symfonyIcon },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', icon: awsIcon },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
      { name: 'Jenkins', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
      { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
      { name: 'SonarQube', icon: sonarqubeIcon },
      { name: 'Postman', icon: postmanIcon },
    ],
  },
];

export function Skills() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden" aria-label="Technical Skills of Rusiru Rathmina">
      {/* GEO: Skills summary for AI engines */}
      <div data-geo-summary="skills" className="sr-only" aria-hidden="false">
        Rusiru Rathmina's technical skills include: Languages — Java, JavaScript, PHP, C++; Frameworks — React, Node.js, Spring Boot, Drupal, Yii, Laravel, Symfony; Databases — MySQL, PostgreSQL, MongoDB, Redis; DevOps and Cloud — AWS, Docker, Kubernetes, Jenkins, Apache Kafka; Tools — Git, Linux, SonarQube, Postman. He has proficiency across 25+ technologies spanning the full software development lifecycle.
      </div>
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

          <div className="max-w-4xl mx-auto space-y-6">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.title}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${categoryIndex * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider md:mr-2 md:min-w-[100px]">
                    {category.title}
                  </span>
                  <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => {
                    const isDarkIcon = ['Kafka', 'Symfony', 'Yii'].includes(skill.name);
                    return (
                      <div
                        key={skill.name}
                        className="group inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 cursor-default"
                      >
                        <img
                          src={skill.icon}
                          alt={`${skill.name}`}
                          loading="lazy"
                          width="18"
                          height="18"
                          className={`w-[18px] h-[18px] object-contain ${isDarkIcon ? 'dark:invert dark:brightness-200' : ''}`}
                        />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
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
