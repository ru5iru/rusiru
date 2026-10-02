import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ExternalLink, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig, resolveIcon, allSkills } from '@/config';


interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readTime: string;
  link: string;
}

export function Blog() {
  const { ref, isVisible } = useScrollAnimation();
  const { t, tr } = useTranslation();
  const blogPosts = tr<BlogPost[]>('blog.posts') ?? [];

  return (
    <section id="blog" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden" aria-label={t('blog.ariaLabel')}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('blog.titleBefore')} <span className="gradient-text">{t('blog.titleHighlight')}</span>
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article
                key={post.title}
                className={`group bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6"
              >
                {/* Date & Read Time */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <time dateTime={post.date} className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.dateLabel}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('blog.readMore')}
                  <ExternalLink className="w-4 h-4" />
                </div>
                </a>
              </article>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-10">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-2 hover:bg-primary/5 transition-all duration-300"
            >
              <a
                href={siteConfig.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('blog.visitBlog')}
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
