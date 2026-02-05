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
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-0.5 gradient-bg rounded-full" />
                  {category.title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.skills.map((skill, skillIndex) => {
                    const isWideIcon = skill.name === 'SonarQube' || skill.name === 'Laravel';
                    return (
                      <div
                        key={skill.name}
                        className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-105 cursor-default"
                        style={{
                          transitionDelay: `${categoryIndex * 100 + skillIndex * 50}ms`,
                        }}
                      >
                        <div className={`${isWideIcon ? 'w-16' : 'w-10'} h-10 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                          <img 
                            src={skill.icon} 
                            alt={skill.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {skill.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
